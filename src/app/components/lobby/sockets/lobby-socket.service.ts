import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dice } from 'src/app/models/dice';
import { Game } from 'src/app/models/game.model';
import { Lobby } from 'src/app/models/lobby.model';
import { ReadyStatus } from 'src/app/models/readyStatus';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from '../../../../environments/environment';

declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class LobbySocketService {

  lobbySocket;
  
  constructor(private authenticationService: AuthenticationService) { 
  }

  connect(){
    this.lobbySocket = io.connect(`${environment.api}:${environment.chatSocketPort}`);
  }

  connected(): Observable<void> {
    return new Observable<void>(obs => {
      this.lobbySocket.on('connect', () => {
        console.log(this.lobbySocket);
        
        obs.next()
      });
    })
  }

  joinLobby(LobbyId: string, username: string){
    this.lobbySocket.emit('joinLobbySocket', {lobbyId: LobbyId, username: username, uid: this.authenticationService.getIdFromToken()} )
  }
  
  test(){
    this.lobbySocket.emit('test', {})
  }

  joinedLobby(): Observable<string> {
    return new Observable<string>(obs => {
      this.lobbySocket.on('joinedLobbySocket', (msg: string) => {
        obs.next(msg)
      });
    })
  }

  leaveLobby(LobbyId: string, username: string){
    this.lobbySocket.emit('leaveLobbySocket', {lobbyId: LobbyId, username: username, uid: this.authenticationService.getIdFromToken()})
  }

  leftLobby(): Observable<string>{
    return new Observable<string>(obs => {
      this.lobbySocket.on('leftLobbySocket', (msg: string) => {
        obs.next(msg)
      });
    })
  }
  
  userJoinedLobby(): Observable<string>{
    return new Observable<string>(obs => {
      this.lobbySocket.on('userJoinedLobby', (msg: string) => {
        obs.next(msg)
      });
    })
  }
  
  userLeftLobby(): Observable<string>{
    return new Observable<string>(obs => {
      this.lobbySocket.on('userLeftLobby', (msg: string) => {
        obs.next(msg)
      });
    })
  }

  recieveReadyStatusUpdate(): Observable<ReadyStatus[]>{
    return new Observable<ReadyStatus[]>(obs => {
      this.lobbySocket.on('updatedReadyStatus', (msg: ReadyStatus[]) => {
        obs.next(msg)
      });
    })
  }

  sendReadyStatusUpdate(readyStatus: ReadyStatus){
    this.lobbySocket.emit("updateReadyStatus", readyStatus);
  }

  switchStartGame(lobbyId: number){    
    this.lobbySocket.emit("switchStartGame", {lobbyId});
  }

  startGameSwitched(): Observable<Lobby>{
    return new Observable<Lobby>(obs => {
      this.lobbySocket.on('startGameSwitched', (msg: Lobby) => {
        obs.next(msg)
      });
    })
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
    return new Observable<Game>(obs => {
      this.lobbySocket.on('updateGame', (msg: Game) => {
        obs.next(msg)
      });
    })
  }
  
  newWaitingFor(): Observable<number[]>{
    return new Observable<number[]>(obs => {
      this.lobbySocket.on('newWaitingFor', (msg: number[]) => {
        obs.next(msg)
      });
    })
  }
  
  recieveAlert(): Observable<string>{
    return new Observable<string>(obs => {
      this.lobbySocket.on('recieveAlert', (msg: string) => {
        obs.next(msg)
      });
    })
  }
}
