
//
function logInit() {
	try {

	$("#log").text("🪵 Init");

	const url = "http://localhost:8181/Documents/MacroDroid/🖥️/📑/🪵.json";
	$.get( url, function( data, s, xhr ) {
		setTimeout(logInit, 1000*60*3);  
		logUpdate(xhr.responseText);
    })
    .fail(function(jqXHR, textStatus) {
		$("#log").text("logInit.get failed. \n🪵 Rebooting (40s)...");
		$("#log").addClass("errorBorder");
		setTimeout(logInit, 1000*40);
    });
    
   } catch (e) { $("#log").text("logInit Exception: " + e); } 
}

//
function logUpdate(json) {
	try {
	
	var data = $.parseJSON(json), 
		log = data.log.split('∆'), result='', resultProgress = '',
		now = parseInt( new Date().getTime() / 1000 ),
		forecast_clock = parseInt(new Date(data.forecast_clock).getTime()/1000),
		shishi = 0; 
		
	for (var i=0; i<log.length; i++) {
		var startedAt = log[i].substring(0,16), duration = 0, 
			endsAt = startedAt = parseInt(new Date(startedAt).getTime()/1000);

		if (now-startedAt > 6*60*60) continue;

		log[i] = log[i].substring(11);
		if (log[i].indexOf("[")!=-1) {
			duration = log[i].substring(log[i].indexOf("[")+1,log[i].indexOf("]"));
			log[i] = log[i].replace('['+duration+']', '');
			if (duration.indexOf('h')!=-1) 
				endsAt += parseInt(duration.substring(0,duration.indexOf('h')))*60*60;
			if (duration.indexOf(' ')!=-1) 
				duration = duration.substring(duration.indexOf(' ')+1);
			if (duration.indexOf('m')!=-1) 
				endsAt += parseInt(duration.substring(0,duration.indexOf('m')))*60;
			duration = endsAt - startedAt;

			var log_id = 'log_' + (Math.floor(Math.random() * 100000));
			resultProgress += '<div name="logProgress" startedAt="'+startedAt+'"' 
				+ ' duration="'+duration+'" log_id="' + log_id + '">' 
				+ '<div>' + log[i] + '</div><div></div></div><div style="height:10px;" ></div>';

			result += '<div id="' + log_id + '" style="display:none;" >' + log[i] + '</div>'; 
		} 
		else {
			result += '<div>' + log[i] + '</div>';
		} 

		// Set shishi
		if ( log[i].substring(6).substring(0,4) == '🕯️ ' ) 
			shishi = startedAt;
	}
	
	// 🕯️🕯️
	$app.Vars['🕯️'] = shishi;
	$app.Vars['🕯️🕯️'] = data.shabbat;
	
	
	// 🔋
	if (data.battery!="100") 
		result = '<div class="errorBorder">' + '....'.substring(0,4-data.battery.length) + data.battery + '% ⚠️🔋</div>' + result;
			
	// 🌡️
	if (now-forecast_clock > 6*60*60) {
		var h = ((now-forecast_clock) / -60);
		if (h<24) h='>24'
		else h=h.toFixed(1);
		result = '<div class="errorBorder">' + h + 'h   ⚠️🌡️</div>' + result;
	}
		
	// ⏱️
	result = '<div>' + $('#⏱️').text() + '</div>' + result; 
	
	
	$("#log").html(result).removeClass("errorBorder");
	$("#logProgress").html(resultProgress).removeClass("errorBorder");

	if (resultProgress != '') {
		clearInterval(i_logProgress);
		i_logProgress = setInterval(logProgress, 1000*61);
		logProgress();
	}
	
	} catch (e) { $("#log").text("logUpdate Exception: " + e); } 
}


var i_logProgress = null;

function logProgress() {
	try {

	var lp = $("#logProgress div[name=logProgress]");
	var now = parseInt( new Date().getTime() / 1000 ); 
	var topOffset=0;

	lp.each(function() {
		var h='', m='', percent = parseInt( (now - parseInt($(this).attr('startedAt'))) *100 / parseInt($(this).attr('duration')) );
		
		if (isNaN(percent) || percent <0) {
			m = percent + '%';
			percent = 100; 
			$(this).addClass("errorBorder");
		} else {
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
			$('#'+$(this).attr('log_id')).show();
		} 
		else  {
			$(this).css('backgroundSize',percent+'% 100%')
				.children().last().text(h+' '+m);
			$(this).addClass('logProgress');
			$('#logProgress').css('top','calc(91% - '+ topOffset++ * 30 +'px)');
			
			if (m=='3m' && h=='')
				Countdown(400);
		} 
	});
	
	} catch (e) { $('#logProgress').text("logProgress Exception: " + e); } 
} 
