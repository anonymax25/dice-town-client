import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LobbySocket } from 'src/app/app.module';
import { Dice } from 'src/app/models/dice';
import { Game } from 'src/app/models/game.model';
import { Lobby } from 'src/app/models/lobby.model';
import { Player } from 'src/app/models/player';
import { ReadyStatus } from 'src/app/models/readyStatus';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LobbySocketService {

  constructor(private lobbySocket: LobbySocket,
              private authenticationService: AuthenticationService) { }

  connect() {
    return this.lobbySocket.fromEvent('connect')
  }

  joinLobby(LobbyId: string, username: string){
    this.lobbySocket.emit('joinLobbySocket', {lobbyId: LobbyId, username: username, uid: this.authenticationService.getIdFromToken()} )
  }

  joinedLobby(): Observable<string> {
    return this.lobbySocket.fromEvent('joinedLobbySocket')
  }

  leaveLobby(LobbyId: string, username: string){
    this.lobbySocket.emit('leaveLobbySocket', {lobbyId: LobbyId, username: username, uid: this.authenticationService.getIdFromToken()})
  }

  leftLobby(): Observable<string>{
    return this.lobbySocket.fromEvent('leftLobbySocket')
  }
  
  userJoinedLobby(): Observable<string>{
    return this.lobbySocket.fromEvent('userJoinedLobby')
  }
  
  userLeftLobby(): Observable<string>{
    return this.lobbySocket.fromEvent('userLeftLobby')
  }

  recieveReadyStatusUpdate(): Observable<ReadyStatus[]>{
    return this.lobbySocket.fromEvent('updatedReadyStatus')
  }

  sendReadyStatusUpdate(readyStatus: ReadyStatus){
    this.lobbySocket.emit("updateReadyStatus", readyStatus);
  }

  switchStartGame(lobbyId: number){    
    this.lobbySocket.emit("switchStartGame", {lobbyId});
  }

  startGameSwitched(): Observable<Lobby>{
    return this.lobbySocket.fromEvent('startGameSwitched')
  }

  setDices(lobbyId: number, dices: Dice[]){    
    const body = {
      dices,
      lobbyId,
      userId: this.authenticationService.getIdFromToken()
    }
    this.lobbySocket.emit("setDices", body);
  }

  updateGame(): Observable<Game>{
    return this.lobbySocket.fromEvent('updateGame')
  }
  
  newWaitingFor(): Observable<number[]>{
    return this.lobbySocket.fromEvent('newWaitingFor')
  }
  
  recieveAlert(): Observable<string>{
    return this.lobbySocket.fromEvent('recieveAlert')
  }
}
