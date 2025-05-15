//
(()=>{

// Popup
const wdgt = new $app.Service('🔔');

//
wdgt.Info = (...args)=> T.Info (...args); 

//
wdgt.Alert = (...args)=> T.Alert (...args); 

//
wdgt.Clear = (...args)=> T.Clear (...args); 

// 🔔
class T {

static #sid = '#🔔';

//
static Info (e, ...args) {
	T.#Box (1, 60, e, ...args);
}

//
// TODO: 🪖 font-size:small 
static Alert (e, ...args) {
	T.#Box (0, 30, e, ...args);
	console.log (T.#sid, e, ...args);
}

//
static #Box (mode, duration, e, ...args) {
	const name = (mode ? 'info' : 'alert'), now = parseInt(Date.now () / 1000);
	//
	if (typeof e != 'object') e = { title: e };
	if (!e.text) e.text = (args.length > 1 || (args.length == 1 && typeof args[0] != 'number')) ? args[0] : '';
	if (!e.startedAt) e.startedAt = args.length > 2 ? args[1] : now;
	if (!e.duration) e.duration = args.length > 2 ? args[2] : ( (e.startedAt == now && typeof args[args.length - 1] == 'number') ? args[args.length - 1] : duration);
	if (!e.group) e.group = args.length > 3 ? args[3] : ''; 
	//
	if (e.title && e.text) e.title += `<br>`;
	if (!mode) e.title = `⚠️ ${e.title}`; 
	let tt = (e.title+e.text).replaceAll('"',"'");
	
	// prevent duplicates
	if ($(`${T.#sid} > div[tt="${tt}"]`).length) return;
	
	const r = `<div name="${name}" startedat="${e.startedAt}" duration="${e.duration}" group="${e.group}" tt="${tt}">${tt}`,
		p = `<div style="background-image: linear-gradient(to right, rgba(250, 20, 80, 0.6) 0%, rgba(100, 100, 241, 0.6) 0% );"></div></div>`;

	$(T.#sid).html(`${$(T.#sid).html()}${r}${p}`);
	T.#Progress (); 
}

//
static #Progress () {
	const now = parseInt( new Date().getTime() / 1000 ), del = [];
	let notes = $(`${T.#sid} > div[name]`);
	
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

	(notes.length - del.length) > 0 && setTimeout(()=> T.#Progress(), 1000 * 5);
} 

//
static Clear (group) {
	$(`${T.#sid} > div[group="${group}"]`).each((i, t)=> { t.remove () });
}

} // T

})();
