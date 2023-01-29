// Import
document.querySelector('html').$app.Import();

// 1.
(()=>{

// Widget
const wdgt = new $app.Widget('🪵');
wdgt.repeat = { init: 3 };

//
wdgt.Update = ()=> {
	let result='', now = parseInt( new Date().getTime() / 1000 ),
		forecast_clock = parseInt(new Date(wdgt.json.forecast_clock).getTime()/1000),
		shishi = 0;
	
	for (const x of wdgt.Entries(now)) {
	//wdgt.Entries(now).forEach((e)=> {
		if (e.log.indexOf("[")==-1)
			result += '<div>' + e.log + '</div>';

		// Set shishi
		if ( e.log.substring(17).substring(0,4) == '🕯️ ' )
			shishi = e.startedAt;
	}//);
	
	// 🕯️🕯️
	$app.Vars['🕯️'] = shishi;
	$app.Vars['🕯️🕯️'] = wdgt.json.shabbat;
	
	// 🔋
	if (wdgt.json.battery!="100") 
		result = '<div class="errorBorder">' + '....'.substring(0,4-wdgt.json.battery.length) + wdgt.json.battery + '% ⚠️🔋</div>' + result;
			
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

	dispatchEvent(new Event('🖥️.🪵'));
}

//
wdgt.Entries = function* (now) {
	let log = wdgt.json.log.split('∆'); 
	
	for (var i=0; i<log.length; i++) {
		var startedAt = parseInt(new Date(log[i].substring(0,16)).getTime()/1000);

		if (now - startedAt > 6*60*60) continue;
		yield * {log: log[i].substring(11), startedAt: startedAt};
	}
}

})();


// 2.
(()=>{

	// Widget
	const wdgt = new $app.Widget('🪵Progress');
	wdgt.dependency = '🪵';
	wdgt.repeat = { update: 1 };

	//
	wdgt.Init = ()=> {
		let result='', resultProgress='', now = parseInt( new Date().getTime() / 1000 );
	
		$app.Widgets['🪵'].Entries(now).forEach((e)=> {
			if (e.log.indexOf("[")==-1) return;

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

			var log_id = '🪵_' + (Math.floor(Math.random() * 100000));
			resultProgress += '<div name="🪵Progress" startedAt="'+e.startedAt+'"' 
				+ ' duration="'+duration+'" 🪵_id="' + log_id + '">' 
				+ '<div>' + e.log + '</div><div></div></div><div style="height:10px;" ></div>';

			result += '<div id="' + log_id + '" style="display:none;" >' + e.log + '</div>'; 
		});
		
		$('#🪵').html(result);
		$(wdgt.sid).html(resultProgress);
	};

	//
	wdgt.Update = ()=> {
		var lp = $(`${wdgt.sid} div[name=${wdgt.sid}]`);
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
				$(this).addClass($(wdgt.id));
				$(wdgt.sid).css('top','calc(91% - '+ topOffset++ * 30 +'px)');
				
				if (m=='3m' && h=='')
					Countdown(400);
			} 
		});
	} 

})();