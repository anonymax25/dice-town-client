import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { LoginComponent } from '../components/auth/login/login.component';
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class LobbyGuardService implements CanActivate {
  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authenticationService.isLogged()) {
      this.login().subscribe(loginSuccess => {
        if (loginSuccess && next.routeConfig.path){
          this.router.navigate([next.routeConfig.path])
        } 
        return false;
      })
    }
    return true;
  }

  login(): Observable<boolean> {
    const loginDialog = this.dialog.open(LoginComponent, {
      height: '400px',
      width: '500px',
    });
    return loginDialog.afterClosed();
  }

}
