import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  email: string | null = '';


  constructor(public authService: AuthService, private router: Router, public af: AngularFireAuth) {
    this.af.authState.subscribe(user => {
      if (user) {
        this.email = user.email;
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
