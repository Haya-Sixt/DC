//console.log (`HOME : ${process.env.HOME}`)

const c_nm = `/node_modules`, isDroid = __dirname.startsWith ('/'),
	c_wrks = isDroid ? '/\storage/\emulated/\ 0/\🍏' : 'D:\\Workspace',
	c_nmp = `${isDroid ? process.env.HOME : `${c_wrks}/\🍏/\Node`}${c_nm}/`,
	express = require(`${c_nmp}express`), 
	ws = require(`${c_nmp}ws`),
	http = require('http'),
	port = process.env.PORT||8181,
	app = express(),
	server = http.createServer(app),
	wss = new ws.Server ({server: server}),
	clients = new Map(),
	c_base = `${c_wrks}/\🖥️`.replace (' ', ''), 
	c_ws = `/DC/${encodeURIComponent('🤖')}/`,
	c_ls = `/ls${encodeURIComponent (' ')}`,
	Emit = m=> [...clients.keys()].forEach (e => e.send (m));

//
wss.on ('connection', function(ws) {
	clients.set(ws);
	ws.on ("close", ()=> clients.delete(ws));
	ws.on('message', m=> Emit (m));
	ws.on('error', ex=> ex.code === 'EADDRINUSE' && console.log('Already listening. clients ', clients.size));
});


//
app.use (express.static (c_base));

app.get (`/exit`, (req, res) => {
	res.writeHead (200, { 'Content-Type': 'text/html;charset=utf-8' });
	res.end ("👌");
	server.close(() => {
	    console.log('Server closed. Port released.');
	    process.exit(0);
    });
});

app.get('/favicon.ico', (req, res) => {
	res.sendFile(`${c_base}/🖼️${req.url}`);
}); 

app.get (`${c_ws}{*any}`, (req, res) => { // i.e.  🖥️ » 🤖 (ActionBlock) : Get http(!)://localhost:8181/DC/🤖/{lv=i_🤖}&t={system_time}
	Emit (req.url.replace(c_ws, '')); 
	res.writeHead (200, { 'Content-Type': 'text/html;charset=utf-8' });
	res.end ("👌");
});

app.get (`${c_ls}{*any}`, (req, res) => {
	const fs = require('fs'), path = require('path'), b = c_base.replaceAll ('/', '\\'),
		F = dir => fs.readdirSync (dir).reduce ((files, file) => {
			const name = path.join(dir, file), isDirectory = fs.statSync(name).isDirectory();
			return isDirectory ? [...files] : [...files, name.replace (b, '').replaceAll ('\\', '/')];
		}, []),
		dir = path.join(c_base, decodeURIComponent (req.url.replace (c_ls, ''))),
		f = fs.existsSync (dir) ? F (dir) : []; 
	res.writeHead (200, { 'Content-Type': 'text/html;charset=utf-8' });
	res.end (JSON.stringify (f));
});

//app.get(`${c_nm}{*any}`, (req, res) => {
//	res.sendFile(`${c_nmp.replace(`${c_nm}/`,'')}${req.url}`);
//});

app.all(`{*any}`, (req, res) => {
	res.sendFile(`${c_base}${req.url}`);
});

// 🕸️
server.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});