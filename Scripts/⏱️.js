// Import
document.querySelector('html').$app.Import();

// 1.
(()=>{

// Start
const wdgt = new $app.Widget('⏱️');

//
wdgt.Init = ()=> {
	$('#⏱️').text( new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) 
		+ ' ⏱️');
};

})();


// 2.
(()=>{

// Time
const wdgt = new $app.Widget('⌚');
wdgt.repeat = { init: 1 };

//
wdgt.Init = ()=> {
	var time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }); 
	$(wdgt.sid).text(time);
};

})();


// 3.
(()=>{

// Schedule
const wdgt = new $app.Widget('⏰');
wdgt.repeat = { init: 10 };
wdgt.dependency = '🗓️';

//
wdgt.Init = ()=> {
	Current() || Next() || $(wdgt.sid).text('');
	
	LogIcon();
};

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
		$(wdgt.sid).html('<span>'+firstMark+'</span><span>⏰</span>');
		$(wdgt.sid).addClass("markIconText");
		return true;
	}
	
	$(wdgt.sid).removeClass("markIconText"); 
	
	} catch(e) { $(wdgt.sid).text(`${e}\n${wdgt.id} Current`); }
	
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
				$(wdgt.sid).text( d + m );
				days =0;
				return false;
			}
			
			days++;
		}
	});
	
	return !days;
	
	} catch(e) { $(wdgt.sid).text(`${e}\n${wdgt.id} Next`); }
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

	} catch(e) { $(wdgt.sid).text(`${e}\n${wdgt.id} LogIcon`); }
	
	//
	function dx() {
		let r = '';
		c.match(Schedule.c_match()).forEach((m) => {
			r += '<tspan dx=\'-0.' + (m == '🕯️' ? 45 : 20) + 'em\'>' + m + '</tspan>';
		});
		return r;
	}
}  
	

class Schedule {
	static c_match () { return /\p{Extended_Pictographic}(?<!🌾|🐮)/umg; } 
}

})();