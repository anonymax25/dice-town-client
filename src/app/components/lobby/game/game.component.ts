import { Component, Input, OnInit } from '@angular/core';
import { Lobby } from 'src/app/models/lobby.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input('lobby') lobby: Lobby

  constructor() { }

  ngOnInit(): void {
    console.log(this.lobby);
    
  }

  getFirst3properties(){
    return [...this.lobby.game.property].slice(0, 3)
  }

  getSherif() {
    return this.lobby.users.find(user => this.lobby.game.sherifUserid === user.id)
  }
}
