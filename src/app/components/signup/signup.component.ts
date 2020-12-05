import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/Services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private af: AngularFireAuth) {
    this.checkLogin();
  }

  ngOnInit(): void {
    this.checkLogin()
  }

  checkLogin(): void {
    this.af.authState.subscribe(auth => {
      if (auth) {
        this.router.navigateByUrl('/home');
      }
    });
  }

  onSubmit(formData: NgForm): void {
    if (formData.valid) {
      this.authService.signup(this.email, this.password);
      this.checkLogin()

    }
    this.email = this.password = '';
  }
}
