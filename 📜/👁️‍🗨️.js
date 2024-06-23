
//
(()=>{


// WhatsApp 
const wdgt = new $app.Widget('👁️‍🗨️', { appendTo: '' });
wdgt.dependency = [$app.Constants.Var('🌃'), $app.Constants.Var('🕯️🕯️'), $app.Constants.Var('📆')]; 
let i_carousel, gallery, counter;

//
wdgt.Init = ()=> {
	$(wdgt.sid).html('');
	
	clearTimeout (i_carousel);
	gallery = [];
	counter = 0;
	if ($app.Vars ['📆'] == '🥋') Web ();
	if ($app.Vars ['🌃'] == 'true') return Carousel ();
	
	const max_days = 7, m = /(?<=IMG-)\d*(?=-WA\d.)/,
		Add = ()=> fetch (`/ls 🖼️/${wdgt.id}`).then (r=> r.json().then (r=> r.forEach (e=> (new Date () - Date.parse (e.match (m)?.toString()?.split('')?.toSpliced(6, 0, '/')?.toSpliced(4, 0, '/')?.join(''))) / (24 * 60 * 60 * 1000) < max_days && gallery.push (e)) ) );
	if ($app.Vars ['🕯️🕯️'] != "true") return Carousel ();
	
	Add ().then (Carousel);
}

//
wdgt.Update = ()=> { };

//
function Carousel () { 
	const P = (v)=> $(`${wdgt.sid}`).css (`--${$app.Constants.Name}-${wdgt.id}`, v ? `url(${v})` : '');
	if (!gallery.length) return P (''); 
	$(wdgt.sid).html('<div></div>');
	if (gallery.length > counter) P (gallery [counter++]);
	if (gallery.length <= counter) counter = 0;
	if (gallery.length > 1) i_carousel = setTimeout (Carousel, 3 * 60 * 1000);
}

//
function Web () {
	Listen (1);
	$('<iframe>')
		.hide ()
		.appendTo (wdgt.sid)
		.attr ('id', `${wdgt.id}_web`)
		.attr ('width', '100%')
		.attr ('height', '100%')
		.attr ('src', 'https://web.whatsapp.com/');
}

function New () {
	$app.Service['🤖']?.Send (`${app.Constants.Name}.${wdgt.id}.New`);
}

function Close () {
	Listen ();
	$(`${wdgt.id}_web`).remove ();
}

function Listen (on) {
	const L = ()=> {
		if (!ev.data.startsWith (wdgt.id)) return;
		ev.data.endsWith ('_new') && New ();
		ev.data.endsWith ('_close') && Close ();
	} 
	top.window.removeEventListener ('message', L);
	on && top.window.addEventListener ('message', L);
}

})();