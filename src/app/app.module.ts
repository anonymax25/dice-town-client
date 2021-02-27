import { BrowserModule, Title } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { GameComponent } from './components/game/game.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material/core";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from "@angular/material/tooltip";
import { GameFinderComponent } from './components/game-finder/game-finder.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutComponent } from './components/about/about.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { ConfirmComponent } from './components/layout/confirm/confirm.component';
import { ClipboardModule } from 'ngx-clipboard';
import { LobbyListComponent } from './components/lobby-list/lobby-list.component';
import { SnackbarService } from './shared/snackbar/snackbar.service';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ChatComponent } from './components/lobby/chat/chat.component';
import { LobbyInfoComponent } from './components/lobby/lobby-info/lobby-info.component';
 
@Injectable()
export class ChatSocket extends Socket {
    constructor() {
      super({ url: `${environment.socketUrl}${environment.chatSocketNamespace}`, options: {path: environment.socketPath} });
    }
}

@Injectable()
export class LobbySocket extends Socket {
    constructor() {
      super({ url: `${environment.socketUrl}${environment.lobbySocketNamespace}`, options: {path: environment.socketPath} });
    }
}
@Injectable()
export class AlertSocket extends Socket {
    constructor() {
      super({ url: `${environment.socketUrl}${environment.alertSocketNamespace}`, options: {path: environment.socketPath} });
    }
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    GameComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    GameFinderComponent,
    ProfileComponent,
    AboutComponent,
    LobbyComponent,
    ConfirmComponent,
    LobbyListComponent,
    ChatComponent,
    LobbyInfoComponent
  ],
  imports: [
    SocketIoModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTableModule,
    MatCheckboxModule,
    MatTooltipModule,
    ClipboardModule
  ],
  providers: [
    SnackbarService,
    ChatSocket,
    AlertSocket,
    LobbySocket,
    Title
  ],
  entryComponents: [
    LoginComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
