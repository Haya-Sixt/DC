//
(()=>{

// inter system communication
const wdgt = new $app.Service ('🤖'),
	c_tag = `${$app.Constants.Name}.${wdgt.id}`,
	tab_id = Date.now ();


//
wdgt.Init = ()=> {
	$(wdgt.sid).html(`<div style="position: absolute; top: -100vh;">${c_tag}</div>`);
	WS ();
	setTimeout (()=> window['🙊'].SaveTab ({id: tab_id}), 3000); // 🗒: 'setTimeout' bcs 🏁 with 🙊
}
 
//
wdgt.Update = Inactive;


//
function WS () {
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
	
	$(`${wdgt.sid} div`).html (`${c_tag}.${t}`);
	} catch (ex) { wdgt.Error ('Dispatch', ex) }
}


//
let i_send = [];
wdgt.Send = (n)=> {
	clearTimeout (i_send [n]);
	i_send [n] = setTimeout (()=> window['🙊'].Notification (n), 3000); // 🗒: 'setTimeout' bcs 🏁 with 🙊
};


//
//let inactive = 0, closed;
function Inactive () {
	window['🙊'].GetTabs (ts=> {  //console.log (`${wdgt.id}.Inactive.GetTabs`, ts);
		// is there any newer tab?
		if ( ! Object.values (ts)?.find (e=> e.id > tab_id) ) return;
		// close
		window['🙊'].SaveTab ({id: null});
		$app.Widgets['🔔'].Info (`${wdgt.id}.Inactive: ${$(":focus").length}`);
		window['🙊'].Close ()
	});     
	
	//if ($(":focus").length || closed) inactive = closed = 0 
	//else if (inactive > 10) {
	//	$app.Widgets['🔔'].Info (`${wdgt.id}.Inactive: ${$(":focus").length}`);
	//    window['🙊'].Close ()
	//}
	//else inactive++;
}

})(); 
