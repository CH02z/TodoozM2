import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthGuard implements CanActivate {

  isAuthenticated = false;


  constructor(private router: Router, private af: AngularFireAuth) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {


    this.af.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
      }
    });
    if (this.isAuthenticated) {
        return true;
    }

    // navigate to login page
    //console.log('auth guard prevented access to home')
    this.router.navigate(['/login']);
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }

}
