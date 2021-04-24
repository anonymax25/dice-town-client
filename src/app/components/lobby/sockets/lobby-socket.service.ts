import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dice } from 'src/app/models/dice';
import { Game } from 'src/app/models/game.model';
import { Lobby } from 'src/app/models/lobby.model';
import { ReadyStatus } from 'src/app/models/readyStatus';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from '../../../../environments/environment';
import { GameResults } from '../../../models/gameResults';
import { Result } from '../../../models/result';
import { SocketService } from './socket.interface';


@Injectable({
  providedIn: 'root'
})
export class LobbySocketService implements SocketService {

  private socket;
  
  constructor(private authenticationService: AuthenticationService) { 
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io.connect(`${environment.apiHTTP}:${environment.lobbySocketPort}`);
      this.socket.on('connect', () => {
        resolve()
      }, err => {
        reject()
      })
    })
  }

  connected(): Observable<void> {
    return new Observable<void>(obs => {
      this.socket.on('connect', () => {
        obs.next()
      });
    })
  }
  
  disconnected(): Observable<void> {
    return new Observable<void>(obs => {
      this.socket.on('disconnect', () => {
        obs.next()
      });
    })
  }

  joinLobby(LobbyId: string, username: string){
    this.socket.emit('joinLobbySocket', {lobbyId: LobbyId, username: username, uid: this.authenticationService.getIdFromToken()} )
  }

  joinedLobby(): Observable<string> {
    return new Observable<string>(obs => {
      this.socket.on('joinedLobbySocket', (msg: string) => {
        obs.next(msg)
      });
    })
  }

  leaveLobby(LobbyId: string, username: string){
    this.socket.emit('leaveLobbySocket', {lobbyId: LobbyId, username: username, uid: this.authenticationService.getIdFromToken()})
  }

  leftLobby(): Observable<string>{
    return new Observable<string>(obs => {
      this.socket.on('leftLobbySocket', (msg: string) => {
        obs.next(msg)
      });
    })
  }
  
  userJoinedLobby(): Observable<string>{
    return new Observable<string>(obs => {
      this.socket.on('userJoinedLobby', (msg: string) => {
        obs.next(msg)
      });
    })
  }
  
  userLeftLobby(): Observable<string>{
    return new Observable<string>(obs => {
      this.socket.on('userLeftLobby', (msg: string) => {
        obs.next(msg)
      });
    })
  }

  recieveReadyStatusUpdate(): Observable<ReadyStatus[]>{
    return new Observable<ReadyStatus[]>(obs => {
      this.socket.on('updatedReadyStatus', (msg: ReadyStatus[]) => {
        obs.next(msg)
      });
    })
  }

  sendReadyStatusUpdate(readyStatus: ReadyStatus){
    this.socket.emit("updateReadyStatus", readyStatus);
  }

  switchStartGame(lobbyId: number){    
    this.socket.emit("switchStartGame", {lobbyId});
  }

  startGameSwitched(): Observable<Lobby>{
    return new Observable<Lobby>(obs => {
      this.socket.on('startGameSwitched', (msg: Lobby) => {
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
    this.socket.emit("setDices", body);
  }

  updateGame(): Observable<Game>{
    return new Observable<Game>(obs => {
      this.socket.on('updateGame', (msg: Game) => {
        obs.next(msg)
      });
    })
  }
  
  updateResults(): Observable<GameResults>{
    return new Observable<GameResults>(obs => {
      this.socket.on('updateResults', (msg: GameResults) => {
        obs.next(msg)
      });
    })
  }
  
  newWaitingFor(): Observable<number[]>{
    return new Observable<number[]>(obs => {
      this.socket.on('newWaitingFor', (msg: number[]) => {
        obs.next(msg)
      });
    })
  }
  
  recieveAlert(): Observable<string>{
    return new Observable<string>(obs => {
      this.socket.on('recieveAlert', (msg: string) => {
        obs.next(msg)
      });
    })
  }

  chooseWinner(lobbyId: number, gameId: number, result: Result){    
    
    const body = {
      lobbyId,
      gameId,
      result
    }
    this.socket.emit("chooseWinner", body);
  }
}
