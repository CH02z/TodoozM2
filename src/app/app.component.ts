import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todooz2';

  constructor(public authService: AuthService, private router: Router, public af: AngularFireAuth, public translate: TranslateService) {
     // this language will be used as a fallback when a translation isn't found in the current language
     translate.setDefaultLang('en');
     // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
    
    this.af.authState.subscribe(user => {
      if (user) {
        //do smt
      }
    });
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 2000);

  }
}
