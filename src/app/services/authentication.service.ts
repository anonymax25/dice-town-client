import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "../models/user.model";
import {Observable} from "rxjs";
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";

const options = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
  })
};


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  jwtHelperService: JwtHelperService;

  constructor(private http: HttpClient,
              private router: Router){
    this.jwtHelperService = new JwtHelperService()
  }

  register(user: any): Observable<User> {
    return this.http.post<User>(environment.apiUrl + 'auth/register', user, options);
  }

  login(info: any): Observable<{token: string}> {
    return this.http.post<{token: string}>(environment.apiUrl + 'auth/login', info, options);
  }

  logout(){
    this.router.navigate(['home']).then(data => {
      sessionStorage.clear();
    });
  }

  getToken(): string {
    return sessionStorage.getItem('token')
  }
  
  setToken(token: string) {
    return sessionStorage.getItem('token')
  }

  getUserFromToken(): User {
    if(!this.isLogged())
      return
    const jwtDecode = this.jwtHelperService.decodeToken(this.getToken())
    let user: User = {
      id: jwtDecode.id,
      email: jwtDecode.email,
      name: jwtDecode.name,
      lobbies: []
    }
    return user
  }

  getIdFromToken(): number {
    return this.getUserFromToken().id
  }

  isLogged(): boolean {
    const token = sessionStorage.getItem('token');
    if(!token)
      return false
    return token.length > 1;
  }
}
