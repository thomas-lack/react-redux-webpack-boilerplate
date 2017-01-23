#!/usr/bin/env node

const STD_PORT = 3000;

var path 			= require('path'),
	cmdline			= require('commander'),
	pkg 			= require(path.join(__dirname, '/package.json')),
	express			= require('express'),
	app 			= express();

cmdline.version(pkg.version)
	.option(`-p, --port <port number>', 'The server port (optional, default: ${STD_PORT})`)
	.option('-d, --debug', 'Starts the server in debug mode (optional')
	.parse(process.argv);

if (cmdline.debug === true) {
	console.log('server mode: debug');
}

app.use(express.static(path.join(__dirname, '/public')));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
app.listen((cmdline.port || STD_PORT), function() {
	console.log(`Server listening on port ${cmdline.port || STD_PORT}`);
});