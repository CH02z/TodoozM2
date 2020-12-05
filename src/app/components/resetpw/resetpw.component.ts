import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resetpw',
  templateUrl: './resetpw.component.html',
  styleUrls: ['./resetpw.component.scss']
})
export class ResetpwComponent implements OnInit {

  email = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  sendResetEmail(): void {
    if (this.email.length !== 0) {
      this.authService.resetPassword(this.email)
    .then(() => {
      window.alert('Mail zum Reseten des Passworts per mail verschickt!');
      this.router.navigateByUrl('/login');
    })
    .catch((err) => window.alert('Fehler: Stelle sicher, dass die Emailadresse eingegeben ist.'));
    }
  }
}
