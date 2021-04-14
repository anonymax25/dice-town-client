import { Component, Input, OnInit } from '@angular/core';
import { Lobby } from '../../../../models/lobby.model';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.scss']
})
export class WinnerComponent implements OnInit {

  @Input('lobby') lobby: Lobby
  @Input('dice') dice: string
  resultIds: number[] = []
  
  constructor() { }

  ngOnInit(): void {

    this.resultIds = this.lobby.game.results[this.dice]
  }

  getUserOfUserID(userId: number): User {
    return this.lobby.users.find(user => user.id === userId)
  }

  countPlayerDice(diceNum: number, userId: number): number{
    return this.lobby.game.players.find(user => user.userId === userId).dices.filter(dice => dice.value === diceNum).length
  }
}
