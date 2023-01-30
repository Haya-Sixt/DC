
// ⏱️ 
function timerInit() {
	try {

	// #📆
	addEventListener("#📆", function() {
		try {
			
		// Set $app.Vars 
		var shm = $("#📆 td:contains(🌇)").next().text().split(':');
		($app.Vars['🌇']=new Date()).setHours(shm[0], shm[1], 0, 0);
		$app.Vars['🌇'] = parseInt(new Date($app.Vars['🌇']).getTime()/1000);
		
		} catch(e) { $("#⏱️").text(e+'\n⏱️ #📆'); }
	}, false);
	
	
	// #🗓️ 
	addEventListener("#🗓️", function() {
		try {
			
		// ⏰
		scheduleUpdate();
	
		// 📒
		notesInit ();
			
		} catch(e) { $("#⏱️").text(e+'\n⏱️ #🗓️'); }
	}, false);
	

	// Time
	timeInit();

	// 
	$('#⏱️').text( new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) 
		+ ' ⏱️');  
	
	} catch(e) {
		$("#⏱️").text(e+'\n⏱️ Rebooting (40s)...');
		setTimeout(timerInit, 1000*40);
	} 
}


// Time
function timeInit() {
	timeUpdate();
	setInterval(timeUpdate, 1000*60);
	
	function timeUpdate() {
		var time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }); 
		$("#time").text(time);
		var date = new Date().toLocaleDateString('he-IL', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace("יום ","").replace('.','/'); 
		$("#date").text(date);
	}
}


// ⏰
class Schedule {
	static c_match () { return /\p{Extended_Pictographic}(?<!🌾|🐮)/umg; } 
}


// ⏰
function scheduleUpdate() {
	try {
		
	setTimeout(scheduleUpdate, 1000*60*10); 
		
	Current() || Next() || $("#⏰").text('');
	
	LogIcon();
		
	} catch(e) { $("#⏰").text(e+'\n⏰ scheduleUpdate'); }


	
	function Current() {
		try {
			
		var time = parseInt( new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }).replace(':','') ), 
			firstMark = null,
			match = $('#🗓️ .tdCurrent').text().match(/[0-2][0-9]:[0-5][0-9]/gm);
		
		match && match.forEach((m) => { 
			var val = parseInt( m.replace(':','') );
			if ( time <= val && !firstMark) 
				firstMark = m;
		});
		
		if (firstMark) {
			$("#⏰").html('<span>'+firstMark+'</span><span>⏰</span>');
			$("#⏰").addClass("markIconText");
			return true;
		}
		
		$("#⏰").removeClass("markIconText"); 
		
		} catch(e) { $("#⏰").text(e+'\n⏰ Current'); }
		
		return false;
	}  
			
	
	
	function Next() {
		try {
			
		var days=0, d="", c=false;
		
		$("#🗓️ .tdDay").each(function () {
			
			if ( $(this).hasClass('tdCurrent') ) {
				c = '' + $(this).text().match(Schedule.c_match());
			 
			}
			else if (c) {
				let m = $(this).text().match(Schedule.c_match());
				if (m) m = m.reduce((s,e)=>s + (c.includes(e) ? '' : e), '');
				if (m && m!='') {
					if (days == 0) d = 'מחר '
					else if (days == 1) d = 'מחרתיים '
					else d = (days+1) + " ימים ל "; 
					$("#⏰").text( d + m );
					days =0;
					return false;
				}
				
				days++;
			}
		});
		
		return !days;
		
		} catch(e) { $("#⏰").text(e+'\n⏰ Next'); }
	}  
	
	
	
	function LogIcon() {
		try {
			
		var bg = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' version=\'1.1\'><text x=\'3%\' y=\'90%\' font-size=\'4em\'>', 
			match = $("#🗓️ .tdCurrent").text().match(Schedule.c_match()),
			c = '';
		if ( $app.Vars['🕯️🕯️'] == "true" )  c += '🕯️🕯️';
		if ( match )  c += match.join('');
		if ( $app.Vars['☔'] )  c += '☔️';
		if ( c == '')  c += '🌴';
		
		$("#🪵").css('backgroundImage', bg + dx(c) + '</text></svg>")');

		} catch(e) { $("#⏰").text(e+'\n⏰ LogIcon'); }
		
		//
		function dx() {
			let r = '';
			c.match(Schedule.c_match()).forEach((m) => {
				r += '<tspan dx=\'-0.' + (m == '🕯️' ? 45 : 20) + 'em\'>' + m + '</tspan>';
			});
			return r;
		}
	}  
	
	
}
