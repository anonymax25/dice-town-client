import { Component, Input, OnInit } from '@angular/core';
import { Result } from '../../../../models/result';
import { Lobby } from '../../../../models/lobby.model';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { LobbyService } from '../../lobby.service';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.scss']
})
export class WinnerComponent implements OnInit {

  @Input('lobby') lobby: Lobby
  @Input('dice') dice: string
  result: Result;
  selectedPlayerId: number
  
  constructor(private userService: UserService,
              public lobbyService: LobbyService) { }

  ngOnInit(): void {
    this.result = this.lobby.game.results[this.dice]
  }

  getUserOfUserID(userId: number): User {
    return this.lobby.users.find(user => user.id === userId) || this.userService.getEmptyUser()
  }

  countPlayerDice(diceNum: number, userId: number): number{
    return this.lobby.game.players.find(user => user.userId === userId).dices.filter(dice => dice.value === diceNum).length
  }

  chooseWinner(userId: number) {

  }

  selectPlayerId(userId: number) {
    this.selectedPlayerId = userId;
  }
}
