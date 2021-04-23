import { Component, Input, OnInit } from '@angular/core';
import { Lobby } from 'src/app/models/lobby.model';
import { User } from '../../../models/user.model';
import { LobbyService } from '../lobby.service';

@Component({
  selector: 'app-lobby-waiting',
  templateUrl: './lobby-waiting.component.html',
  styleUrls: ['./lobby-waiting.component.scss']
})
export class LobbyWaitingComponent implements OnInit {

  @Input('lobby') lobby: Lobby

  constructor(public lobbyService: LobbyService) { }

  ngOnInit(): void {
  }

  getCountReady(): number {
    return this.lobby.readyStatus.filter(item => item.isReady).length
  }

  getOwner(): User {
    return this.lobby.users.find(user => user.id === this.lobby.ownerId);
  }
}
