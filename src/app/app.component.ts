import { Component } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { LanguageService } from './Services/language.service';
import { Router } from '@angular/router';
import { ThemeService } from './Services/theme.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CategoryService } from './Services/category.service';
import { Category } from './models/Category';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {

  title = 'Todooz';
  uid = '';
  dbexists: boolean = false;

  constructor(public authService: AuthService,
              public af: AngularFireAuth,
              public langService: LanguageService,
              public themeService: ThemeService,
              private router: Router,
              ) {  
      
  }

  ngOnInit(): void {
    this.af.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.langService.setDefaulLang();
        this.themeService.setDefaultTheme();
        
      }
    })
  }

  logout(): void {    
    this.authService.logout();
    setTimeout(() => {
      if (this.router.url != "/resetpw") {
        this.router.navigateByUrl('/login');
      }
    }, 1000);
  }


}
