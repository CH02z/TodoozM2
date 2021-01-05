import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthGuard implements CanActivate {

  isAuthenticated?: boolean;


  constructor(private router: Router, private af: AngularFireAuth) {

  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.af.authState.subscribe(user => {
      if (!user) {
        console.log('access to home denied.')
        if (this.router.url != "/resetpw") {
          this.router.navigate(['/login']);
        }
        this.isAuthenticated = false;
      } else {
        if (this.router.url != "/home" && this.router.url != "/login") {
          this.router.navigate(['/login']);
        }
        this.isAuthenticated = true;
      }
    });
    if (this.isAuthenticated !== undefined) {
      return this.isAuthenticated;
    } else {
      return false;
    }
  }

}
