// 1.
(()=>{

// Notes
const wdgt = new $app.Widget('📒');
wdgt.repeat = { update: 3 };
wdgt.dependency = ['📆', $app.Vars.Dependency('🕯️')];

//
wdgt.Update = ()=> { 
	let rs = '';

	for (const e of wdgt.Entries()) { // 🗒: yield doesn't work with forEach because it's callback
		if (e.text == '') continue;
		const r = `<div name="note" startedAt="${e.startedAt}" duration="${e.duration}" >${e.title}<br>${e.text}`;
		rs = `${rs}${r.replace ('{{Zmanit_4.5}}',  Zmanit(4.5)).replace ('{{Zmanit_5.8}}',  Zmanit(5.8)).replace ('{{Zmanit_10}}',  Zmanit(10))
			}<div style="background-image: linear-gradient(to right, rgba(250, 20, 80, 0.6) 0%, rgba(100, 100, 241, 0.6) 0% );"></div></div>`;
	}

	$(wdgt.sid).html(rs);
	Progress ();
};

//
function Zmanit (h) {
	const T = (t)=> $app.Widgets['📆'].data[t],
		d = new Date(T('👑') * 1000), 
		m = parseFloat(parseFloat ((T('🙏') - T('👑')) / 60).toFixed(1));
		h -= 4;
	d.setMinutes(d.getMinutes() + (m * h));
	return `${d.getHours()}:${d.getMinutes()}`;
}

//
wdgt.Entries = function* () {
	const now = parseInt( new Date().getTime() / 1000 );

	for (var i = 0; i < wdgt.data.notes.length; i++) {
		const e = wdgt.data.notes[i],
			cmd = e[1].substring( e[1].indexOf('📒') + 1 ).replaceAll(' ', ''),
			cond = cmd.substring( cmd.indexOf('(') + 1, cmd.indexOf(')') ),
			duration = parseHM(cmd.substring( cmd.indexOf("[") + 1, cmd.indexOf("]") )),
			condC = `,${cond.replaceAll('+', ',').replaceAll('-', ',')},`;
		let startedAt = 0, x, c;
		
		//
		c = '📅';
		x = condC.indexOf(`,${c}`);
		if (x != -1) {
			let cs = condC.substring(x + String(`,${c}`).length);
			cs = cs.substring(0, cs.indexOf(','));
			const dm = cs.split('_'), dmd = dm[0].replace('ʼ',"'"), dmm = dm.length1 > 1 ? dm[1] : '';
			if ((dmm != '' && !$app.Widgets['📅👈'].data.month.includes(dmm)) || !($('#🗓️ td.tdCurrentHeb .hebdate').text()).includes(dmd)) continue; 
		}
				
		// 
		c = '📆';
		x = condC.indexOf(`,${c}`);
		if (x != -1) {
			let cs = condC.substring(x + String(`,${c}`).length);
			cs = cs.substring(0, cs.indexOf(','));
			startedAt = $app.Widgets['📆'].data[cs];
			startedAt += parseHM(cond, c + cs, condC);
		
		  if (!startedAt || startedAt > now || startedAt + duration < now) continue;
		}

		//
		c = '🗓️';
		x = condC.indexOf(`,${c}`);
		if (x != -1) {
			let cs = condC.substring(x + String(`,${c}`).length);
			cs = cs.substring(0, cs.indexOf(','));

			if (!($('#🗓️ td.tdCurrentHeb').text()).includes(cs)) continue; 
		}

		// 
		c = '🕯️';
		x = $app.Vars[c];
		if (condC.includes(`,${c},`)) {
			if (x) startedAt = x + parseHM(cond, c, condC);
			if (!x || x <= 0 || startedAt > now || startedAt + duration < now) continue;
		}

		//
		yield {			
			title: e[0],
			text: e[1].substring(0, e[1].indexOf('📒')).replaceAll('<br>','  ').trim(),
			startedAt: startedAt,
			duration: duration 
		};
	}
};

function parseHM(cond, find, condC) {
	var t=0;
	if ( find ) {
		if ( (indx=condC.indexOf(','+find+',')) == -1) return 0;
		// 🗒: emoji are 2/3 for the substring, but are 1 for the length
		cond = cond.substring( indx ) + ',';
		cond = cond.substring(0, cond.indexOf(',') );
		if ((indx=cond.indexOf('+')) != -1)
			cond=cond.substring(indx)
		else if ((indx=cond.indexOf('-')) != -1)
			cond=cond.substring(indx)
		else return 0;

		t = parseHM( cond );
		return t;
		
	} else {
		if (cond.indexOf('h')!=-1) {
			var h = cond.substring(0,cond.indexOf('h')+1);
			t += parseInt(h)*60*60;
			cond = cond.replace(h,''); 
		}
		if (cond.indexOf('m')!=-1) 
			t += parseInt(cond)*60;
		return t;
	}
}

function Progress () {
	try {

	var notes = $(wdgt.sid + " > div[name=note]");
	var now = parseInt( new Date().getTime() / 1000 ); 

	notes.each((i, t)=> {
		var percent = parseInt( (now - parseInt($(t).attr('startedAt'))) *100 / parseInt($(t).attr('duration')) ), 
			noteP = $(t).children(':last-child');
		
		if (isNaN(percent) || percent <0) {
			percent = 100; 
			$(t).addClass("error");
		} else {
			if (percent>100) percent=100;
			$(t).removeClass("error");
		}

		var bi = noteP.css('background-image');
		var cut = bi.substring( bi.indexOf(')')+1, bi.indexOf('%')+1 );
		bi = bi.replace(cut, percent+'%');
		noteP.css('background-image', bi);
	});

	notes.length > 0 && setTimeout(Progress, 1000*61);
	
	} catch (e) { wdgt.Error(e, 'Progress') } 
} 

})();


// 2.
(()=>{

// Status icons
const wdgt = new $app.Widget('🚥');
wdgt.repeat = { update: 3 };
wdgt.dependency = ['📒'];
wdgt.data = [];

wdgt.Init = ()=> {
}

wdgt.Update = ()=> { 
	const Add = (t, x)=> {
			x = x ? `<span>${x}<span>` : '';
			rs = `${rs}<div>${t}${x}</div>`;
	  };
	let rs = '', r;

	// 📒
	for (const e of $app.Widgets['📒'].Entries()) {
    if (e.text != '') continue; 

		r = '🗓️';
		if (e.title.startsWith(r)) {
			let t, x, a = document.querySelector(`#🗓️ td.tdCurrentHeb ${e.title.replace(r, '')}`)?.childNodes?.entries();
			if (!a) continue;
			for (const [k, v] of a) {
				if (isNaN(v.textContent)) t = v.textContent
				else x = v.textContent; 
		  }
			Add (t, x);
			continue;
		}

		Add (e.title);
	}

	// From 'Add' - 🔋, ☔, 🌡️ ...
	for (const [k, v] of Object.entries(wdgt.data)) {
		Add (k, v);
	}

	// Resize 🪵
	if (rs == '') $('#🪵').removeClass ('🪵🚥')
	else $('#🪵').addClass ('🪵🚥');
	
	//
	$(wdgt.sid).html(rs);
}

//
wdgt.Add = (t,s)=> {
  wdgt.data [t] = s;
}

})();