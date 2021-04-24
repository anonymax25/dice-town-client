import { Component, OnInit } from '@angular/core';
import {LoginComponent} from "../auth/login/login.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
  }

  openLogin() {
    this.dialog.open(LoginComponent, {
      height: '400px',
      width: '500px',
    });
  }

  launchGame() {
    if(this.authenticationService.isLogged()) {
      this.router.navigate(['game/finder']);
    } else {
      this.openLogin();
    }
  }
}
