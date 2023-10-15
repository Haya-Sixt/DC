
// 
(()=>{

// פיקוד העורף
const wdgt = new $app.Widget('🛟');
wdgt.repeat = { init: 3 };

//
wdgt.url = ()=> `https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=0`;

//
wdgt.Update = ()=> {
	$(wdgt.sid).html('');
	
	const a = [];
	for (const e of wdgt.data) {
		// 6 hours 
		if (parseInt((new Date() - new Date(e.alertDate)) / (1000 * 60)) / 60 < 6) continue;
		//
		const c = e.category_desc;
		let d = e.data
			.replace ('אזור תעשייה ','')
			.replace ('הדרומי ','')
			.replace ('צפוני ','');
		if (d.includes('-')) d.replace (d.slice(d.indexOf('-') - 1), '');
		if (!a[c]) a[c] = '';
		if (!a[c].includes(d)) {
			if (a[c]) a[c] += `, `;
			a[c] += d;
		}
	}
	for (const k in a) {
		$app['🔔'].Info (`${wdgt.id} ${k}`, a[k]);
	}
};

})();
