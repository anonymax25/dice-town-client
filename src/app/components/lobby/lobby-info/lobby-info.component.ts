import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Lobby } from 'src/app/models/lobby.model';
import { ReadyStatus } from 'src/app/models/readyStatus';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { ConfirmComponent } from '../../layout/confirm/confirm.component';
import { LobbySocketService } from '../sockets/lobby-socket.service';
import { LobbyService } from '../lobby.service';

@Component({
  selector: 'app-lobby-info',
  templateUrl: './lobby-info.component.html',
  styleUrls: ['./lobby-info.component.scss']
})
export class LobbyInfoComponent implements OnInit {

  @Input('lobby') lobby: Lobby
  @Input('isLobbyConnected') isLobbyConnected: boolean
  @Output() lobbyRefreshEvent: EventEmitter<void> = new EventEmitter<void>()
  @Output() updateLobbyEvent: EventEmitter<Lobby> = new EventEmitter<Lobby>()
  @Output() chatResetEvent: EventEmitter<void> = new EventEmitter<void>()
  isReady: boolean = false
  isConnected: boolean = false
  isJoined: boolean = false

  constructor(private lobbyService: LobbyService,
    private lobbySocketService: LobbySocketService,
    private clipboardService: ClipboardService,
    private dialog: MatDialog,
    public authenticationService: AuthenticationService,
    public snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.initLobbySocket()
    this.isReady = this.lobbyService.computeIsUserReady(this.lobby, this.authenticationService.getUserFromToken())
  }

  ngOnDestroy(): void {
    this.lobbySocketService.leaveLobby(this.lobby.id.toString(), this.authenticationService.getUserFromToken().name)
  }

  isOwner(userId: number) {
    return this.lobby.ownerId === userId
  }

  isYou(user: User) {
    return user.id === this.authenticationService.getIdFromToken()
  }

  copyCodeToClipboard(code: string) {
    this.clipboardService.copy(code)
    this.snackbarService.openSuccess(`${code} saved to clipboard`)
  }

  getLobbyOwnerName(lobby: Lobby): string {
    return lobby.users.find(user => user.id === lobby.ownerId).name
  }

  destroyLobby() {
    this.dialog.open(ConfirmComponent, {
      height: '200px',
      width: '500px',
    }).afterClosed().subscribe(doAction => {
      if(doAction) {
        this.lobbyService.destroy(this.lobby).subscribe(() => {
          this.router.navigate(['game/finder'])
          this.snackbarService.openSuccess('Lobby destroyed')
        })
      }
    })
    
  }

  quitLobby() {
    this.dialog.open(ConfirmComponent, {
      height: '200px',
      width: '500px',
    }).afterClosed().subscribe(response => {
      if (response) {
        this.lobbyService.quitUser(this.lobby, this.authenticationService.getIdFromToken()).subscribe(() => {
          this.router.navigate([`home`]);
          this.snackbarService.openSuccess("Left lobby for good :'(")
        }, (err) => {
          this.snackbarService.openError("Couldn't leave lobby")
        })
      }
    })
  }

  getCountReady(): number {
    return this.lobby.readyStatus.filter(item => item.isReady).length
  }

  initLobbySocket() {
    this.lobbySocketService.connect()
    this.lobbySocketService.connected().subscribe(data => {
      this.isLobbyConnected = true
      
      this.lobbySocketService.test()

      this.lobbySocketService.joinLobby(this.lobby.id.toString(), this.authenticationService.getUserFromToken().name)
      console.log('lobby connected!');
    }, err => {
      console.log(err);
      
    })
    
    this.lobbySocketService.joinedLobby().subscribe(data => {
      this.isJoined = true
      console.log('joined lobby!', data);
    })
    this.lobbySocketService.leftLobby().subscribe(data => {
      this.isJoined = false
      console.log('left lobby!', data);
    })

    this.lobbySocketService.userJoinedLobby().subscribe(username => {
      this.snackbarService.openSuccess(`${username} has joined the lobby`)
      this.lobbyRefreshEvent.emit()
    })
    this.lobbySocketService.userLeftLobby().subscribe(username => {
      this.snackbarService.openSuccess(`${username} has left the lobby`)
      this.lobbyRefreshEvent.emit()
    })
    this.lobbySocketService.recieveReadyStatusUpdate().subscribe(readyStatus => {
      this.lobby.readyStatus = readyStatus
      this.isReady = this.lobbyService.computeIsUserReady(this.lobby, this.authenticationService.getUserFromToken())
    })
    this.lobbySocketService.startGameSwitched().subscribe(lobby => {
      this.chatResetEvent.emit()
      this.updateLobbyEvent.emit(lobby)
    })
  }

  readyStatus() {
    const readyStatus = new ReadyStatus(this.lobby.id, this.authenticationService.getIdFromToken(), !this.isReady)
    this.lobbySocketService.sendReadyStatusUpdate(readyStatus)
  }

  switchStartGame() {
    this.dialog.open(ConfirmComponent, {
      height: '200px',
      width: '500px',
    }).afterClosed().subscribe(doAction => {
      if(doAction) {
        this.lobbySocketService.switchStartGame(this.lobby.id)
      }
    })
  }

  capitalizeFirstLetter(string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}