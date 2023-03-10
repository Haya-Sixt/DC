// 
(()=>{

// Notes
const wdgt = new $app.Widget('π');
wdgt.repeat = { update: 3 };
wdgt.dependency = ['π', $app.Vars.Dependency('π―οΈ')];

//
wdgt.Update = ()=> { 
	var result = '',
		now = parseInt( new Date().getTime() / 1000 );
	
	for (var i=0; i<wdgt.data.notes.length; i++) {
		var cmd = wdgt.data.notes[i][1].substring( wdgt.data.notes[i][1].indexOf('π')+1 ).replaceAll(' ',''),
			cond = cmd.substring( cmd.indexOf('(')+1, cmd.indexOf(')') ),
			duration = parseHM(cmd.substring( cmd.indexOf("[")+1, cmd.indexOf("]") )),
			condC = ','+cond.replaceAll('+',',').replaceAll('-',',')+',',
			startedAt=0, endsAt, indx;
		
			
		// Starts at :
		
		// ποΈ
		if ((indx=condC.indexOf(',ΧͺΧΧ¨ΧΧ_'))!=-1) {
			var dm = (dm=condC.substring(indx+7)).substring(0, dm.indexOf(',')).split('_'),
				d = dm[0].replace('ΚΌ',"'"), m = dm[1];
				
			// every month
			if (m == 'ΧΧΧΧΧ©') {
				if ($('#ποΈ .tdCurrent .hebdate').text().indexOf(d) != -1)
					// default is π
					startedAt = $app.Vars['π'] + parseHM(cond, 'ΧͺΧΧ¨ΧΧ_'+d+'_'+m,condC);
				else
					continue; 
			}
		}
		
		// π―οΈ
		if (condC.indexOf(',π―οΈ,')!=-1) {
			if ($app.Vars['π―οΈ']>0)
				startedAt = $app.Vars['π―οΈ'] + parseHM(cond,'π―οΈ',condC)
			else
				continue;
		}
		
		// π
		if (condC.indexOf(',π,')!=-1) {
			startedAt = $app.Vars['π'] + parseHM(cond,'π',condC);
		}
		
		if (!startedAt || startedAt>now) 
			continue;
		
			
		// Ends at
		endsAt = startedAt + duration;
	
		if (endsAt<now) 
			continue;
			
		//
		result += '<div name="note" startedAt="'+startedAt+'" duration="'+duration+'" >' 
			+ wdgt.data.notes[i][0]+'<br>'+wdgt.data.notes[i][1].substring(0,wdgt.data.notes[i][1].indexOf('π')).replaceAll('<br>','  ') 
			+ '<div style="background-image: linear-gradient(to right, rgba(250, 20, 80, 0.6) 0%, rgba(100, 100, 241, 0.6) 0% );"></div></div>';
	}
	
	$(wdgt.sid).html(result);
	
	Progress ();
};

function parseHM(cond, find, condC) {
	var t=0;
	if ( find ) {
		if ( (indx=condC.indexOf(','+find+',')) == -1) return 0;
		// π: emoji are 2 for the substring, but are 1 for the length
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