// Import
document.querySelector('html').$app.Import();

// 1.
(()=>{

// Log
const wdgt = new $app.Widget('🪵');
wdgt.repeat = { init: 3 };
wdgt.dependency = ['🗓️','⏱️'];

//
wdgt.Update = ()=> {
	let result='', now = parseInt( new Date().getTime() / 1000 ),
		forecast_clock = parseInt(new Date(wdgt.data.forecast_clock).getTime()/1000),
		shishi = 0;
	
	for (const e of wdgt.Entries(now)) { // 🗒: yield doesn't work with forEach because it's callback
		if (e.log.indexOf("[")==-1)
			result += '<div>' + e.log + '</div>';

		// Set shishi
		if ( e.log.substring(17).substring(0,4) == '🕯️ ' )
			shishi = e.startedAt;
	};
	
	// 🕯️🕯️
	$app.Vars['🕯️'] = shishi;
	$app.Vars['🕯️🕯️'] = wdgt.data.shabbat;
	
	// 🔋
	if (wdgt.data.battery!="100") 
		result = '<div class="errorBorder">' + '....'.substring(0,4-wdgt.data.battery.length) + wdgt.data.battery + '% ⚠️🔋</div>' + result;
			
	// 🌡️
	if (now - forecast_clock > 6*60*60) {
		var h = ((now - forecast_clock) / -60);
		if (h<24) h='>24'
		else h=h.toFixed(1);
		result = '<div class="errorBorder">' + h + 'h   ⚠️🌡️</div>' + result;
	}
		
	// ⏱️
	result = '<div>' + $('#⏱️').text() + '</div>' + result; 
	
	$(wdgt.sid).html(result);

	Background ();
};

//
function Background() {
	try {		
	var bg = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' version=\'1.1\'><text x=\'3%\' y=\'90%\' font-size=\'4em\'>', 
		match = $("#🗓️ .tdCurrent").text().match(Schedule.c_match()),
		c = '';
	if ( $app.Vars['🕯️🕯️'] == "true" )  c += '🕯️🕯️';
	if ( match )  c += match.join('');
	if ( $app.Vars['☔'] )  c += '☔️';
	if ( c == '')  c += '🌴';
	
	$(wdgt.sid).css('backgroundImage', bg + dx(c) + '</text></svg>")');

	} catch(e) { wdgt.Error(e, 'Background') }
	
	//
	function dx() {
		let r = '';
		c.match(Schedule.c_match()).forEach((m) => {
			r += '<tspan dx=\'-0.' + (m == '🕯️' ? 45 : 20) + 'em\'>' + m + '</tspan>';
		});
		return r;
	}
}

//
wdgt.Entries = function* (now) {
	let log = wdgt.data.log.split('∆'); 
	
	for (var i=0; i<log.length; i++) {
		var startedAt = parseInt(new Date(log[i].substring(0,16)).getTime()/1000);

		if (now - startedAt > 6*60*60) continue;
		yield {log: log[i].substring(11), startedAt: startedAt};
	}
};

})();


// 2.
(()=>{

	// Progress Bar
	const wdgt = new $app.Widget('🪵Progress');
	wdgt.dependency = ['🪵'];
	wdgt.repeat = { init: 3, update: 1 };

	//
	wdgt.Init = ()=> {
		let result=$('#🪵').html(), resultProgress='', now = parseInt( new Date().getTime() / 1000 );
	
		for (const e of $app.Widgets['🪵'].Entries(now)) {
			if (e.log.indexOf("[")==-1) continue;

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

			var log_id = `🪵_${(Math.floor(Math.random() * 100000))}`;
			resultProgress += `<div name="🪵Progress" startedAt="${e.startedAt}" duration="${duration}" 🪵_id="${log_id}">
				<div>${e.log}</div><div></div></div><div style="height:10px;" ></div>`;

			result += `<div id="${log_id}" ${(now < endsAt) && 'style="display:none;"'} >${e.log}</div>`; 
		};
		
		if (resultProgress != '') $('#🪵').html(result);
		$(wdgt.sid).html(resultProgress);
	};

	//
	wdgt.Update = ()=> {
		var lp = $(`${wdgt.sid} div[name="${wdgt.id}"]`);
		var now = parseInt( new Date().getTime() / 1000 ); 
		var topOffset=0;

		lp.each(function() {
			var h='', m='', percent = parseInt( (now - parseInt($(this).attr('startedAt'))) *100 / parseInt($(this).attr('duration')) );
			
			if (isNaN(percent) || percent <0) {
				m = percent + '%';
				percent = 100; 
				$(this).addClass("errorBorder");
			} 
			else {
				if (percent>100) percent=100;
				m = parseInt( (parseInt($(this).attr('duration')) - now + parseInt($(this).attr('startedAt'))) / 60 );
				if (m<1) m=''
				else {
					h = parseInt(m / 60);
					if (h==0) h=''
					else if (h*60==m) m=''
					else m-=h*60;
					if (h!='') h+='h';
					if (m!='') m+='m';
				}
				
				$(this).removeClass("errorBorder");
			}
			if (percent==100) {
				$(this).hide();
				$('#'+$(this).attr('🪵_id')).show();
			} 
			else  {
				$(this).css('backgroundSize',percent+'% 100%')
					.children().last().text(h+' '+m);
				$(this).addClass(wdgt.id);
				$(wdgt.sid).css('top','calc(91% - '+ topOffset++ * 30 +'px)');
				
				if (m=='3m' && h=='')
					Countdown(400);
			} 
		});
	};

})();