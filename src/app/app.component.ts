import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { element } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {

  title = 'todooz2';
  uid = '';
  selectedLang: string = "";
  LangConf?: any;

  constructor(public authService: AuthService,
              public af: AngularFireAuth,
              public translate: TranslateService,
              private db: AngularFirestore) {
     // this language will be used as a fallback when a translation isn't found in the current language
     
    
    this.af.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.setDefaulLang();
      }
    });
  }

  ngOnInit(): void {
  }

  selectLang(lang: string) {
    let userLang = {"defaultLanguage": lang};
    this.db.collection('users').doc(this.uid).set(userLang);
    if (lang == 'de') {
      this.selectedLang = 'Deutsch';
    } else {
      this.selectedLang = 'English';
    }
    this.translate.use(lang);
  }

  setDefaulLang() {
    this.db.collection('users').doc(this.uid).snapshotChanges().subscribe(
      element => {
        if (element) {
          this.LangConf = element.payload.data()
          if (this.LangConf !== undefined) {
            this.selectLang(this.LangConf.defaultLanguage);
          }
          
        } else {
          this.translate.use('en');
          let userLang = {"defaultLanguage": 'en'};
          this.db.collection('users').doc(this.uid).set(userLang);
        }
      }
    )
  }





}
