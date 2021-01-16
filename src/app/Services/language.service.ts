import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  uid = '';
  public selectedLang: string = "";
  LangConf?: any;

  constructor(public authService: AuthService,
              public af: AngularFireAuth,
              public translate: TranslateService,
              private db: AngularFirestore) {
    this.af.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
      }
    });
  }


  selectLang(lang: any) {
    let langShort = ""
    this.selectedLang = lang.target.value.toString();
    if (lang.target.value.toString() == "Deutsch") {
      langShort = "de"
    } else if (lang.target.value.toString() == "English") {
      langShort = "en"
    }
    if (this.uid.length !== 0) {
      let userLang = {"defaultLanguage": langShort};
      console.log("dbcall")
      this.db.collection('users').doc(this.uid).update(userLang);
    }
    if (langShort != "") {
      this.translate.use(langShort);
    }
    
  }

  setDefaulLang() {
    this.db.collection('users').doc(this.uid).snapshotChanges().subscribe(
      element => {
        if (element) {
          this.LangConf = element.payload.data()
          if (this.LangConf !== undefined) {
            this.translate.use(this.LangConf.defaultLanguage);
            if (this.LangConf.defaultLanguage == 'de') {
              this.selectedLang = 'Deutsch';
            } else {
              this.selectedLang = 'English';
            }
          }
          
        } else {
          this.translate.use('en');
          this.selectLang('English')
        }
      }
    )
  }


}
