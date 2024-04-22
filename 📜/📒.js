// 1.
(()=>{

// Notes
const wdgt = new $app.Widget('📒');
wdgt.dependency = ['📆', $app.Constants.Var('🕯️')];
wdgt.repeat = { update: 3 };

//
wdgt.Update = ()=> { 
	$(wdgt.sid).html('');

	StatusIcons ();
	for (const e of wdgt.Entries())  // 🗒: yield doesn't work with forEach because it's callback
		if (e.text == '') StatusIcons (e.title)
		else $app.Widgets['🔔'].Info (e);
};


//
function Zmanit (t) {
	const c = '{{Zmanit_';
	t.includes (c) && t.matchAll (`${c}.*?}}`).toArray().forEach ((e)=> {
		t = t.replace (e[0], ((e)=> {
			const T = (t)=> $app.Widgets['📆'].data[t],
				d = new Date(T('👑') * 1000), 
				m = parseFloat(parseFloat ((T('🙏') - T('👑')) / 60).toFixed(1)),
				h = e.slice(c.length).slice(0, -2) - 4;
			d.setMinutes(d.getMinutes() + (m * h));
			return `${d.getHours()}:${d.getMinutes()}`;
		}));
	});
	return t;
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
			const dm = cs.split('_'), dmd = dm[0].replace('ʼ',"'"), dmm = dm.length > 1 ? dm[1] : '';
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
		// 🗒: '🌋' App Must Have Delay Before 🔔. Otherwise '🏡' Won't Be Triggered (Because '🌋' Is Open).
		c = '🕯️';
		if (condC.includes(`,${c},`)) {
			let cs = (x = $app.Vars[c]) + parseHM(cond, c, condC);
			if (!x || cs > now) continue;
			if (!startedAt) startedAt = cs;
		}

		//
		yield {			
			title: e[0],
			text: Zmanit (e[1].substring(0, e[1].indexOf('📒')).replaceAll('<br>','  ').trim()),
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

//
function StatusIcons (title) {
	const r = '🗓️', wk = `${wdgt.sid}${r}`;
	if (!title) $app.Widgets['🚥'].Remove (wk)
	else if (title.startsWith(r)) {
		const a = document.querySelector(`#${r} td.tdCurrentHeb ${title.replace(r, '')}`)?.childNodes?.entries();
		if (!a) return;
		let t, x; 
		for (const [k, v] of a)
			if (isNaN(v.textContent)) t = v.textContent
			else x = v.textContent;
		$app.Widgets['🚥'].Add (wk, t, x);
	}
}

})();
