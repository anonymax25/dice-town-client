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
    private clipboardService: ClipboardService,
    private dialog: MatDialog,
    public authenticationService: AuthenticationService,
    public snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.initLobbySocket()
    this.computeIsReady()
  }

  ngOnDestroy(): void {
    this.lobbyService.leaveLobby(this.lobby.id.toString(), this.authenticationService.getUserFromToken().name)
  }

  computeIsReady() {
    const readyStatus = this.lobby.readyStatus.find(item => item.uid == this.authenticationService.getIdFromToken())
    if (readyStatus)
      this.isReady = readyStatus.isReady
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
    this.lobbyService.connect().subscribe(data => {
      this.isConnected = true
      this.lobbyService.joinLobby(this.lobby.id.toString(), this.authenticationService.getUserFromToken().name)
      console.log('lobby connected!');
    })
    this.lobbyService.joinedLobby().subscribe(data => {
      this.isJoined = true
      console.log('joined lobby!', data);
    })
    this.lobbyService.leftLobby().subscribe(data => {
      this.isJoined = false
      console.log('left lobby!', data);
    })

    this.lobbyService.userJoinedLobby().subscribe(username => {
      this.snackbarService.openSuccess(`${username} has joined the lobby`)
      this.lobbyRefresh.emit()
    })
    this.lobbyService.userLeftLobby().subscribe(username => {
      this.snackbarService.openSuccess(`${username} has left the lobby`)
      this.lobbyRefresh.emit()
    })
    this.lobbyService.recieveReadyStatusUpdate().subscribe(readyStatus => {
      this.lobby.readyStatus = readyStatus
      this.computeIsReady()
    })
  }

  readyStatus() {
    const readyStatus = new ReadyStatus(this.lobby.id, this.authenticationService.getIdFromToken(), !this.isReady)
    this.lobbyService.sendReadyStatusUpdate(readyStatus)
  }

}
