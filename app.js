(function () {
	'use strict';

	var express = require('express');
	var httpProxy = require('http-proxy');
	var app = express();
	var proxy = httpProxy.createProxyServer({});
	
	// var http = require('http'); 
	// httpProxy.createServer(function (req, res, proxy) {
	// 	console.log('old request url ' + req.url);
 //    	req.url = '/' + req.url.split('/').slice(2).join('/'); // remove the '/api' part
 //    	console.log('new request url ' + req.url);
	//   	proxy.proxyRequest(req, res, {
	//     	host: 'secret-meadow-5568.herokuapp.com'
	//   	});
	// }).listen(9009);
 

	app.use(express.static(__dirname + '/dist'));
	// // app.use(express.static(__dirname + '/.tmp/'));
	app.all('/api/*', function (req, res) { 
		console.log('old request url ' + req.url);
    	req.url = '/' + req.url.split('/').slice(2).join('/'); // remove the '/api' part
    	console.log('new request url ' + req.url);
        // return proxy.web(req, res, { target: 'https://secret-meadow-5568.herokuapp.com' });
        return proxy.proxyRequest(req, res, { target: 'http://201.255.96.130:3000' });
	});
	app.listen(process.env.PORT || 9009);
	 
	// http.createServer(function(req, res) {
	// 	// req.headers.host = 'api-target.herokuapp.com';
	// 	proxy.web(req, res, { target: 'http://secret-meadow-5568.herokuapp.com' });
	// }).listen(process.env.PORT || 5000);


}());
