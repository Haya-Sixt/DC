// 
(()=>{

// Status icons
const wdgt = new $app.Widget('🚥'), // 🗒: No need for wdgt.dependency = ['🪵'];
	WK = (w, k = '')=> encodeURIComponent (`${w}_${k}`).replaceAll ('%','_').replaceAll ("'",'"'); // 🗒: '.' instead of '_' is error in '<div wk '
let data = [];

wdgt.Init = ()=> {
}

//
wdgt.Update = ()=> {
	const c = `${wdgt.sid} > div`,
		Add = (wk, k, v)=> {
			const e = $(`${c}[${wk}]`), 
				vs = v ? `<span>${v}<span>` : '', h = `${k}${vs}`;
			if (!e.length) $('<div>').attr (wk, v).html (h).appendTo (wdgt.sid)
			else if (e.attr (wk) !== v) e.attr (wk, v).html (h);
	  };
	
	// Removed
	$(c).each ((i, t)=> {
		const Some = (t)=> { for (const wk in data) if (typeof t.attr (wk) != 'undefined') return true };
		if (!Some ($(t))) t.remove () 
	});
	
	// From 'Add' - 🔋, ☔, 🌡️ ...
	for (const [wk, o] of Object.entries(data)) {
		Add (wk, o.k, o.v);
	}

	// Resize 🪵
	if (!$(c).length) $('#🪵').removeClass ('🪵🚥')
	else $('#🪵').addClass ('🪵🚥');
}


//
wdgt.Add = (w, k = '', v = '')=> {
	const wk = WK (w, k); 
	if (data [wk]?.v === v) return;
	data [wk] = {k: k, v: v};
	Refresh ();
	return wk
}

//
wdgt.Remove = (w, k)=> {
	let deleted;
	if (k) {
		const wk = WK (w, k);
		if (typeof data [wk] == 'undefined') return;
		delete data [wk];
		deleted = true;
	}
	else for (const [wk, o] of Object.entries(data)) {
		if (wk.startsWith(WK (w))) {
			delete data [wk];
			deleted = true;
		}
	}
	deleted && Refresh ();
}

//
function Refresh () {
	if (wdgt.status != $app.Constants.Status.Done ) return;
	wdgt.Update ();
}

})();