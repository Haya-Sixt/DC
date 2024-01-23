//
(()=>{

// inter system communication
const wdgt = new $app.Service ('🤖'),
	c_mark = `${$app.Constants.Name}.${wdgt.id}`;


//
wdgt.Init = ()=> {
	$(wdgt.sid).html(`<div style="position: absolute; top: -100vh;">${c_mark}</div>`);
	Listener ();
}

//
wdgt.Update = Inactive;


//
function Listener () {
	const ws = new WebSocket(`ws://${location.host}`);

	setTimeout (()=> { if (ws.readyState != 1) wdgt.Reset (ws) }, 5000);
	
	ws.addEventListener("message", (ev) => {
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
	
	if (v?.startsWith ($app.Constants.Var ())) {
		const a = v.replace ($app.Constants.Var (), '').split ('=');
		$app.Vars [a[0]] = a[1]; 
	}
	else if ($app.Widgets[v]) {
		$app.Widgets[v].Init ();
		v = v.split (' ');
		v = `${ v[0] }${ v.length == 1 ? '' : '...' }`;
		$app.Widgets['⏱️'].Add (v, wdgt.id);
	}
	else $app.Widgets['🔔'].Info (`${v} (${wdgt.id})`);
	
	$(`${wdgt.sid} div`).html (`${c_mark}.${t}`);
	} catch (ex) { wdgt.Error ('Dispatch', ex) }
}


//
let i_send = [];
wdgt.Send = (n)=> {
	clearTimeout (i_send [n]);
	i_send [n] = setTimeout (()=> window['🙊'].Notification (n), 3000);
};


//
let inactive = 0, closed = 0;
function Inactive () {
	if (inactive > 10) {
		if (closed++) return;
		$app.Widgets['🔔'].Info (`${wdgt.id}.Inactive: ${$(":focus").length}`);
		//window['🙊'].Close ()
		}
	else if ($(":focus").length) inactive = 0
	else inactive++;
}

})(); 



/*

//
function Listener () {
	try {
	const Init = ()=> window['🙊'].SetValue (wdgt.id, '');
	Init ();
	window['🙊'].AddValueChangeListener (wdgt.id, (k, oldV, v, remote)=> {
		if (!v) return; 
		Init ();
		Dispatch (v);
	});
	} catch { setTimeout (Listener, 3000) }
}

wdgt.Init = ()=> {
	...
	Listen ();
}

wdgt.Update = Focus;

//
function Listen () {
	$(`${wdgt.sid} input`).remove();
	$("<input>") // 🗒: Already tried 'contenteditable' on body. Doesn't work well.
		.attr("inputmode", "none") // UI focus glowing border
		.attr("style", "position: absolute; color: transparent; border: none; background: transparent; box-shadow: none; outline: none;")
		.appendTo(wdgt.sid)
		.on("paste", Paste)
		.on("blur", Listen);
	Focus ();
}

//
let i_focus, focus = 0;
function Focus () {
	clearTimeout (i_focus);
	const e = $(`${wdgt.sid} input`);
	e.focus();
	i_focus = setTimeout (()=> {
		if (focus > 10 * 60) window['🙊'].Close ()
		else if (e?.is(":focus")) focus = 0
		else Focus (++focus);
	}, 1000);
}

//
function Paste (ev) {
	ev.preventDefault(); 
	const d = '\n', v = (ev.originalEvent.clipboardData || window.clipboardData).getData("text").split(d);
	if (v.length < 2) return;
	$(`${wdgt.sid} div`).html (`${c_mark}.${v[0]}`);
	Dispatch (v.slice(1).join(d)); 
}
*/
