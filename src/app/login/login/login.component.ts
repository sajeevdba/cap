import { Router } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loggedIn = false;
  token!: string;

  constructor(private authService: MsalService, private broadcastService: BroadcastService, private router: Router) { }

  ngOnInit() {

    this.checkoutAccount();

    this.login();
    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.checkoutAccount();


      this.router.navigate([environment.default_app_route]);
    });

  }

  checkoutAccount() {
    this.loggedIn = !!this.authService.getAccount();
  }

  login() {
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    if (isIE) {
      this.authService.loginRedirect();
    } else {
      this.authService.loginPopup();
    }
  }


}
