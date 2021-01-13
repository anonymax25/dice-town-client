import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Lobby } from 'src/app/models/lobby.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LobbyService } from 'src/app/services/lobby.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service'
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  lobby: Lobby

  constructor(private route: ActivatedRoute,
              private router: Router,
              private lobbyService: LobbyService,
              private clipboardService: ClipboardService,
              private snackBar: MatSnackBar,
              public authenticationService: AuthenticationService,
              public snackbarService: SnackbarService) { }

  ngOnInit(): void {    
    this.route.params.subscribe(params => {
      this.lobbyService.get(params['code']).subscribe(lobby => {
        this.lobby = lobby
      }, (err) => {
          this.snackbarService.openError(err.message)
          this.router.navigate(['game/finder'])
      })
    })
  }

  isOwner(user: User){
    return this.lobby.ownerId === user.id
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
}
