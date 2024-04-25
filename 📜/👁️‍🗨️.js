
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
	
	const Add = ()=> fetch (`/ls 🖼️/${wdgt.id}`).then (r=> r.json().then (r=> r.forEach (e=> gallery.push (e)) ) );
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