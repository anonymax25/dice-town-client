import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lobby } from '../../models/lobby.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-lobby-list',
  templateUrl: './lobby-list.component.html',
  styleUrls: ['./lobby-list.component.scss']
})
export class LobbyListComponent implements OnInit {

  @Input('userId') userId: number
  lobbies: Lobby[]

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.userService.getUsersLobbies(this.userId).subscribe( lobbies => {
      this.lobbies = lobbies
    })
  }

  isOwner(lobby: Lobby){
    return lobby.ownerId === this.userId
  }

  routeToLobby(code: string){
    this.router.navigate([`lobby/${code}`])
  }

}
