// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

  
  production: false,

  apiEndPoint: 'http://localhost:8080/api/v1/',  
  default_app_route: 'create'

};


export const credentials = {

  "clientId": "8be72573-cab6-46ea-a53c-00d195aee40a",

  "authority": "https://login.microsoftonline.com/30af61e6-f207-4ecc-97ac-2932bc0503dc",

  "redirectUri": "http://localhost:4201/overview"

}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
