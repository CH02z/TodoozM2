import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
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
