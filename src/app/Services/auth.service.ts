import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<any>;

  constructor(private af: AngularFireAuth,
              private translate: TranslateService,
              private router: Router) {
    this.user = af.authState;
  }

  signup(email: string, password: string): void {
    this.af.createUserWithEmailAndPassword(email, password)
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/weak-password') {
        window.alert('The password is too weak.');
      } else if (errorCode === 'auth/invalid-email') {
        window.alert('The email is not valid.');
      } else {
        window.alert(errorMessage);
      }
    });
  }

  login(email: string, password: string) {
    this.af.signInWithEmailAndPassword(email, password)
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/invalid-email') {
        window.alert('Invalid Email adress');
      } else if (errorCode === 'auth/user-disabled') {
        window.alert('User is disabled');
      } else if (errorCode === 'auth/user-not-found') {
        window.alert('User not found');
      } else if (errorCode === 'auth/wrong-password') {
        window.alert('wrong password!');
      } else {
        window.alert(errorMessage);
      }
    });
  }

  loginWithGoogle(){
    this.af.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(
      error => {
        console.log(error);
      }
      
    ).then(
      suc => {
        this.router.navigateByUrl('/home');
      }
    )
}

  logout() {
    this.af.signOut()
    .then(suc => {
        window.alert(this.translate.instant('auth.successful') + " " + this.translate.instant('auth.loggedout') + ".");
      });
  }

  async resetPassword(email: string) {
    return this.af.sendPasswordResetEmail(email)
      .then(suc => {window.alert(this.translate.instant('auth.resetMailSent') + "."); })
      .catch(err => {window.alert(this.translate.instant('auth.missingMail') + "."); });
  }

  getuser(): any {
    let user = null;
    this.af.authState.subscribe(userAF => {
      if (userAF) {
        user = userAF;
      }
    });
    return user;
  }






}
