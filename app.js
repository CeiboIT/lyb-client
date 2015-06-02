(function () {
	'use strict';

	var express = require('express');
	var httpProxy = require('http-proxy');
	var app = express();
	var proxy = httpProxy.createProxyServer({});
	
	app.use(express.static(__dirname + '/dist'));

    proxy.on('error', function (err, req, res) {
    	console.log('error' + err);
    	console.log('req' + req);
    	console.log('res' + res);
  	});

	app.all('/api/*', function (req, res) { 
		console.log('old request url ' + req.url);
    	req.url = '/' + req.url.split('/').slice(2).join('/'); // remove the '/api' part
    	console.log('new request url ' + req.url);
	    req.headers.host = 'secret-meadow-5568.herokuapp.com';
        return proxy.proxyRequest(req, res, { target: 'https://secret-meadow-5568.herokuapp.com' });
	});
	app.listen(process.env.PORT || 9009);
}());
