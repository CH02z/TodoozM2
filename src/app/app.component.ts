import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { element } from 'protractor';
import { LanguageService } from './Services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {

  title = 'todooz2';
  uid = '';

  constructor(public authService: AuthService,
              public af: AngularFireAuth,
              public langService: LanguageService) {   
    
    this.af.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.langService.setDefaulLang();
      }
    });
  }

  ngOnInit(): void {
  }


}
