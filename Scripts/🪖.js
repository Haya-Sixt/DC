// 
(()=>{

// פיקוד העורף
const wdgt = new $app.Widget('🪖');
wdgt.repeat = { init: 3 };

let map;

//
// CORS wdgt.url = ()=> `https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=0`;

//
wdgt.Update = ()=> {
	$(wdgt.sid).html('');
	
	const a = [];
	for (const e of wdgt.data) {
		// 1 hours expired
		const startedAt = parseInt(new Date(e.alertDate).getTime () / 1000);
		if ( (parseInt (new Date().getTime() / 1000) - startedAt) / (60 * 60) > 1) continue;
		
		// find 'alerted cat' in 'a'
		const c = e.category_desc.trim ()
			.replace ("ירי רקטות וטילים", '🚀')
			.replace ("חדירת מחבלים",'🚷')
			.replace ("חדירת כלי טיס עוין", '🛸')
			.replace ("אזהרה", '⚠️');
			
		// normalize 'y'. e.g: ' מודיעין-מכבים-רעות  '
		const F = (f)=> {
			for (const e in y) if (f (e)) return y[e]; // y.find/filter... fail in such big array.
		},
		Y = (d)=> {
			let n = y[d];
			if (!n) n = F ((e)=> e.includes(`(${d})`));
			if (!n) n = F ((e)=> e.startsWith(`${d}-`));
			if (!n) n = F ((e)=> e.includes(`-${d}-`));
			if (!n) n = F ((e)=> e.endsWith(`-${d}`));
			return n;
		}; 
		
		// find 'alerted city' in 'y' 
		e.data.split (', ').forEach ((d)=> { // e.g: "שדרות, איבים, ניר עם"
			// normalize 'd'. e.g: ' תל אביב - מזרח '
			d = d.replace ('אזור תעשייה ','')
				.replace ('הדרומי ','')
				.replace ('צפוני ','')
				.replace ('מטווח ','');
			if (d.includes('-')) d = d.replace (d.slice(d.indexOf('-') - 1), '');
			
			// again  normalize 'd'. remove words. e.g: מטווח ניר עוז
			let i = 0, ix, napa; 
			while ( !( napa = Y ( d.slice (i) ) ) )
				if ( (ix = d.slice (i).indexOf (' ')) == -1) break
				else i += ix + 1; // ' '
			
			// find 'found alerted napa' in 'n'
			if (napa) napa = n[napa]
			else return; // napa = e.data;
			
			// adding 'found napa' to 'found alerted cat in a'
			const ac = a.find (({cat})=> c == cat);
			if (ac?.napa?.includes(napa)) return;
			if (!ac) a.push ({ cat: c, napa: napa, startedAt: startedAt })
			else ac.napa += `, ${napa}`;
		});
	}
	
	//
	if (a.length && !map) map = $app.Widget['🗺️'].Add (wdgt.id);
	//
	$app.Widgets['🔔'].Clear (wdgt.id);
	map?.Clear ();
	//
	for (const k in a) {
		$app.Widgets['🔔'].Info (a[k].cat, a[k].napa, a[k].startedAt, 6 * 60 * 60, wdgt.id);
		map?.Add (a[k].napa, a[k].cat);
	}
};

})(); 
