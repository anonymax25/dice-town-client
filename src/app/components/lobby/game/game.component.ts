import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dice } from 'src/app/models/dice';
import { GameStatusLabel } from 'src/app/models/game-status-label.enum';
import { GameStatus } from 'src/app/models/game-status.enum';
import { Lobby } from 'src/app/models/lobby.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ConfirmComponent } from '../../layout/confirm/confirm.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input('lobby') lobby: Lobby

  gameStatusLabel = GameStatusLabel
  newDices: Dice[] = []
  selectedDice: number[] = [];
  costs: number = 0;
  rollingDices: boolean = false;

  constructor(public authenticationService: AuthenticationService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getFirst3properties(){
    return [...this.lobby.game.property].slice(0, 3)
  }

  getSherif() {
    return this.lobby.users.find(user => this.lobby.game.sherifUserid === user.id)
  }
  
  getPlayer(){
    return this.lobby.game.players.find(player => player.userId === this.authenticationService.getIdFromToken())
  }

  getGameStatus(){
    return GameStatusLabel[this.lobby.game.status]
  }

  rollDices(){
    this.lobby.game.players.find(player => player.userId === this.authenticationService.getIdFromToken()).canThrowDices = false

    let player = this.getPlayer()
    const newDicesLen = 5-player.dices.length

    this.setRandomDices(newDicesLen)
  }
  
  choseDices(){
    this.dialog.open(ConfirmComponent, {
      height: '200px',
      width: '500px',
    }).afterClosed().subscribe(doAction => {
      if(doAction) {
        this.lobby.game.players.find(player => player.userId === this.authenticationService.getIdFromToken()).canThrowDices = true
        this.selectedDice = []
      }
    })
  }

  setRandomDices(count: number){
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


  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  selectDice(index: number){
    if(index < 0){
      this.selectedDice = []
    } else {
      if(!this.isDiceSelected(index)) 
        this.selectedDice.push(index)
      else
        this.selectedDice.splice(this.selectedDice.indexOf(index), 1)
    }
    this.costs = this.computeCosts()
  }

  isDiceSelected(index: number){
    return this.selectedDice.includes(index)
  }

  computeCosts(){
    if(!this.selectedDice.length)
      return 1
    return this.selectedDice.length - 1
  }
}
