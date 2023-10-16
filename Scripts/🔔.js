//
(()=>{

// Countdown 
const wdgt = new $app.Widget('🔔');

//
wdgt.Init = ()=> {
	$(wdgt.sid).html('');
};

//
wdgt.Info = (...args)=> T.Info (...args); 

//
wdgt.Alert = (...args)=> T.Alert (...args); 

// 🔔
class T {

static #sid = '#🔔';

//
static Info (e, ...args) {
	T.#Box (1, 60, e, ...args);
}

//
static Alert (e, ...args) {
	T.#Box (0, 30, e, ...args);
}

//
static #Box (mode, duration, e, ...args) {
	const name = (mode ? 'info' : 'alert'), now = parseInt( new Date().getTime() / 1000 );
	//
	if (typeof e != 'object') e = { 'title': e, 'text': args.length ? args[0] : '', 'startedAt': args.length > 1 ? args[1] : now, 'duration': args.length > 2 ? args[2] : duration}; 
	//
	if (e.title && e.text) e.title += `<br>`;
	let tt = (e.title+e.text).replaceAll('"',"'");
	if (!mode) tt = `⚠️ ${tt}`;
	
	// prevent duplicates
	if ($(`${T.#sid}[tt="${tt}"]`).length) return;
	
	const r = `<div name="${name}" startedat="${e.startedAt}" duration="${e.duration}" tt="${tt}">${tt}`,
		p = `<div style="background-image: linear-gradient(to right, rgba(250, 20, 80, 0.6) 0%, rgba(100, 100, 241, 0.6) 0% );"></div></div>`;

	$(T.#sid).html(`${$(T.#sid).html()}${r}${p}`);
	T.#Progress ();
}

//
static #Progress () {
	const now = parseInt( new Date().getTime() / 1000 ), del = [];
	let notes = $(T.#sid + " > div[name]");
	
	notes.each((i, t)=> {
		var percent = parseInt( (now - parseInt($(t).attr('startedat'))) * 100 / parseInt($(t).attr('duration')) ), 
			noteP = $(t).children(':last-child');
		
		if (isNaN(percent) || percent < 0) {
			percent = 100; 
			$(t).addClass("error");
		} else {
			if (percent > 100) percent = 100;
			$(t).removeClass("error");
		}

		if (percent == 100) del.push(t);
		
		var bi = noteP.css('background-image');
		var cut = bi.substring( bi.indexOf(')')+1, bi.indexOf('%')+1 );
		bi = bi.replace(cut, percent+'%');
		noteP.css('background-image', bi);
	});
	
	$(del).each((i, t)=> { t.remove () });

	(notes.length - del.length) > 0 && setTimeout(()=> T.#Progress(), 1000*61);
} 

} // T

})();


/*
// ⚠️
class Alert {

static Add (html, t) {
	const p = $("<div>")
		.attr("name","popup")
		.attr("class","popup")
		//.attr("style","")
		.html(html)
		.appendTo("body")
		.css({
			//'position' : 'absolute',
			//'left' : '50%',
			//'top' : '50%',
			'margin-left' : function() {return -$(this).outerWidth()/2},
			'margin-top' : function() {
				var height=10;
				$(".popup").each((i, t)=> {
					height += $(t).outerHeight() + 10;
				});
				return -height; 
			}
		});
	t && setTimeout(()=>p.remove(), t*1000);
}

} // ⚠️
*/
/*
.popup { 
font-size: larger; direction: ltr; 
min-height: var(--🖥️-c-px-63); min-width: var(--🖥️-c-px-126); display: inline-flex; justify-content: center; align-content: center; flex-wrap: wrap; }
.popup { left: 50%; top: 70%; } 
*/
/*
static Dimention() {
	Add(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
		+':  🌡️ '+ parseInt($("#🌡️").height())
		+'X'+ parseInt($("#🌡️").width())
		+',  🌡️(canvas) '+ parseInt($("canvas.canvasjs-chart-canvas").height())
		+'X'+ parseInt($("canvas.canvasjs-chart-canvas").width())
		+',  🗓️ '+ parseInt($("#🗓️ table").height())
		+'X'+ parseInt($("#🗓️ table").width())
		//+', body: '+ parseInt($("body").width())
		//+', doc: '+ parseInt($(document).width())
	);
} 

function popupInit() {
	//setTimeout (popup_dimention, 1000*10);
	//setTimeout (popup_dimention, 1000*60*4);

	//popupAdd("1 ניסיון");
	//popupAdd("2 ניסיון");
	//popupAdd("3 ניסיון");
	//popupAdd("4 ניסיון 4 ניסיון 4 ניסיון 4 ניסיון");
		
	//popupUpdate();
	//setInterval(popupUpdate, 1000*60);
}

function popupUpdate() {
	popupRemove( 1 );
} 

function popupRemove(o) {
	var height=10;
	$(".popup").each(function(index) {
//$(Countdown).text(index + '' + o) ;
		if (index == o) 
			$(Countdown).remove()
		else {
			height += $(Countdown).innerHeight() + 10;
			$(Countdown).css({ 'margin-top' : function() {return -height;} });
		} 
	});
} 



//---------------

(()=>{

// C2: Command and Control
function Init(steps) {

	setInterval(function () {
		var forcast = $("canvas.canvasjs-chart-canvas");
		if ("157,190".indexOf(parseInt(forcast.height())) == -1
		 || "360,332".indexOf(parseInt(forcast.width())) == -1) {
			$app.Widgets['🌡️'].Reset ('⚠️');
			//Popup.Dimention();
			}

		var calendar = $("#🗓️ table");
		if ("629,438".indexOf(parseInt(calendar.width())) == -1) {
			$app.Widgets['🗓️'].Reset ('⚠️');
			//Popup.Dimention();
			}

	//
	// MD waits 5m before taking the screenshot, 
	// so here the iteration is 6m at least, 
	// for allowing the screen rotation to correctly render.
	//
	}, 1000*60*2); 
	
	//body.onclick = popup_dimention; // doesn't work 
}

window.addEventListener("load", Init);

});

*/
