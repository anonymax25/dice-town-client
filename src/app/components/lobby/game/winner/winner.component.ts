import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Result } from '../../../../models/result';
import { Lobby } from '../../../../models/lobby.model';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { ChooseWinner, LobbyService } from '../../lobby.service';
import { GameResults } from '../../../../models/gameResults';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.component.html',
  styleUrls: ['./winner.component.scss']
})
export class WinnerComponent implements OnInit {

  @Input('lobby') lobby: Lobby
  @Input('dice') dice: string
  @Input('updateGameResults') updateGameResults: Observable<GameResults>
  @Output('chooseWinner') chooseWinnerEvent: EventEmitter<Result> = new EventEmitter<Result>()
  result: Result;
  selectedPlayerId: number
  private updateGameResultsSubscription: Subscription;

  
  constructor(private userService: UserService,
              public lobbyService: LobbyService) { }

  ngOnInit(): void {
    this.result = this.lobby.game.results[this.dice]
    this.updateGameResultsSubscription = this.updateGameResults.subscribe((gameResult) => {
      this.result = gameResult[this.dice]
    });
  }

  ngOnDestroy() {
    this.updateGameResultsSubscription.unsubscribe();
  }

  getUserOfUserID(userId: number): User {
    return this.lobby.users.find(user => user.id === userId) || this.userService.getEmptyUser()
  }

  countPlayerDice(diceNum: number, userId: number): number{
    return this.lobby.game.players.find(user => user.userId === userId).dices.filter(dice => dice.value === diceNum).length
  }

  validateWinnerChoice() {
    this.result.ids = [this.selectedPlayerId]
    this.chooseWinnerEvent.emit(this.result);
  }

  selectPlayerId(userId: number) {
    this.selectedPlayerId = userId;
  }
}
