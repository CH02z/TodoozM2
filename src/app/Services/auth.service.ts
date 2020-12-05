import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<any>;

  constructor(private af: AngularFireAuth) {
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

  logout() {
    this.af.signOut()
    .then(suc => {
        window.alert('erfolgreich abgemeldet!');
      });
  }

  resetPassword(email: string) {
    return this.af.sendPasswordResetEmail(email)
      .then(suc => {window.alert('Mail zum reseten des Passworts verschickt'); })
      .catch(err => {window.alert('Fehler: Stelle sicher, dass die Emailadresse im eingegeben ist.'); });
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
