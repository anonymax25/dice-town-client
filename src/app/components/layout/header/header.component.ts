import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LoginComponent} from "../../auth/login/login.component";
import {AuthenticationService} from "../../../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

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
      this.router.navigate(['game/finder']).then();
  }

  logout() {
    this.authenticationService.logout();
    sessionStorage.clear();
    window.location.reload();
  }
}

