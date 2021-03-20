import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../../services/authentication.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide: boolean = true;
  check: boolean = false;


  userForm: FormGroup;
  displayNameCtrl: FormControl;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  error: string = null;


  constructor(formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router,
              private snackBar: MatSnackBar)
  {
    this.displayNameCtrl = formBuilder.control('', Validators.required);
    this.emailCtrl = formBuilder.control('', Validators.required);
    this.passwordCtrl = formBuilder.control('', Validators.required);

    this.userForm = formBuilder.group({
      name: this.displayNameCtrl,
      email: this.emailCtrl,
      password: this.passwordCtrl
    });
  }

  ngOnInit() {
    if(this.authenticationService.isLogged()) {
       this.router.navigate(['home']).then();
    }
  }

  openSnackBar() {
    this.snackBar.open("The account was successfully created, yay!", "", {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  onSubmit() {
    
    this.error = null
    if(this.userForm.value['name'] === "Game"){
      this.error = "Game is a reserved word, you cannot set it as login!"
      return
    }

    this.authenticationService.register(this.userForm.value).subscribe(() => {
      this.openSnackBar();
      const loginForm = {
        "email": this.userForm.value["email"],
        "password": this.userForm.value["password"]
      }
      this.authenticationService.login(loginForm).subscribe(session => {
        sessionStorage.setItem('token', session.token);
        this.router.navigate(['home']).then();
      })
    });
  }
}
