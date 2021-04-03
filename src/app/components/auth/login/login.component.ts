import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../services/authentication.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialogRef} from "@angular/material/dialog";
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide: boolean = true;

  loginForm: FormGroup;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  loading: boolean = false;

  constructor(formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              public snackBar: MatSnackBar,
              public dialog: MatDialogRef<LoginComponent>)
  {
    this.emailCtrl = formBuilder.control('', Validators.required);
    this.passwordCtrl = formBuilder.control('', Validators.required);

    this.loginForm = formBuilder.group({
      email: this.emailCtrl,
      password: this.passwordCtrl,
    });
  }

  onSubmit() {
    this.loading = true
    this.authenticationService.login(this.loginForm.value).subscribe(data => {
      this.loading = false
      this.snackBar.open("Log in successful", "", {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      sessionStorage.setItem('token', data.token);
      this.dialog.close(true);
    }, err => {
      this.loading = false
    })
  }

  createAccount(){
    
  }
}
