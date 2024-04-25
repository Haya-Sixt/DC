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

//
wdgt.Add = (w, k)=> {
	const wk = ` ${w}.${k}`;
	wdgt.Init ();
	wdgt.data += wk;
	Refresh ();
}

//
function Refresh () {
	if (wdgt.status != $app.Constants.Status.Done ) return;
	wdgt.Update ();
}

})();


// 2.
(()=>{

// Time
const wdgt = new $app.Widget ('⌚');
wdgt.repeat = { update: 1 };
wdgt['🌃'] = $app.Constants['🌃'].Dim;

//
wdgt.Init = ()=> {
	$(wdgt.sid).text(''); 
};

wdgt.Update = ()=> {
	const time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }).replace (':', ' ');
	//
	if (time == '00 01' && $(wdgt.sid).text() == '00 00') location.reload (); 
	//
	Helpers.Css ('background-image', wdgt.sid, time);
}

})();


// 3.
(()=>{

// Date Loazi
const wdgt = new $app.Widget('📅👉');

//
wdgt.Init = ()=> {
	let date = new Date().toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }).replace('.','/'); 
	$(wdgt.sid).text(date);
};

})();


// 4.
(()=>{

// Date Hebrew
const wdgt = new $app.Widget('📅👈');

//
wdgt.Init = ()=> {
	wdgt.data = { 
		year: new Intl.DateTimeFormat('he-u-ca-hebrew',{year:'numeric'}).format(new Date()),
		month: wdgt.Month(new Date())
	};
};
	
//
wdgt.Update = ()=> {
	const seven = !(wdgt.data.year % 7) ? 'שנת שמיטה' : 'שנה ' + String.fromCharCode((wdgt.data.year % 7) + 'א'.charCodeAt(0) - 1) + "'", 
		leap = '' + ([0,3,6,8,11,14,17].includes(wdgt.data.year % 19) ? 'מעוברת' : 'פשוטה'),
		year = `${wdgt.data.year.slice(1)}'5`;
	
	$(wdgt.sid).text( wdgt.data.month + '  ' + year + '  ' + seven + '  ' + leap );
};

//
wdgt.Month = (now)=> {
	let m = new Intl.DateTimeFormat('he-u-ca-hebrew',{month:'long'}).format(now);
	if (m.includes('כסלו')) m = 'כסליו';
	if (m.includes('אדר ')) m = m.slice(0, m.length-1) + "'";
	return m;
	};

})();


// 5.
(()=>{

// Schedule
const wdgt = new $app.Widget('⏰');
wdgt.repeat = { update: 10 };
wdgt.dependency = ['📆'];

//
wdgt.Init = ()=> {}

//
wdgt.Update = ()=> {
	Current() || Next() || $(wdgt.sid).html('&nbsp;');
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
				else d = (days + 0) + " ימים ל "; 
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