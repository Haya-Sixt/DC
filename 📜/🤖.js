// 1.
(()=>{

// inter system communication
const wdgt = new $app.Service ('🤖', {
		repeat: 10,
	}),
	c_tag = `${$app.Const.Name}.${wdgt.id}`,
	tab_id = Date.now ();


//
wdgt.Init = async ()=> {
	$(wdgt.sid).html(c_tag);
	WS ();
	await window ['🐵'].SaveTab ({id: tab_id});
	Maintenence ();
}
 
//
wdgt.Update = Inactive;


//
function WS () {
	const ws = new WebSocket(`ws://${location.host}`); // Not a comment. It's for url validaty. Arbitrary 'a.com' will also fail.

	setTimeout (()=> { if (ws.readyState != 1) wdgt.Reset (ws) }, 5000);
	
	ws.addEventListener("message", ev=> {
	  Dispatch (decodeURIComponent (ev.data));
	});
	
	ws.addEventListener("disconnect", () => {
	  wdgt.Reset ("disconnect");
	});
}

//
function Dispatch (v) {
	try {
	v = v.split ('&t=');
	let t = v [1]; 
	v = v [0];
	
	if (v == 'newclient' ) Close ()
	else if (v?.startsWith ($app.Const.Var ())) {
		const a = v.replace ($app.Const.Var (), '').split ('=');
		$app.Vars [a[0]] = a[1]; 
	}
	else if ($app.Widgets [v]) {
		$app.Widgets [v].Init ({manual:wdgt.id});
		v = v.split (' ');
		v = `${ v [0] }${ v.length == 1 ? '' : '...' }`;
		$app.Widgets ['⏱️'].Add (v, wdgt.id);
	}
	else $app.Widgets ['🔔'].Info (`${v} (${wdgt.id})`);
	
	$(`${wdgt.sid} div`).html (`${c_tag}.${t}`);
	} catch (ex) { wdgt.Error ('Dispatch', ex) }
}


//
wdgt.Send = n=> window ['🐵'].Notification (n);


//
async function Inactive () {
	const ts = await window ['🐵'].GetTabs ();
	// is there any newer tab?
	if ( ! Object.values (ts)?.find (e=> e.id > tab_id) ) return;
	Close ();
}

//
async function Close () {
	try {
	await window ['🐵'].SaveTab ({id: null});
	$app.Widgets ['🔔'].Info (`${wdgt.id}.Inactive: ${$(":focus").length}`);
	} finally { window ['🐵'].Close () }
}

//
function Maintenence () {
	const d = new Date(), h = d.getHours(), m = d.getMinutes(), s = d.getSeconds(), secondsUntilEndOfDate = (24*60*60) - (h*60*60) - (m*60) - s;
	setTimeout (Reload, secondsUntilEndOfDate*1000);
	Focus ();
}

// Reload (New day)
const date = new Date().getDate();
function Reload () {
	if (date != new Date().getDate()) location.reload ();
}

//
let focus = (typeof document.hidden !== undefined && !document.hidden);
function Focus (ev) {
	focus = ev?.type == 'blur' ? false : true;
	if (!focus) return;
	Reload ();
	Send ();
}

// Fullscreen 
function Send (steps = 2) {
	if (document.fullscreenElement || !focus) return;
	wdgt.Send (`${wdgt.id}.full screen`);
	if (steps--) setTimeout (Send, 10000, steps);
}

// 🤖 has responded
function Receive () {
	document.querySelector("body").requestFullscreen();
}


//
addEventListener('focus', Focus); 
addEventListener('blur', Focus);
window.addEventListener('orientationchange', Focus);
document.addEventListener ('click', Receive);

})();

 
