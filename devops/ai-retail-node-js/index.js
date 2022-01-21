/********* ENVIRONMENT VARIABLES ********************/
var secureSSL = process.env.SECURE || false;
var contextPath = process.env.CONTEXT_PATH || '/';          
var localPort = process.env.FRONTEND_PORT || 4200; //8081
var backendServer = process.env.BACKEND_URL || 'http://localhost:8080';
var geoServer = process.env.GEOSERVER_URL || 'http://localhost:9090';
var clientId = process.env.CLIENT_ID || '/';
var authority = process.env.AUTHORITY || '/';
var redirectUri = process.env.REDIRECT_URI || '/';

var express = require('express');
var app = express();

var requestLogger = require('morgan');

var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer({secure: secureSSL, changeOrigin:true});

/********** SECURITY HEADERS ***********/
const helmet = require('helmet')

// Sets "X-Frame-Options: SAMEORIGIN"     ---->   Only let me be framed by people of the same origin.
app.use(helmet.frameguard({ action: 'sameorigin' }))
// hsts support
app.use(helmet.hsts({maxAge: 31536000,  includeSubDomains: true,  preload: true}))
// Sets "X-Content-Type-Options: nosniff"
app.use(helmet.noSniff())
// Avoid display server name ("x-powered-by") in the header
app.disable('x-powered-by')
// Sets "X-XSS-Protection: 1; mode=block".
app.use(helmet.xssFilter())
// This sets four headers, disabling a lot of browser caching:
//    Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
//    Pragma: no-cache
//    Expires: 0
//    Surrogate-Control: no-store
app.use(helmet.noCache())
// Sets "Content-Security-Policy"
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: [
      "'self'",
      "'unsafe-eval'",    // Required to can execute Unity
      "'unsafe-inline' blob:",
      "https://c64.assets-yammer.com https://maps.googleapis.com https://federationlabaris2.arisawa.appcloud.accenture.com https://federationlabaris.arisawa.appcloud.accenture.com https://idp.ssocircle.com https://login.microsoftonline.com https://sts.windows.net;" ]
  }
}))

// Sets "Referrer-Policy: same-origin".
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))

// Sets "Feature-Policy: ".
app.use(helmet.featurePolicy({
  features: {
    fullscreen: ["'self'"],
    geolocation: ["'self'"]
  }
}))

/***** LOG System *****/
app.use(requestLogger(":date[iso] received - :req[X-Vcap-Request-Id] :method :url", { immediate: true }));
app.use(requestLogger(":date[iso] processed - :req[X-Vcap-Request-Id] :method :url status :status :response-time msec :res[content-length] bytes"));

/********* RESOURCES ALLOWED ************************/
var allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
    '.csv',
    '.tsv',
    '.json',
    '.unityweb',
    '.geojson',
    '.pdf',
    '.txt'
  ];
  app.get(contextPath + 'getAppConfig', function (req, res){
    var appConfig = {};
    appConfig.clientId = clientId;
    appConfig.authority = authority;
    appConfig.redirectUri = redirectUri;
    res.json(appConfig);
  });

  /************* REVERSE PROXY RULES ***********************************************/
  app.all( contextPath + "rest/*", function(req, res) {
//    console.log('Request received: ' + req.url);
//    console.log('Request "/rest/*" redirecting to Server: ' + backendServer + req.url);
    apiProxy.web(req, res, {target: backendServer});
  });

  app.all( contextPath + "saml/*", function(req, res) {
//    console.log('Request received: ' + req.url);
//    console.log('Request "/saml/*" redirecting to Server: ' + backendServer + req.url);
    apiProxy.web(req, res, {target: backendServer});
  });

  app.all( contextPath + "ws/*", function(req, res) {
//    console.log('Request received: ' + req.url);
//    console.log('Request "/ws/*" redirecting to Server: ' + backendServer + req.url);
    apiProxy.web(req, res, {target: backendServer});
  });

  app.all( contextPath + "geoserver/*", function(req, res) {
//    console.log('Request received: ' + req.url);
    req.url = req.url.substring((contextPath + "geoserver").length);
//    console.log('Request "/geoserver/*" redirecting to Server: ' + geoServer + req.url);
    apiProxy.web(req, res, {target: geoServer});
  });

  app.all(contextPath + "spring/*", function(req, res) {
//    console.log('Request received: ' + req.url);
    req.url = req.url.substring((contextPath + "spring").length);
//    console.log('Request "/spring/*" redirecting to Server: ' + backendServer + req.url);
    apiProxy.web(req, res, {target: backendServer});
  });

  app.get('*', function (req, res) {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
      if (contextPath.length>2) {
        req.url = req.url.substring(contextPath.length);
      }
      // To Recover Static Resources is enough have the url 
      // If there are aditional parameters, they will be removed by security reasons, to avoid possible XSS
      var aux = req.url.indexOf("?");
      if (aux !== -1) {
        req.url=req.url.substring(0,aux);
      }
      // console.log('Request static file: ' + req.url);
      res.sendFile(__dirname + `/dist/${req.url}`);
    } else {
      res.sendFile(__dirname + '/dist/index.html');
    }
  })

  apiProxy.on('error', function(err, req, res) {
    console.log('Node error message:' +err.message);
    if ( err !== undefined && err.message === 'socket hang up') {
      res.end();
    }
  })

  var server = app.listen(localPort, function () {
    console.log('CONTEXT_PATH: ' + contextPath);
    console.log('FRONTEND_PORT: ' + localPort);
    console.log('BACKEND_URL: ' + backendServer);
    console.log('GEOSERVER_URL: ' + geoServer);
    console.log("ARIS UI App listening")
  })
  