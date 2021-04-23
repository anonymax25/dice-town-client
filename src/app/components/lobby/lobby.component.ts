import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Lobby } from 'src/app/models/lobby.model';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GameStatusDisplay, LobbyService } from './lobby.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service'
import { ConfirmComponent } from '../layout/confirm/confirm.component';
import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';
import { Subject } from 'rxjs';
import { LobbySocketService } from './sockets/lobby-socket.service';
import { Player } from 'src/app/models/player';
import { Game } from 'src/app/models/game.model';
import { environment } from '../../../environments/environment';
import { ChatSocketService } from './sockets/chat-socket.service';
import { GameStatusLabel } from '../../models/game-status-label.enum';
import { GameStatus } from '../../models/game-status.enum';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  lobby: Lobby
  refreshChatEventSubject: Subject<void> = new Subject<void>();
  isLobbyConnected: boolean;
  gameStatusLabel = GameStatusLabel
  gameStatus = GameStatus
  gameStatusDisplay = GameStatusDisplay
  
  constructor(private route: ActivatedRoute,
              private router: Router,
              public lobbyService: LobbyService,
              public authenticationService: AuthenticationService,
              public snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.loadLobby()
  }

  loadLobby() {
    this.route.params.subscribe(params => {
      this.lobbyService.get(params['code']).subscribe(lobby => {
        this.lobby = lobby  
        console.log(lobby);
        
      }, (err) => {
          this.snackbarService.openError('Can\'t load lobby')
          this.router.navigate(['game/finder'])
      })
    })
  }

  getLobbyInfo() {
    if(!this.lobby)
      return ''
    return JSON.stringify(this.lobby.readyStatus, null, 2)
  }    

  chatReset() {
    this.refreshChatEventSubject.next()
  }
  
  updateLobbyEvent(lobby: Lobby) {
    this.lobby = lobby
  }
  
  updateGameEvent(game: Game) {
    this.lobby.game = game
  }
}
