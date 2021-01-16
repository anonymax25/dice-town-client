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
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide: boolean = true;

  loginForm: FormGroup;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;

  constructor(formBuilder: FormBuilder,
              private titleService: Title,
              private authenticationService: AuthenticationService,
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
    this.authenticationService.login(this.loginForm.value).subscribe(data => {
      sessionStorage.setItem('token', data.token);
      this.titleService.setTitle(`${environment.title} : ${this.authenticationService.getUserFromToken().name}`)
      this.dialog.close(true);
    })
  }
}
