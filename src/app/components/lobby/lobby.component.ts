import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Lobby } from 'src/app/models/lobby.model';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LobbyService } from 'src/app/services/lobby.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service'
import { ConfirmComponent } from '../layout/confirm/confirm.component';
import { ChatService } from './chat/chat.service';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  lobby: Lobby

  constructor(private route: ActivatedRoute,
              private router: Router,
              private lobbyService: LobbyService,
              private clipboardService: ClipboardService,
              private dialog: MatDialog,
              public authenticationService: AuthenticationService,
              public snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.lobbyService.get(params['code']).subscribe(lobby => {
        this.lobby = lobby  
      }, (err) => {
          this.snackbarService.openError('Can\'t load lobby')
          this.router.navigate(['game/finder'])
      })
    })
  }

  isOwner(){
    return this.lobby.ownerId === this.authenticationService.getIdFromToken()
  }

  isYou(user: User){
    return user.id === this.authenticationService.getIdFromToken()
  }

  copyCodeToClipboard(code: string){
    this.clipboardService.copy(code)
    this.snackbarService.openSuccess(`${code} saved to clipboard`)
  }

  getLobbyOwnerName(lobby: Lobby): string{    
    return lobby.users.find(user => user.id === lobby.ownerId).name
  }

  destroyLobby() {

  }

  quitLobby(){
    this.dialog.open(ConfirmComponent, {
      height: '200px',
      width: '500px',
    }).afterClosed().subscribe(response => {
      if(response) {
        this.lobbyService.quitUser(this.lobby, this.authenticationService.getIdFromToken()).subscribe(() => {
          this.router.navigate([`home`]);
          this.snackbarService.openSuccess("Left lobby")
        }, (err) => {
          this.snackbarService.openError("Couldn't leave lobby")
        })
      }
    })
  }

  
}
