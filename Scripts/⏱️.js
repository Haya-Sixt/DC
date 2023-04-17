// 1.
(()=>{

// Start
const wdgt = new $app.Widget('⏱️');

//
wdgt.Init = ()=> {
	wdgt.data = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

//
wdgt.Update = ()=> {
	$(wdgt.sid).text(`${wdgt.data} ${wdgt.id}`);
};

})();


// 2.
(()=>{

// Time
const wdgt = new $app.Widget('⌚');
wdgt.repeat = { update: 1 };

//
wdgt.Init = ()=> {
	// colon 
	$("<div>").appendTo($(wdgt.sid));
};

wdgt.Update = ()=> {
	const time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }); 
	document.querySelector(wdgt.sid).firstChild.textContent = time;
}

})();


// 3.
(()=>{

// Schedule
const wdgt = new $app.Widget('⏰');
wdgt.repeat = { update: 10 };
wdgt.dependency = ['🗓️'];

//
wdgt.Init = ()=> {}

//
wdgt.Update = ()=> {
	Current() || Next() || $(wdgt.sid).html('&nbsp;');;
};

function Current() {
	var now = parseInt( new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }).replace(':','') ), 
		firstMark = null,
		match = $('#🗓️ .tdCurrent').text().match(/[0-2][0-9]:[0-5][0-9]/gm);
	
	match && match.forEach((m) => { 
		var val = parseInt( m.replace(':','') );
		if ( now <= val && !firstMark) 
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
	var days = 0, d = "", c = false;
	
	$("#🗓️ .tdDay").each((i, t)=> {
		
		if ( $(t).hasClass('tdCurrentHeb') ) {
			!$(t).hasClass('tdCurrent') && days++;
			c = $(t).text().match(Helpers.Emoji());
			!c && (c = ' ');
		}
		else if (c) {
			let m = $(t).text().match(Helpers.Emoji());
			m && (m = m.reduce((s, e)=> s + (c.includes(e) ? '' : e), ''));
			if (m && m != '') {
				if (days == 0) d = 'היום בערב '
				else if (days == 1) d = 'מחר בערב '
				else d = (days + 1) + " ימים ל "; 
				$(wdgt.sid).html(`<span>${d}</span>${m}`);
				days = 0;
				return false; // 🗒: break '$.each' (but not 'forEach')
			}
			
			days++;
		}
	});
	
	return !days;
}

})();