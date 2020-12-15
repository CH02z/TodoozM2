import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { ResetpwComponent } from './components/resetpw/resetpw.component';
import { AuthGuard } from './auth.guard';
import { CategorysComponent } from './components/categorys/categorys.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'resetpw', component: ResetpwComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'categorys', component: CategorysComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
