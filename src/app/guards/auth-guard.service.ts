import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginComponent } from '../components/auth/login/login.component';
import { AuthenticationService } from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private authenticationService: AuthenticationService,
    private titleService: Title,
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
    }else {
      this.titleService.setTitle(`${environment.title} : ${this.authenticationService.getUserFromToken().name}`)
      return true;
    }
  }

  login(): Observable<boolean> {
    const loginDialog = this.dialog.open(LoginComponent, {
      height: '400px',
      width: '500px',
    });
    return loginDialog.afterClosed();
  }

}
