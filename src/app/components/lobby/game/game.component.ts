import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Dice } from 'src/app/models/dice';
import { GameStatusLabel } from 'src/app/models/game-status-label.enum';
import { GameStatus } from 'src/app/models/game-status.enum';
import { Game } from 'src/app/models/game.model';
import { Lobby } from 'src/app/models/lobby.model';
import { Player } from 'src/app/models/player';
import { Property } from 'src/app/models/property';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { ConfirmComponent } from '../../layout/confirm/confirm.component';
import { LobbySocketService } from '../sockets/lobby-socket.service';
import {debounceTime} from 'rxjs/operators';
import { GameResults } from '../../../models/gameResults';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input('lobby') lobby: Lobby
  @Output() updateGameEvent: EventEmitter<Game> = new EventEmitter<Game>()


  gameStatusLabel = GameStatusLabel
  gameStatus = GameStatus
  newDices: Dice[] = []
  selectedDice: number[] = [];
  costs: number = 0;
  rollingDices: boolean = false;
  isDiceChosen: boolean = false
  isCostError: boolean = false;
  resultProperties: string[] = ["dice9", "dice10", "diceStore", "diceSaloon", "diceSherif", "diceAce"]
  

  constructor(public authenticationService: AuthenticationService,
              private lobbySocketService: LobbySocketService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.resultProperties);
    
    
    this.lobbySocketService.updateGame().subscribe(game => {
      this.updateGameEvent.emit(game)
    })
  }

  getFirst3properties(): Property[]{
    return [...this.lobby.game.property].slice(0, 3)
  }

  getSherif(): User{
    return this.lobby.users.find(user => this.lobby.game.sherifUserid === user.id)
  }
  
  getPlayer(): Player{
    return this.lobby.game.players.find(player => player.userId === this.authenticationService.getIdFromToken())
  }

  getGameStatus(): string{
    return GameStatusLabel[this.lobby.game.status]
  }

  rollDices(): void{
    this.lobby.game.players.find(player => player.userId === this.authenticationService.getIdFromToken()).canThrowDices = false
    this.isDiceChosen = false

    let player: Player = this.getPlayer()
    const newDicesLen: number = 5-player.dices.length
    const isAutoChooseAll = this.lobby.game.players.some(player => this.nonHiddenDices(player.dices).length === 5)
    this.setRandomDices(newDicesLen, isAutoChooseAll)
  }
  
  validateDiceChoice(): void{

    this.isCostError = false
    if(this.costs >= this.getPlayer().dollar){
      this.snackbarService.openError(`Not enough money: ${this.getPlayer().dollar}$ - ${this.costs}$ = ${this.getPlayer().dollar-this.costs}$`)
      this.isCostError = true
      return
    }
    this.dialog.open(ConfirmComponent, {
      height: '200px',
      width: '500px',
    }).afterClosed().subscribe(doAction => {
      if(doAction) {

        this.lobbySocketService.setDices(this.lobby.id, this.newDices.filter((dice, index) => this.isDiceSelected(index)))
        this.isDiceChosen = true
        this.selectedDice = []
        this.newDices = []
      }
    })
  }

  setRandomDices(count: number, isAutoChooseAll: boolean = false): void{
    this.rollingDices = true
    setTimeout(() => {
      this.rollingDices = false
      let dices: Dice[] = []
      for (let i = 0; i < count; i++) {
        dices.push(new Dice(this.getRandomIntInclusive(9, 14), true))
      }

      
      this.newDices = dices
      if(isAutoChooseAll){
        
        //if at least one player has 5 dices all dices are selected, and no more costs added
        this.selectedDice = []        
        for (let i = 0; i < this.newDices.length; i++) {
          this.selectDice(i, true)
        }
        this.costs = 0

      }else{
        this.selectDice(0, true)
      }      
    }, 1000)
  }


  getRandomIntInclusive(min: number, max: number): number{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  selectDice(index: number, isAutoSelect: boolean = false): void{

    if(!isAutoSelect && this.lobby.game.players.some(player => this.nonHiddenDices(player.dices).length === 5)){
      this.snackbarService.openError("Can't un-select dices, this is the last round (an other player has reached 5 dices)")
      return
    }

    if(index < 0){
      this.selectedDice = []
    } else {
      if(!this.isDiceSelected(index)) 
        this.selectedDice.push(index)
      else
        this.selectedDice.splice(this.selectedDice.indexOf(index), 1)
    }
    this.costs = this.computeCosts(this.newDices.filter((dice, index) => this.isDiceSelected(index)))

    this.isCostError = false
    if(this.costs >= this.getPlayer().dollar){
      this.snackbarService.openError(`Not enough money: ${this.getPlayer().dollar}$ - ${this.costs}$ = ${this.getPlayer().dollar-this.costs}$`)
      this.isCostError = true
    }
  }

  isDiceSelected(index: number): boolean{
    return this.selectedDice.includes(index)
  }

  computeCosts(dices: Dice[]): number{
    if(!dices.length)
      return 1
    return dices.length - 1
  }

  getNameWaitingFor(): string[]{
    return this.lobby.users
      .filter(user => this.lobby.game.waitingFor.includes(user.id))
      .map(user => user.name)
  }

  getOtherPlayers(): Player[]{
    return this.lobby.game.players.filter(player => player.userId !== this.authenticationService.getIdFromToken() && this.lobby.users.map(user => user.id).includes(player.userId))
  }

  getUserOfPlayer(player: Player): User{
    return this.lobby.users.find(user => user.id === player.userId)
  }

  getStatusOfPlayer(player: Player): string{
    let isWaitingHim = this.isWaitingForPlayer(player)
    if(isWaitingHim){
      return this.getGameStatus()
    }
    return ""
  }

  isWaitingForPlayer(player: Player) {
    return this.lobby.game.waitingFor.includes(player.userId)
  }

  nonHiddenDices(dices: Dice[]){
    return dices.filter(dice => !dice.hidden)
  }
}
