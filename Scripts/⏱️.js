// Import
document.querySelector('html').$app.Import();

// 1.
(()=>{

// Start
const wdgt = new $app.Widget('⏱️');

//
wdgt.Init = ()=> {
	const time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
	$(wdgt.sid).text(`${time} ${wdgt.id}`);
};

})();


// 2.
(()=>{

// Time
const wdgt = new $app.Widget('⌚');
wdgt.repeat = { init: 1 };

//
wdgt.Init = ()=> {
	const time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }); 
	$(wdgt.sid).text(time);
};

})();


// 3.
(()=>{

// Schedule
const wdgt = new $app.Widget('⏰');
wdgt.repeat = { init: 10 };
wdgt.dependency = ['🗓️'];

//
wdgt.Init = ()=> {
	Current() || Next() || $(wdgt.sid).text('');
};

function Current() {
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
	
	return false;
}

function Next() {
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
}

})();


//
// - used also in 🪵
class Schedule {
	static c_match () { return /\p{Extended_Pictographic}(?<!🌾|🐮)/umg; } 
}