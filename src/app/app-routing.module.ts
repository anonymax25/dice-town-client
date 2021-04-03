import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {RegisterComponent} from "./components/auth/register/register.component";
import {AuthGuardService} from "./guards/auth-guard.service";
import { GameFinderComponent } from './components/game-finder/game-finder.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutComponent } from './components/about/about.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { LegalComponent } from './components/legal/legal.component';
import { RulesComponent } from './components/rules/rules.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'game/finder', component: GameFinderComponent, canActivate: [AuthGuardService] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'lobby/:code', component: LobbyComponent, canActivate: [AuthGuardService] },
  // { path: 'profile/:id', component: ProfileComponent},
  // { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [SecureInnerPagesGuard] },
  // { path: 'verify-email', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard] },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
