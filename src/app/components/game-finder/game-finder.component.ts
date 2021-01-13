import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LobbyService } from 'src/app/services/lobby.service';
import { ConfirmComponent } from '../layout/confirm/confirm.component';

@Component({
  selector: 'app-game-finder',
  templateUrl: './game-finder.component.html',
  styleUrls: ['./game-finder.component.css']
})
export class GameFinderComponent implements OnInit {
  
  joinLobbyControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(6),
    Validators.minLength(6)
  ]);
  
  constructor(private router: Router,
              private dialog: MatDialog,
              private lobbyService: LobbyService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
  }

  createGame(){
    this.dialog.open(ConfirmComponent, {
      height: '200px',
      width: '500px',
    }).afterClosed().subscribe(doCreateGame => {
      if(doCreateGame) {
        this.lobbyService.create().subscribe(lobby => {
          this.router.navigate([`lobby/${lobby.code}`]);
        })
      }

      
    })
  }

  joinLobby(){

    this.lobbyService.get(this.joinLobbyControl.value).subscribe(lobby => {
      this.dialog.open(ConfirmComponent, {
        height: '200px',
        width: '500px',
      }).afterClosed().subscribe(doAction => {
        if(doAction) {
          this.lobbyService.joinUser(lobby, this.authenticationService.getIdFromToken()).subscribe(lobby => {
            this.router.navigate([`lobby/${lobby.code}`]);
          },error => {
            alert("can't join lobby")
          })
        }
  
        
      })
    }, error => {
      alert("lobby doesn't exist")
    })
  }

}
