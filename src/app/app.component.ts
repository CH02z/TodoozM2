import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { LanguageService } from './Services/language.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {

  title = 'Todooz';
  uid = '';
  private subscriptions: Subscription[] = [];

  constructor(public authService: AuthService,
              public af: AngularFireAuth,
              public langService: LanguageService,
              private router: Router) {  
    this.subscriptions.push(
      this.af.authState.subscribe(user => {
        if (user) {
          this.uid = user.uid;
          this.langService.setDefaulLang();
        }
      })
    );
  }

  ngOnInit(): void {
  }

  logout(): void {
    setTimeout(() => {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }, 500);
    
    this.authService.logout();
    setTimeout(() => {
      if (this.router.url != "/resetpw") {
        this.router.navigateByUrl('/login');
      }
    }, 1000);
  }


}
