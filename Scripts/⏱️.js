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
	$("<div>").css('background-image', `url('data:image/svg+xml;utf8,
	<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 1000 1000" style="font-size: 100;">
	<defs>
	<filter id="⌚filter">
	<feTurbulence type="turbulence">
		<animate attributeName="baseFrequency" values="0.4;0.5" dur="10s" repeatCount="indefinite" />
		<animate attributeName="numOctaves" values="4;5" dur="10s" repeatCount="indefinite" />
	</feTurbulence>
	<feColorMatrix id="⌚matrix" type="matrix" values="0 0 0 -1 1 0 0 0 -1 1 0 0 0 -1 1 0 0 0 0 1"/>
	<feComponentTransfer>
		<feFuncR type="table" tableValues="0 0 0 .4 1"/>
	</feComponentTransfer>
		</filter>
	<mask id="⌚mask">
	<text x="250" y="500"»>??:??</text>
	</mask>
	</defs> 
	<text x="250" y="500" style="filter: url(#⌚filter);" mask="url(#⌚mask)"»>??:??</text>
	</svg>')`.replaceAll('\n','')).appendTo($(wdgt.sid));

	// colon 
	$("<div>").appendTo($(wdgt.sid));
};

wdgt.Update = ()=> {
	const time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
		e = $(document.querySelector(wdgt.sid).firstElementChild),
		b = e.css('background-image'),
		x = b.indexOf ('»') + 2,
		t = b.slice(x, x + 5);
	e.css('background-image', b.replaceAll (t, time));
}

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