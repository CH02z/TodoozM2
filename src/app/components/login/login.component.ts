import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/Services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  isLogedIn = false;

  constructor(public authService: AuthService,
              private router: Router,
              private af: AngularFireAuth) {
      this.checkIfLoggedIn();
  }

  ngOnInit(): void {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn(): void {
    this.af.authState.subscribe(auth => {
      if (auth) {
        this.isLogedIn = true;
        this.router.navigateByUrl('/home');
      }
    });
  }

  onSubmit(formData: NgForm): void {
    this.checkIfLoggedIn();
    if (formData.valid) {
      this.authService.login(this.email, this.password);
      this.checkIfLoggedIn();
    }
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
    this.checkIfLoggedIn();
  }
}
