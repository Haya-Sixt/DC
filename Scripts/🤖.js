//
(()=>{

// Messaging from 🤖
const wdgt = new $app.Widget ('🤖');
wdgt.repeat = { update: 1 };
wdgt.['🌃'] = $app.Constants['🌃'].None;

const c_mark = `${$app.Constants.Name}.${wdgt.id}`;

wdgt.Init = ()=> {
	$(wdgt.sid).html(`<div style="position: absolute; top: -100vh;">${c_mark}</div>`);
	Listen ();
}

wdgt.Update = Focus;

let i_send = [];
wdgt.Send = (n)=> {
	clearTimeout (i_send [n]);
	i_send [n] = setTimeout (()=> window['🙊'].Notification (n), 3000);
};

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

//
function Dispatch (v) {
	if ($app.Widgets[v]) {
		$app.Widgets[v].Init ();
		v = v.split (' ');
		v = `${ v[0] }${ v.length == 1 ? '' : '...' }`;
		$app.Widgets['⏱️'].Add (v, wdgt.id);
	}
	else $app.Widgets['🔔'].Info (`${wdgt.id}.Dispatch: ${v}`);
}

})();