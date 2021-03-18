import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { LobbySocketService } from '../lobby-socket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input('lobby') lobby: Lobby
  @Output() updateGameEvent: EventEmitter<Game> = new EventEmitter<Game>()


  gameStatusLabel = GameStatusLabel
  newDices: Dice[] = []
  selectedDice: number[] = [];
  costs: number = 0;
  rollingDices: boolean = false;
  isDiceChosen: boolean = false
  isCostError: boolean = false;

  constructor(public authenticationService: AuthenticationService,
              private lobbySocketService: LobbySocketService,
              private snackbarService: SnackbarService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    
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

    let player = this.getPlayer()
    const newDicesLen = 5-player.dices.length
    this.setRandomDices(newDicesLen)
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

  setRandomDices(count: number): void{
    this.rollingDices = true
    setTimeout(() => {
      this.rollingDices = false
      let dices: Dice[] = []
      for (let i = 0; i < count; i++) {
        dices.push(new Dice(this.getRandomInt(9, 14)))
      }
      this.newDices = dices
      this.selectDice(0)
    }, 1000)
  }


  getRandomInt(min, max): number{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  selectDice(index: number): void{
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
}
