import { environment, credentials } from '../../../environments/environment';
import { Configuration } from 'msal';
import { MsalAngularConfiguration } from '@azure/msal-angular';


const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
// let appConfigPath = "../../../assets/appConfig.json";

export function msalConfigFactory(): Configuration {
  // if (environment.production) {

  //   appConfigPath = "getAppConfig";
  // }



  // var request = new XMLHttpRequest();
  // request.open('GET', appConfigPath, false);
  // request.send(null);
  // const response = JSON.parse(request.responseText);

  const response =  credentials;

  return {
    auth: {
      clientId: response.clientId,
      authority: response.authority,
      redirectUri: response.redirectUri
    }
  }

};

export function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return {
    popUp: !isIE,
    unprotectedResources: [],
    extraQueryParameters: {}
  };
}

export const authParam = {

  scopes: [
    'openid',
    'https://analysis.windows.net/powerbi/api/Report.Read.All'

  ]

};

