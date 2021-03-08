import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Lobby } from 'src/app/models/lobby.model';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LobbyService } from './lobby.service';
import { SnackbarService } from 'src/app/shared/snackbar/snackbar.service'
import { ConfirmComponent } from '../layout/confirm/confirm.component';
import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  lobby: Lobby
  refreshChatEventSubject: Subject<void> = new Subject<void>();

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
        console.log(lobby);
        
        this.lobby = lobby  
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

  getCountReady(): number {
    return this.lobby.readyStatus.filter(item => item.isReady).length
  }

  chatReset() {
    this.refreshChatEventSubject.next()
  }
}
