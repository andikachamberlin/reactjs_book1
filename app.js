require('dotenv').config()

/*------------------------------------------------------------------
[Module]
-------------------------------------------------------------------*/
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const path = require('path');
const app = express();
const compression = require('compression');
/*------------------------------------------------------------------
[End Module]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Use]
-------------------------------------------------------------------*/
const privateKey  = fs.readFileSync('./https/ssl.key', 'utf8');
const certificate = fs.readFileSync('./https/ssl.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const httpPort = process.env.REACT_APP_PRODUCTION === 'false' ? process.env.REACT_APP_CLIENT_PORT_HTTP_DEVELOPMENT : process.env.REACT_APP_CLIENT_PORT_HTTP_PRODUCTION

const httpsPort = process.env.REACT_APP_PRODUCTION === 'false' ? process.env.REACT_APP_CLIENT_PORT_HTTPS_DEVELOPMENT : process.env.REACT_APP_CLIENT_PORT_HTTPS_PRODUCTION
/*------------------------------------------------------------------
[End Use]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Compression]
-------------------------------------------------------------------*/
app.use(compression());
/*------------------------------------------------------------------
[End Compression]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Index]
-------------------------------------------------------------------*/
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (request, response) {
  	response.sendFile(path.join(__dirname, 'build', 'index.html'));
});
/*------------------------------------------------------------------
[End Index]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Server]
-------------------------------------------------------------------*/
httpServer.listen(httpPort, () => {
	console.log('------------------------------------------------------------------')
	console.log('APP PORT :', httpPort)
	console.log('------------------------------------------------------------------')
});

httpsServer.listen(httpsPort, () => {
	console.log('------------------------------------------------------------------')
	console.log('APP PORT :', httpsPort)
	console.log('------------------------------------------------------------------')
});
/*------------------------------------------------------------------
[End Server]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Error]
-------------------------------------------------------------------*/
app.use((error, request, response, next) => {
    if (error instanceof URIError) {
        error.message = 'Failed to decode param: ' + request.url;
        error.status = error.statusCode = 400;
		console.log(error)
        return response.redirect(['https://', request.get('Host') + '/404' ].join(''));
    }else{
		console.log('server client running')
	}
});
/*------------------------------------------------------------------
[End Error]
-------------------------------------------------------------------*/