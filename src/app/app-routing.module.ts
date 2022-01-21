import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AppCreateSegmentComponent } from './app-create-segment/app-create-segment.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppTrackComponent } from './app-track/app-track.component';
import { DlSystemComponent } from './dl-system/dl-system.component';


const routes: Routes = [
  {path: 'page/login', loadChildren: () => import('./login/login/login.module').then(m => m.LoginModule)},
  // { path: '', redirectTo: 'create', pathMatch: 'full'},
  { path: 'create', component: AppCreateSegmentComponent , canActivate: [MsalGuard]},
  { path: 'track', component:  AppTrackComponent, canActivate: [MsalGuard]},
  { path: 'dlsystem', component:DlSystemComponent, canActivate: [MsalGuard]},
  { path: '', redirectTo: 'page/login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
