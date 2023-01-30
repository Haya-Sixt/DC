
// Import
document.querySelector('html').$app.Import();

// 
(()=>{

// Notes
const wdgt = new $app.Widget('📒');
wdgt.repeat = { update: 3 };
wdgt.dependency = '🗓️';

//
wdgt.Update = ()=> { 
	var result = '',
		now = parseInt( new Date().getTime() / 1000 );
	
	for (var i=0; i<wdgt.data.length; i++) {
		var cmd = wdgt.data[i][1].substring( wdgt.data[i][1].indexOf('📒')+1 ).replaceAll(' ',''),
			cond = cmd.substring( cmd.indexOf('(')+1, cmd.indexOf(')') ),
			duration = parseHM(cmd.substring( cmd.indexOf("[")+1, cmd.indexOf("]") )),
			condC = ','+cond.replaceAll('+',',').replaceAll('-',',')+',',
			startedAt=0, endsAt, indx;
		
			
		// Starts at :
		
		// 🗓️
		if ((indx=condC.indexOf(',תאריך_'))!=-1) {
			var dm = (dm=condC.substring(indx+7)).substring(0, dm.indexOf(',')).split('_'),
				d = dm[0].replace('ʼ',"'"), m = dm[1];
				
			// every month
			if (m == 'בחודש') {
				if ($('#🗓️ .tdCurrent .hebdate').text().indexOf(d) != -1)
					// default is 🌇
					startedAt = $app.Vars['🌇'] + parseHM(cond, 'תאריך_'+d+'_'+m,condC);
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
			startedAt = $app.Vars['🌇'] + parseHM(cond,'🌇',condC);
		}
		
		if (!startedAt || startedAt>now) 
			continue;
		
			
		// Ends at
		endsAt = startedAt + duration;
	
		if (endsAt<now) 
			continue;
			
		//
		result += '<div name="note" startedAt="'+startedAt+'" duration="'+duration+'" >' 
			+ wdgt.data[i][0]+'<br>'+wdgt.data[i][1].substring(0,wdgt.data[i][1].indexOf('📒')).replaceAll('<br>','  ') 
			+ '<div style="background-image: linear-gradient(to right, rgba(250, 20, 80, 0.6) 0%, rgba(100, 100, 241, 0.6) 0% );"></div></div>';
	}
	
	$(wdgt.sid).html(result);
	
	Progress();
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

function notesProgress() {
	try {

	var notes = $(wdgt.sid + " > div[name=note]");
	var now = parseInt( new Date().getTime() / 1000 ); 

	notes.each(function() {
		var percent = parseInt( (now - parseInt($(this).attr('startedAt'))) *100 / parseInt($(this).attr('duration')) ), 
			noteP = $(this).children(':last-child');
		
		if (isNaN(percent) || percent <0) {
			percent = 100; 
			$(this).addClass("errorBorder");
		} else {
			if (percent>100) percent=100;
			$(this).removeClass("errorBorder");
		}

		var bi = noteP.css('background-image');
		var cut = bi.substring( bi.indexOf(')')+1, bi.indexOf('%')+1 );
		bi = bi.replace(cut, percent+'%');
		noteP.css('background-image', bi);
	});

	notes.length > 0 && setTimeout(Progress, 1000*61);
	
	} catch (e) { $(wdgt.sid).text(`${wdgt.id} Progress: ${e}`); } 
} 

})();