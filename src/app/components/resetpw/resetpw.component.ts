import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-resetpw',
  templateUrl: './resetpw.component.html',
  styleUrls: ['./resetpw.component.scss']
})
export class ResetpwComponent implements OnInit {

  email = '';

  constructor(private authService: AuthService,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
  }

  sendResetEmail(): void {
    if (this.email.length !== 0) {
      this.authService.resetPassword(this.email)
    .then(() => {
      window.alert(this.translate.instant('auth.resetMailSent') + ".");
      this.router.navigateByUrl('/login');
    })
    .catch((err) => window.alert(this.translate.instant('auth.missingMail') + "."));
    }
  }
}
