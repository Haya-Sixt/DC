// 
(()=>{

// Status icons
const wdgt = new $app.Widget('🚥'); // 🗒: No need for wdgt.dependency = ['🪵'];

let data = [];

wdgt.Init = ()=> {
}

//
wdgt.Update = ()=> {
	const Add = (k, v)=> {
			v = v ? `<span>${v}<span>` : '';
			rs = `${rs}<div>${k}${v}</div>`;
	  };
	let rs = '';

	// From 'Add' - 🔋, ☔, 🌡️ ...
	for (const [wk, o] of Object.entries(data)) {
		Add (o.k, o.v);
	}

	// Resize 🪵
	if (rs == '') $('#🪵').removeClass ('🪵🚥')
	else $('#🪵').addClass ('🪵🚥');
	
	//
	$(wdgt.sid).html(rs);
}


//
wdgt.Add = (w, k, v)=> {
	const wk = `${w}.${k}`;
	if (data [wk] === v) return;
	data [wk] = {k: k, v: v};
	Refresh ();
}

//
wdgt.Remove = (w, k)=> {
	let deleted;
	if (k) {
		const wk = `${w}.${k}`;
		if (typeof data [wk] == 'undefined') return;
		delete data [wk];
		deleted = true;
	}
	else for (const [wk, o] of Object.entries(data)) {
		if (wk.startsWith(`${w}.`)) {
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