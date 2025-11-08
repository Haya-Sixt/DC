// 1.
(()=>{

// Log
const wdgt = new $app.Widget('🪵', {
	http: true,
	dependency: ['📆','⏱️'],
	repeat: 3,
});

//
wdgt.Update = ()=> {
	const HashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0),
		c_ender = '➖';
	let rs ='', now = parseInt( Date.now() / 1000 ),
		shishi = 0, w;
	
	for (const e of wdgt.Entries(now)) { // 🗒: yield doesn't work with forEach because it's callback
		if ( e.log.includes(c_ender) ) continue;
		rs += `<div ${ e.log.indexOf("[") == -1 && 'style="display:none;"' }>${e.log}</div>`;
		// Set shishi (just in case MD was disabled, and I manually run the '🌋🕯'️ scene)
		if ( e.log.substring(6).substring(0,4) == '🕯️ ' ) shishi = e.startedAt;
	};

	w = '⏱️';
	rs = `${rs}<div>${$(`#${w}`).text()}</div>`;
	//
	const hc = HashCode (rs), tag = `_log_HashCode`; // prevent flickering 
	hc != $(wdgt.sid).attr (tag) && $(wdgt.sid).html (rs).attr (tag, hc);
	
	//
	ProggressBar (c_ender);
	
	w = '🕯️'; // 🗒: '🌋' App Must Have Delay Before 🔔. Otherwise '🏡' Won't Be Triggered (Because '🌋' Is Open).
	shishi = Math.max (wdgt.data.shishi, shishi);
	$app.Vars [w] = (new Date(shishi * 1000).getDate () == new Date().getDate () && now < $app.Widgets['📆'].data['🌃']) ? shishi : 0;
	$app.Vars [`${w}${w}`] = wdgt.data.shabbat.toLowerCase();

	w = '🔋';
	if (parseInt (wdgt.data.battery) < 70) $app.Widgets['🚥'].Add (wdgt.id, w, wdgt.data.battery)
	else $app.Widgets['🚥'].Remove (wdgt.id, w);

	w = '💈';
	wdgt.data [w] = wdgt.data.forecast.t; 
	$app.Widgets[w].Init ();
	Clock (now, w, wdgt.data.forecast.tc, 2);
	
	w = '🌡';
	Clock (now, w, wdgt.data.forecast.fc);
	
	w = '🌃';
	$app.Vars [w] = wdgt.data.night.toLowerCase();
	
	//
	Background ();
};

//
function ProggressBar (c_ender) {
	const now = parseInt( Date.now () / 1000 ), 
		aw = [], ae = [];
	for (const e of wdgt.Entries(now)) {
		e.log.includes(c_ender) && ae.push (e.log.split(c_ender)[1].split(' ')[0]);
		if (!e.log.includes("[") || ae.find (ee=> e.log.includes (ee)) ) continue;
		let endsAt = e.startedAt, duration = 0;
		duration = e.log.substring(e.log.indexOf("[")+1, e.log.indexOf("]"));
		const t = e.log.replace(`[${duration}]`, '');
		if (duration.indexOf('h')!=-1) endsAt += parseInt(duration.substring(0,duration.indexOf('h')))*60*60;
		if (duration.indexOf(' ')!=-1) duration = duration.substring(duration.indexOf(' ')+1);
		if (duration.indexOf('m')!=-1) endsAt += parseInt(duration.substring(0,duration.indexOf('m')))*60;
		duration = endsAt - e.startedAt;
		aw.push ({t:t, startedAt:e.startedAt, duration:duration });
	}
	$app.Widgets ['🛞'].Set (aw.reverse(), wdgt.id);
}

//
function Clock (now, w, c, hours = 7) {
	let h = (now - c) / (60 * 60);
	if (h > hours) {
		if (h > 24) h = '24'
		else h = h.toFixed(1);
		$app.Widgets['🚥'].Add (wdgt.id, w, `${h}`);
	}
	else $app.Widgets['🚥'].Remove (wdgt.id, w);
}

//
function Background() {
	let c = '', cs;
	if ( $app.Vars ['🕯️🕯️'] == "true" ) c += '🕯️🕯️'
	else if ( $app.Vars ['🕯️'] ) c += '🕯️';
	if ( c == '') c = '🌴'
	else c = dx(c);
	
	Helpers.Css ('background-image', wdgt.sid, c);

	//
	function dx(c) {
		let r = '', a = c.match(Helpers.Emoji()), candle = 0;
		a && a.forEach((m) => {
			let dx = 20;	
			if (m == '🕯️'.match(Helpers.Emoji())) dx = candle = (candle ? 40 : 30); // 'match' because length 2≠3
			r += `<tspan dx="-0.${dx}em">${m}</tspan>`;
		});
		return r;
	}
}

//
wdgt.Entries = function* (now) {
	let a = wdgt.data.log.split('¿'); 
	for (let i=0; i < a.length; i++) {
		const startedAt = parseInt(new Date(a[i].substring(0,16)).getTime()/1000);
		if (now - startedAt > 6*60*60) continue;
		yield {log: a[i].substring(11), startedAt: startedAt};
	}
};

})();



// 2.
(()=>{

// Progress Bar
const wdgt = new $app.Service ('🛞');

wdgt.data = [];

//
wdgt.Set = (a, g)=> {
	wdgt.data [g]?.forEach (e=> e.Remove ());
	wdgt.data [g] = [];
	a.forEach (e=> {
		const w = new $app.Widget (`${wdgt.id}_${Date.now ()}`, {
			appendTo: `#${$app.Const.Name}`,
			addClass: wdgt.id,
			repeat: 1,
		});
		w.data = e;
		w.Init = Init.bind (null, w);
		w.Update = Update.bind (null, w, wdgt);
		w.Init ();
		wdgt.data [g].push (w);
	});
};

//
const Init = wdgt=> {
	const spacer = `<div style="height:10px;"></div>`,
		d = wdgt.data, rs = `<div data="${d.t}"><div>${d.t}</div><div></div></div>${spacer}`;
		
	$(wdgt.sid).html(rs);
};

//
const Update = (wdgt, service)=> {
	const now = parseInt( Date.now () / 1000 ), 
		d = wdgt.data;
	let h='', m='', percent = parseInt( (now - d.startedAt) * 100 / d.duration);
	
	if (isNaN(percent) || percent <0) { // probably a futuristic event... 
		m = percent + '%';
		percent = 100; 
	} 
	else {
		if (percent>100) percent=100;
		m = parseInt( (d.duration - now + d.startedAt) / 60 );
		if (m<1) m=''
		else {
			h = parseInt(m / 60);
			if (h==0) h=''
			else if (h*60==m) m=''
			else m-=h*60;
			if (h!='') h+='h';
			if (m!='') m+='m';
		}
	}
	if (percent==100 || !$(wdgt.sid).length) {
		wdgt.Remove ();
		return $app.Const.Status.NoRepeat;
	} 
	const index = $(`.${service.id}`).index(wdgt.sid) * -1, // 🗒️: index is negative
		top = index ? $(`.${service.id}`).eq(index - 1).offset().top : $(wdgt.sid).parent().offset().top + $(wdgt.sid).parent().height();
	
	$(wdgt.sid).css('backgroundSize',`${percent}% 100%`)
		.css('bottom',`calc(100% - ${top}px)`) 
		.children().last().text(`${h} ${m}`);
	
	//
	const bgi = 'background-image', tag = `${wdgt.sid}-${bgi}`;
	if (!wdgt[tag]) {
		wdgt[tag] = true;
		Helpers.Css(bgi, wdgt.sid); // sets the var 
	}
	//
	if (m=='3m' && h=='') $app.Widgets['⏳'].Start (400);
};

})(); 



// 3.
(()=>{

// Status icons
const wdgt = new $app.Widget ('🚥', {
	'🖌️': '🪵',
}), 
	WK = (w, k = '')=> encodeURIComponent (`${w}_${k}`).replaceAll ('%','_').replaceAll ("'",'"'); // 🗒: '.' instead of '_' is error in '<div wk '
let data = [], reposition = 1;


//
wdgt.Update = ()=> {
	const c = `${wdgt.sid} > div`, anchor = $(`#${wdgt ['🖌️'][0]}`),
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

	// 🖌️
	if (!data.length) return reposition = 1;
	if (!reposition) return;
	reposition = 0; 
	$(wdgt.sid).css('bottom', anchor.css('bottom'))
		.css('left', anchor.css('left'));
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
	if (wdgt.status != $app.Const.Status.Done ) return;
	wdgt.Update ();
}

})();
