//console.log (`HOME : ${process.env.HOME}`)

const c_mdls = `${process.env.HOME}/node_modules/`,
	express = require(`${c_mdls}express`), 
	ws = require(`${c_mdls}ws`),
	http = require('http'),
	port = process.env.PORT||8181,
	app = express(),
	server = http.createServer(app),
	wss = new ws.Server ({server: server}),
	clients = new Map(),
	c_base = 'C:/\Data/\🍏/\🖥️',
	c_ws = `/DC/${encodeURIComponent('🤖')}/`;
	c_ls = `/ls${encodeURIComponent (' ')}`;


//
wss.on ('connection', function(ws) {
	clients.set(ws);
	console.log('New client', clients.size);
	
	ws.on ("close", () => {
		clients.delete(ws);
    });
});
wss.on('error', (ex)=>{
	if (ex.code === 'EADDRINUSE') {
        console.log('Already listening. clients ', clients.size);
    }
});

//
function Emit (m) {
	[...clients.keys()].forEach ((client) => {
		client.send (m);
	});
}


//
app.use (express.static (c_base));

app.get (`${c_ws}*`, (req, res) => {
	Emit (req.url.replace(c_ws, ''));
	res.writeHead (200, { 'Content-Type': 'text/html;charset=utf-8' });
	res.end ("👌");
});
app.get (`${c_ls}*`, (req, res) => {
	const fs = require('fs'), path = require('path'), b = c_base.replaceAll ('/', '\\'),
		F = dir => fs.readdirSync (dir).reduce ((files, file) => {
			const name = path.join(dir, file), isDirectory = fs.statSync(name).isDirectory();
			return isDirectory ? [...files] : [...files, name.replace (b, '').replaceAll ('\\', '/')];
		}, []),
		dir = path.join(c_base, decodeURIComponent (req.url.replace (c_ls, ''))),
		f = fs.existsSync (dir) ? F (dir) : [];
	console.log (c_base, b, f); 
	res.writeHead (200, { 'Content-Type': 'text/html;charset=utf-8' });
	res.end (JSON.stringify (f));
});
app.get('/favicon.ico', (req, res) => {
	//console.log(req, res, __dirname);
	res.sendFile(`${c_base}/🖼️${req.url}`);
});
app.get("*", (req, res) => {
	console.log(`${c_base}${req.url}`) //, req, res, __dirname);
	res.sendFile(`${c_base}${req.url}`);
});


//
server.listen (port);



// node /storage/emulated/0/🍏/🤖/🖥️/📜/🛎️.js

// http://localhost:8181/DC/index.html

// https://itecnote.com/tecnote/node-js-cant-get-browser-to-connect-to-nodejs-ws-server-if-not-localhost/
// https://ably.com/blog/web-app-websockets-nodejs
// https://copyprogramming.com/howto/nodejs-check-port-in-use-methods-and-tools-for-effective-port-checking 
