// 
(()=>{

// Notes
const wdgt = new $app.Widget('📒');
wdgt.repeat = { update: 3 };
wdgt.dependency = ['📆', $app.Vars.Dependency('🕯️')];

//
wdgt.Update = ()=> { 
	const now = parseInt( new Date().getTime() / 1000 );
	let rs = '';
	
	for (var i=0; i<wdgt.data.notes.length; i++) {
		const cmd = wdgt.data.notes[i][1].substring( wdgt.data.notes[i][1].indexOf('📒')+1 ).replaceAll(' ',''),
			cond = cmd.substring( cmd.indexOf('(')+1, cmd.indexOf(')') ),
			duration = parseHM(cmd.substring( cmd.indexOf("[")+1, cmd.indexOf("]") )),
			condC = ','+cond.replaceAll('+',',').replaceAll('-',',')+',';
		let startedAt=0, endsAt, indx;
		
			
		// Starts at :
		
		// 🗓️
		if ((indx=condC.indexOf(',תאריך_'))!=-1) {
			const dm1 = condC.substring(indx+7),
				dm2 = dm1.substring(0, dm1.indexOf(',')).split('_'),
				dmd = dm2[0].replace('ʼ',"'"), dmm = dm2[1];
				
			if (dmm == 'בחודש' || $app.Widgets['📅👈'].data.month.includes(dmm)) {
				if ($('#🗓️ .tdCurrent .hebdate').text().indexOf(dmd) != -1)
					// default is 🌇
					startedAt = $app.Widgets['📆'].data['🌇'] + parseHM(cond, 'תאריך_'+dmd+'_'+dmm, condC);
				else
					continue; 
			}
		}
		
		// 🕯️
		if (condC.indexOf(',🕯️,')!=-1) {
			if ($app.Vars['🕯️']>0)
				startedAt = $app.Vars['🕯️'] + parseHM(cond,'🕯️',condC)
			else
				continue;
		}
		
		// 🌇
		if (condC.indexOf(',🌇,')!=-1) {
			startedAt = $app.Widgets['📆'].data['🌇'] + parseHM(cond,'🌇',condC);
		}
		
		if (!startedAt || startedAt>now) 
			continue;
		
			
		// Ends at
		endsAt = startedAt + duration;
	
		if (endsAt<now) 
			continue;
			
		//
		const Zmanit = (h)=> {
				const d = new Date($app.Widgets['📆'].data['👑'] * 1000), 
					m = parseFloat(parseFloat (($app.Widgets['📆'].data['🙏'] - $app.Widgets['📆'].data['👑']) / 60).toFixed(1));
				h -= 4;
				d.setMinutes(d.getMinutes() + (m * h));
				return `${d.getHours()}:${d.getMinutes()}`;
			},
			r = `<div name="note" startedAt="${startedAt}" duration="${duration}" >${
				wdgt.data.notes[i][0]}<br>${wdgt.data.notes[i][1].substring(0,wdgt.data.notes[i][1].indexOf('📒'))}`;
		rs = `${rs}${
			r.replaceAll('<br>','  ')
			.replace ('{{Zmanit_4.5}}',  Zmanit(4.5))
			.replace ('{{Zmanit_5.8}}',  Zmanit(5.8))
			.replace ('{{Zmanit_10}}',  Zmanit(10))
			}<div style="background-image: linear-gradient(to right, rgba(250, 20, 80, 0.6) 0%, rgba(100, 100, 241, 0.6) 0% );"></div></div>`;
	}
	
	$(wdgt.sid).html(rs);
	
	Progress ();
};

function parseHM(cond, find, condC) {
	var t=0;
	if ( find ) {
		if ( (indx=condC.indexOf(','+find+',')) == -1) return 0;
		// 🗒: emoji are 2 for the substring, but are 1 for the length
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