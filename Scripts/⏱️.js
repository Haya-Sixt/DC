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
	$(wdgt.sid).text(''); 
};

wdgt.Update = ()=> {
	const time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
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