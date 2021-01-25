import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { element } from 'protractor';
import { dark, light, Theme } from 'src/assets/theme/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  uid = '';
  ThemeConf?: any;
  darkmode: boolean = false;

  constructor(private db: AngularFirestore,
              public af: AngularFireAuth) {
                this.af.authState.subscribe(user => {
                  if (user) {
                    this.uid = user.uid;
                  }
                });
              }

  private active: Theme = light;

  setDefaultTheme() {
    this.db.collection('users').doc(this.uid).snapshotChanges().subscribe(
      element => {
        this.ThemeConf = element.payload.data();
        if (this.ThemeConf !== undefined) {
          if (this.ThemeConf.defaultTheme == 'light') {
            this.setHTMLTheme(light);
            this.darkmode = false;
          } else if (this.ThemeConf.defaultTheme == 'dark') {
            this.setHTMLTheme(dark);
            this.darkmode = true;
          }
        } else {
          this.setHTMLTheme(light);
        }
      }
    )
  }

  isDarkTheme(): boolean {
    return this.active.name === dark.name;
  }
  

  setDBTheme(theme: Theme): void {
    this.setHTMLTheme(theme);
    const userTheme = {"defaultTheme": theme.name}; 
    this.db.collection('users').doc(this.uid).get().subscribe(
      doc => {
        if (doc.data() == undefined) {
          this.db.collection('users').doc(this.uid).set(userTheme)
        } else {
          this.db.collection('users').doc(this.uid).update(userTheme)
        }
      }
    )
    
  }


  setHTMLTheme(theme: Theme): void {
    this.active = theme;
    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
  }
}
