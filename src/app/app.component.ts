import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todooz2';

  constructor(public authService: AuthService, private router: Router, public af: AngularFireAuth) {
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
