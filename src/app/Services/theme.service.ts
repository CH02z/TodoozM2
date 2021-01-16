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
            this.setActiveTheme(light);
            this.darkmode = false;
          } else if (this.ThemeConf.defaultTheme == 'dark') {
            this.setActiveTheme(dark);
            this.darkmode = true;
          }
        } else {
          this.setLightTheme();
        }
      }
    )
  }

  isDarkTheme(): boolean {
    return this.active.name === dark.name;
  }
  

  setDarkTheme(): void {
    this.setActiveTheme(dark);
    this.darkmode = true;
    let userTheme = {"defaultTheme": "dark"};
    console.log("dbcall set dark theme")
    this.db.collection('users').doc(this.uid).update(userTheme)
  }

  setLightTheme(): void {
    this.setActiveTheme(light);
    this.darkmode = false;
    let userTheme = {"defaultTheme": "light"};
    console.log("dbcall set light theme")
    this.db.collection('users').doc(this.uid).update(userTheme), {merge: true};
  }

  setActiveTheme(theme: Theme): void {
    this.active = theme;
    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
  }
}
