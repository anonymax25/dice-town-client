import { Component, OnInit } from '@angular/core';
import { Lobby } from 'src/app/models/lobby.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User
  userIsLoaded: boolean = false
  
  constructor(private authenticationService: AuthenticationService,
              private userService: UserService) { }

  ngOnInit() {
    this.user = this.authenticationService.getUserFromToken()    
    this.userService.getById(this.user.id).subscribe( user => {
      this.user = user
      this.userIsLoaded = true
    })
  }

  isLobbyOwner(lobby: Lobby){
    return lobby.ownerId === this.user.id
  }

  
}
