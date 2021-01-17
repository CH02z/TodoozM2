import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/Services/language.service';
import { ThemeService } from 'src/app/Services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  uid = '';

  constructor(public authService: AuthService,
              public af: AngularFireAuth,
              private translate: TranslateService,
              public themeService: ThemeService,
              public langService: LanguageService) {
      this.subscriptions.push(
        this.af.authState.subscribe(user => {
          if (user) {
            this.uid = user.uid;
          }
        })
      ) 
    }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toggleTheme() {
    if (this.themeService.isDarkTheme()) {
      this.themeService.setLightTheme();
    } else {
      this.themeService.setDarkTheme();
    }
  }

}
