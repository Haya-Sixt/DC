// 1.
(()=>{

// Log
const wdgt = new $app.Widget('🪵');
wdgt.dependency = ['📆','⏱️'];
wdgt.repeat = { init: 3 };

wdgt.Constants = { Ender: '➖'};

//
wdgt.Update = ()=> {
	let rs ='', now = parseInt( Date.now() / 1000 ),
		shishi = 0, w;
	
	for (const e of wdgt.Entries(now)) { // 🗒: yield doesn't work with forEach because it's callback
		if ( e.log.includes(wdgt.Constants.Ender) ) continue;

		rs += `<div data="${e.log}" ${ e.log.indexOf("[") == -1 && 'style="display:none;"' }>${e.log}</div>`;

		// Set shishi
		if ( e.log.substring(6).substring(0,4) == '🕯️ ' )
			shishi = e.startedAt;
	};

	w = '⏱️';
	rs = `${rs}<div>${$(`#${w}`).text()}</div>`;
	$(wdgt.sid).html(rs);
	
	
	w = '🕯️'; // 🗒: '🌋' App Must Have Delay Before 🔔. Otherwise '🏡' Won't Be Triggered (Because '🌋' Is Open).
	// TODO: convert in 🤖 to numeric. (🗒 there's already wdgt.data.shishi) 
	if (wdgt.data.shishi.toLowerCase() == "true" && !shishi) {
		shishi = new Date($app.Widgets['📆'].data['🌇'] * 1000);
		shishi = parseInt (shishi.setHours(shishi.getHours()-5) / 1000);
	}
	$app.Vars [w] = shishi; 
	$app.Vars [`${w}${w}`] = wdgt.data.shabbat.toLowerCase();

	w = '🔋';
	if (wdgt.data.battery != "100") $app.Widgets['🚥'].Add (wdgt.id, w, wdgt.data.battery)
	else $app.Widgets['🚥'].Remove (wdgt.id, w);

	w = '💈';
	wdgt.data [w] = wdgt.data.forecast.t; 
	$app.Widgets[w].Init ();
	Clock (now, w, wdgt.data.forecast.tc, 2);
	
	w = '🌡';
	Clock (now, w, wdgt.data.forecast.fc);
	
	w = '🌃';
	$app.Vars [w] = wdgt.data.night.toLowerCase();
	
	//
	Background ();
};

function Clock (now, w, c, hours = 7) {
	let h = (now - c) / (60 * 60);
	if (h > hours) {
		if (h > 24) h = '24'
		else h = h.toFixed(1);
		$app.Widgets['🚥'].Add (wdgt.id, w, `${h}`);
	}
	else $app.Widgets['🚥'].Remove (wdgt.id, w);
}

//
function Background() {
	let c = '', cs;
	if ( $app.Vars ['🕯️🕯️'] == "true" ) c += '🕯️🕯️'
	else if ( $app.Vars ['🕯️'] ) c += '🕯️';
	if ( c == '') c = '🌴'
	else c = dx(c);
	
	Helpers.Css ('background-image', wdgt.sid, c);

	//
	function dx(c) {
		let r = '', a = c.match(Helpers.Emoji()), candle = 0;
		a && a.forEach((m) => {
			let dx = 20;	
			if (m == '🕯️'.match(Helpers.Emoji())) dx = candle = (candle ? 40 : 30); // 'match' because length 2≠3
			r += `<tspan dx="-0.${dx}em">${m}</tspan>`;
		});
		return r;
	}
}

//
wdgt.Entries = function* (now, reverse = false) {
	let a = wdgt.data.log.split('¿'); 
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
			const m = new RegExp(`<div [^>]*?data=.*?\\s${e.log.split($app.Widgets['🪵'].Constants.Ender)[1].split(' ')[0]}\\s.*?${spacer}`,`mu`);
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
		else rs += `<div data="${e.log}" name="${wdgt.id}" startedat="${e.startedAt}" duration="${duration}"><div>${e.log}</div><div></div></div>${spacer}`;
	}
	
	$(wdgt.sid).html(rs);
};

//
wdgt.Update = ()=> {
	let a = $(`${wdgt.sid} div[name="${wdgt.id}"]`),
	now = parseInt( new Date().getTime() / 1000 ),
	topOffset=0;

	a.each((i, t)=> {
		var h='', m='', percent = parseInt( (now - parseInt($(t).attr('startedat'))) *100 / parseInt($(t).attr('duration')) );
		
		if (isNaN(percent) || percent <0) {
			m = percent + '%';
			percent = 100; 
			$(t).addClass("error");
		} 
		else {
			if (percent>100) percent=100;
			m = parseInt( (parseInt($(t).attr('duration')) - now + parseInt($(t).attr('startedat'))) / 60 );
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
				$app.Widgets['⏳'].Start (400);
		} 
	});

	if (!topOffset) return $app.Constants.Status.NoRepeat;

	//
	function Class (t) {
		if ($(t).hasClass(wdgt.id)) return;
		$(t).addClass(wdgt.id);
		Helpers.Css('background-image', t); // sets the var
	}
};

})();
