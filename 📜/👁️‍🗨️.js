
//
(()=>{


// WhatsApp 
const wdgt = new $app.Widget('👁️‍🗨️', { appendTo: '' });
wdgt.dependency = [$app.Constants.Var('🕯️🕯️'), $app.Constants.Var('📆')]; 
let i_carousel, gallery, counter;

//
wdgt.Init = ()=> {
	$(wdgt.sid).html('');
	
	clearTimeout (i_carousel);
	gallery = [];
	counter = 0;
	
	const max_days = 7, m = /(?<=IMG-)\d*(?=-WA\d.)/,
		Add = ()=> fetch (`/ls 🖼️/${wdgt.id}`).then (r=> r.json().then (r=> r.forEach (e=> (new Date () - Date.parse (e.match (m)?.toString()?.split('')?.toSpliced(6, 0, '/')?.toSpliced(4, 0, '/')?.join(''))) / (24 * 60 * 60 * 1000) < max_days && gallery.push (e)) ) );
	if ($app.Vars ['🕯️🕯️'] != "true") return;
	
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


})();