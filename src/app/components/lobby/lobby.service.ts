import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LobbySocket } from 'src/app/app.module';
import { ReadyStatus } from 'src/app/models/readyStatus';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { Lobby } from '../../models/lobby.model';
import { AuthenticationService } from '../../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {
  

  constructor(private http: HttpClient,
      private authenticationService: AuthenticationService,
      ) { }

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

  computeIsReady(lobby: Lobby, user: User) {
    const readyStatus = lobby.readyStatus.find(item => item.uid == user.id)
    if (!readyStatus)
      return null
    return readyStatus.isReady
  }
}
