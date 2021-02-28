import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Lobby } from '../models/lobby.model';
import { User } from '../models/user.model';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) { }

  getById(id: number){
    let headers = new HttpHeaders();
    if(this.authenticationService.isLogged()){
      headers = headers.set('Authorization', `Bearer ${this.authenticationService.getToken()}`)
    }

    return this.http.get<User>(`${environment.apiUrl}user/${id}`, {headers})
  }

  getUsersLobbies(id: number): Observable<Lobby[]> {

    let headers = new HttpHeaders();
    if(this.authenticationService.isLogged()){
      headers = headers.set('Authorization', `Bearer ${this.authenticationService.getToken()}`)
    }

    return this.http.get<Lobby[]>(`${environment.apiUrl}user/lobbies/${id}`, {headers})
  }

  getEmptyUser(): User {
    const user = new User()
    user.name = "∅"
    return user
  }
}
