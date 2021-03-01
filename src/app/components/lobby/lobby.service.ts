import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LobbySocket } from 'src/app/app.module';
import { ReadyStatus } from 'src/app/models/readyStatus';
import { environment } from 'src/environments/environment';
import { Lobby } from '../../models/lobby.model';
import { AuthenticationService } from '../../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {
  

  constructor(private http: HttpClient,
      private authenticationService: AuthenticationService,
      private lobbySocket: LobbySocket) { }

  create(): Observable<Lobby> {

    let headers = new HttpHeaders();
    if(this.authenticationService.isLogged()){
      headers = headers.set('Authorization', `Bearer ${this.authenticationService.getToken()}`)
    }

    return this.http.post<Lobby>(environment.apiUrl + 'lobby', {}, {headers})
  }

  get(code: string): Observable<Lobby> {

    let headers = new HttpHeaders();
    if(this.authenticationService.isLogged()){
      headers = headers.set('Authorization', `Bearer ${this.authenticationService.getToken()}`)
    }

    return this.http.get<Lobby>(`${environment.apiUrl}lobby/${code}`, {headers})
  }

  joinUser(lobby: Lobby, userId: number) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${this.authenticationService.getToken()}`)
    return this.http.put<Lobby>(`${environment.apiUrl}lobby/${lobby.code}/join/${userId}`, null,{headers})
  }

  quitUser(lobby: Lobby, userId: number) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${this.authenticationService.getToken()}`)
    return this.http.put<Lobby>(`${environment.apiUrl}lobby/${lobby.code}/quit/${userId}`, null,{headers})
  }

  // WEBSOCKET

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
}
