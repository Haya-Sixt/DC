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
	const time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
	//
	if (time == '00:00' && $(wdgt.sid).text() == '23:59') location.reload (); 
	//
	Helpers.Css ('background-image', wdgt.sid, time);
}

//#⌚ { color: var(--🖥️-c-ts-1); }
//#⌚ { font-size: var(--🖥️-c-px-155); text-align:center; animation-name: ⌚; animation-duration: 12s; animation-iteration-count: infinite; } /* #⌚ svg { font-size: var(--🖥️-c-px-11); font-weight: 400; animation-name: ⌚; animation-duration: 12s; animation-iteration-count: infinite; } */
//#⌚Colon { position: relative; width: 6%; height: 65%; left: -47%; top: -83%; animation-name: ⌚Colon; animation-duration: 2s; animation-timing-function: ease; animation-iteration-count: infinite; } /* svg: top -65% */
//@keyframes ⌚ { 0% {color: rgba(var(--🖥️-c-ts-1_rgb), 0.839);} 50% {color: rgba(var(--🖥️-c-ts-2_rgb), 0.459);} 100% {color: rgba(var(--🖥️-c-ts-1_rgb), 0.839);} } /* svg: @keyframes ⌚ { 0% {filter: sepia(1) opacity(0.8);} 50% {filter: sepia(1) opacity(0.5);} 100% {filter: sepia(1) opacity(0.8);} } */ 
//@keyframes ⌚Colon { 0% {backdrop-filter: brightness(0.7);} 50% {backdrop-filter: brightness(0);} 100% {backdrop-filter: brightness(0.7);} } 
// init. colon 
//$("<div>").attr('id',`${wdgt.id}Colon`).appendTo($(wdgt.sid));
// update
//document.querySelector(wdgt.sid).firstChild.textContent = time; 

})();


// 3.
(()=>{

// Date Loazi
const wdgt = new $app.Widget('📅👉');

//
wdgt.Init = ()=> {
	let date = new Date().toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }); // 1. #📅👉 { left:35%; top:35%; }  2. weekday: 'short'  3. .replace("יום ","").replace('.','/'); 
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