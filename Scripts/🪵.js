// 1.
(()=>{

// Log
const wdgt = new $app.Widget('🪵');
wdgt.repeat = { init: 3 };
wdgt.dependency = ['📆','⏱️'];

wdgt.Constants = { Ender: '➖'};

//
wdgt.Update = ()=> {
	let rs ='', now = parseInt( new Date().getTime() / 1000 ),
		forecast_clock = parseInt(new Date(wdgt.data.forecast_clock).getTime()/1000),
		shishi = 0;
	
	for (const e of wdgt.Entries(now)) { // 🗒: yield doesn't work with forEach because it's callback
		if ( e.log.includes(wdgt.Constants.Ender) ) continue;

		rs += `<div data="${e.log}" ${ e.log.indexOf("[") == -1 && 'style="display:none;"' }>${e.log}</div>`;

		// Set shishi
		if ( e.log.substring(6).substring(0,4) == '🕯️ ' )
			shishi = e.startedAt;
	};

	// ⏱️
	rs = `${rs}<div>${$('#⏱️').text()}</div>`; 

	// 🕯️🕯️
	// 🗒: '🌋' App Must Have Delay Before 🔔. Otherwise '🏡' Won't Be Triggered (Because '🌋' Is Open).
  $app.Vars ['🕯️'] = shishi;
	wdgt.data ['🕯️🕯️'] = wdgt.data.shabbat;

	//
	$(wdgt.sid).html(rs);
	

	// 🔋
	if (wdgt.data.battery != "100") $app.Widgets['🚥'].Add ('🔋', wdgt.data.battery);

	// 🌡️
	if (now - forecast_clock > 6*60*60) {
		var h = ((now - forecast_clock) / -60);
		if (h < 24) h = '24'
		else h = h.toFixed(1);
		$app.Widgets['🚥'].Add ('🌡️', `${h}`);
	}

	//
	Background ();
};

//
function Background() {
	try {		
	let bg = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1'><text x='3%' y='90%' font-size='3.8em'>`, 
		c = '', cs;
	if ( wdgt.data['🕯️🕯️'] == "true" ) c += '🕯️🕯️';
	if ( (cs = $("#🗓️ td.tdCurrentHeb").text().match(Helpers.Emoji())) ) c += cs.join('');
	if ( c == '') c = $app.Widgets[`📆`].data.current; 
	
	$(wdgt.sid).css('backgroundImage', `${bg}${dx(c)}</text></svg>")`);

	} catch(e) { wdgt.Error(e, 'Background') }
	
	//
	function dx(c) {
		let r = '', a = c.match(Helpers.Emoji()), candle = 0;
		a && a.forEach((m) => {
			let dx = 20;	
			if (m == '🕯️') dx = candle = (candle ? 60 : 48);
			r += `<tspan dx='-0.${dx}em'>${m}</tspan>`;
		});
		return r;
	}
}

//
wdgt.Entries = function* (now, reverse = false) {
	let a = wdgt.data.log.split('∆'); 
	if (reverse) a = a.reverse();
	for (let i=0; i < a.length; i++) {
		let startedAt = parseInt(new Date(a[i].substring(0,16)).getTime()/1000);

		if (now - startedAt > 6*60*60) continue;
		yield {log: a[i].substring(11), startedAt: startedAt};
	}
};

})();


// 2.
(()=>{

	// Progress Bar
	const wdgt = new $app.Widget('🪵Progress');
	wdgt.dependency = ['🪵'];
	wdgt.repeat = { update: 1 };

	//
	wdgt.Init = ()=> {
		const now = parseInt( new Date().getTime() / 1000 ), spacer = `<div style="height:10px;"></div>`;
		let rs = '';
	
		for (const e of $app.Widgets['🪵'].Entries(now, true)) {
			if (e.log.includes($app.Widgets['🪵'].Constants.Ender)) {
				const m = new RegExp(`<div name.* data=.*?\\s${e.log.split($app.Widgets['🪵'].Constants.Ender)[1].split(' ')[0]}\\s.*?${spacer}`,`umg`);
				rs = rs.replace(m, '');
			}
			if ( !e.log.includes("[") ) continue;
			//
			let endsAt = e.startedAt, duration = 0;
			duration = e.log.substring(e.log.indexOf("[")+1, e.log.indexOf("]"));
			e.log = e.log.replace('['+duration+']', '');
			if (duration.indexOf('h')!=-1) 
				endsAt += parseInt(duration.substring(0,duration.indexOf('h')))*60*60;
			if (duration.indexOf(' ')!=-1) 
				duration = duration.substring(duration.indexOf(' ')+1);
			if (duration.indexOf('m')!=-1) 
				endsAt += parseInt(duration.substring(0,duration.indexOf('m')))*60;
			duration = endsAt - e.startedAt;
			//
			if (now >= endsAt) $(`#🪵 div[data="${e.log}"]`).show()
			else rs += `<div name="${wdgt.id}" data="${e.log}" startedAt="${e.startedAt}" duration="${duration}"><div>${e.log}</div><div></div></div>${spacer}`;
		}
		
		$(wdgt.sid).html(rs);
	};

	//
	wdgt.Update = ()=> {
		let a = $(`${wdgt.sid} div[name="${wdgt.id}"]`),
		now = parseInt( new Date().getTime() / 1000 ),
		topOffset=0;

		a.each((i, t)=> {
			var h='', m='', percent = parseInt( (now - parseInt($(t).attr('startedAt'))) *100 / parseInt($(t).attr('duration')) );
			
			if (isNaN(percent) || percent <0) {
				m = percent + '%';
				percent = 100; 
				$(t).addClass("error");
			} 
			else {
				if (percent>100) percent=100;
				m = parseInt( (parseInt($(t).attr('duration')) - now + parseInt($(t).attr('startedAt'))) / 60 );
				if (m<1) m=''
				else {
					h = parseInt(m / 60);
					if (h==0) h=''
					else if (h*60==m) m=''
					else m-=h*60;
					if (h!='') h+='h';
					if (m!='') m+='m';
				}
				$(t).removeClass("error");
			}
			if (percent==100) {
				$(t).hide();
				$(`#🪵 div[data="${$(t).attr('data')}"]`).show();
			} 
			else  {
				$(t).css('backgroundSize',`${percent}% 100%`)
					.children().last().text(h+' '+m);
				Class (t);
				$(wdgt.sid).css('top',`calc(91% - ${topOffset++ * 30}px)`);
				
				if (m=='3m' && h=='')
					Countdown.Start (400);
			} 
		});

		if (!topOffset) return $app.Constants.Status.NoRepeat;

		//
		function Class (t) {
			if ($(t).hasClass(wdgt.id)) return;
			$(t).addClass(wdgt.id);
			const c = $(t).css('background-image'), 
				v = c.slice(c.indexOf('var') + 4, c.indexOf(')')),
				c2 = c.replace(`var(${v})`, Helpers.Css(v)),
				encoded = `${c2.split(',')[0].replace(';utf8','')},${encodeURIComponent(c2.split(',')[1].replaceAll('\\','').slice(0,-2))}")`;
			$(t).css('background-image', encoded)
		}
	};

})();