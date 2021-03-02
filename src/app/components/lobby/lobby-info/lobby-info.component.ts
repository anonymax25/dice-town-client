import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { LobbySocket } from 'src/app/app.module';
import { Lobby } from 'src/app/models/lobby.model';
import { ReadyStatus } from 'src/app/models/readyStatus';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service';
import { ConfirmComponent } from '../../layout/confirm/confirm.component';
import { LobbySocketService } from '../lobby-socket.service';
import { LobbyService } from '../lobby.service';

@Component({
  selector: 'app-lobby-info',
  templateUrl: './lobby-info.component.html',
  styleUrls: ['./lobby-info.component.scss']
})
export class LobbyInfoComponent implements OnInit {

  @Input('lobby') lobby: Lobby
  @Output() lobbyRefresh: EventEmitter<void> = new EventEmitter<void>()
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
    this.isReady = this.lobbyService.computeIsReady(this.lobby, this.authenticationService.getUserFromToken())
  }

  ngOnDestroy(): void {
    this.lobbySocketService.leaveLobby(this.lobby.id.toString(), this.authenticationService.getUserFromToken().name)
  }

  isOwner() {
    return this.lobby.ownerId === this.authenticationService.getIdFromToken()
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

  }

  quitLobby() {
    this.dialog.open(ConfirmComponent, {
      height: '200px',
      width: '500px',
    }).afterClosed().subscribe(response => {
      if (response) {
        this.lobbyService.quitUser(this.lobby, this.authenticationService.getIdFromToken()).subscribe(() => {
          this.router.navigate([`home`]);
          this.snackbarService.openSuccess("Left lobby")
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
    this.lobbySocketService.connect().subscribe(data => {
      this.isConnected = true
      this.lobbySocketService.joinLobby(this.lobby.id.toString(), this.authenticationService.getUserFromToken().name)
      console.log('lobby connected!');
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
      this.lobbyRefresh.emit()
    })
    this.lobbySocketService.userLeftLobby().subscribe(username => {
      this.snackbarService.openSuccess(`${username} has left the lobby`)
      this.lobbyRefresh.emit()
    })
    this.lobbySocketService.recieveReadyStatusUpdate().subscribe(readyStatus => {
      this.lobby.readyStatus = readyStatus
      this.isReady = this.lobbyService.computeIsReady(this.lobby, this.authenticationService.getUserFromToken())
    })
  }

  readyStatus() {
    const readyStatus = new ReadyStatus(this.lobby.id, this.authenticationService.getIdFromToken(), !this.isReady)
    this.lobbySocketService.sendReadyStatusUpdate(readyStatus)
  }
}