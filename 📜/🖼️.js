// 
(()=>{

// Background 
const wdgt = new $app.Widget('🖼️');
wdgt.dependency = [$app.Constants.Var('🕯️🕯️'), $app.Constants.Var('📆')]; 
let i_carousel, gallery, counter;

//
wdgt.Init = ()=> {
	$(wdgt.sid).html('');
	
	clearTimeout (i_carousel);
	gallery = [];
	counter = 0;
	
	const Add = async (dir)=> (await (await fetch (`/ls DC/${wdgt.id}/${dir}`)).json()).forEach ((e)=> gallery.push (e)),
		a = [], c = $('#🗓️ .tdCurrent:not(tdCurrentHeb)').text().match(Helpers.Emoji());
	if (!c) return; 
	let m = $('#🗓️ .tdCurrentHeb').text().match(Helpers.Emoji());
	m && (m = m.reduce((s, e)=> (s == '' ? '' : `${s},`) + ((c ?? ' ').includes(e) ? '' : e), ''));
	if ($app.Vars ['🕯️🕯️'] == "true") m = `${m ? `${m},`: ``}🕯️🕯️`;
	
	m && m.split (',').forEach ((e)=> a.push (Add (e)));
	Promise.all (a).then (Carousel);
}

//
wdgt.Update = ()=> { };

//
function Carousel () { 
	const P = (v)=> $('#🖥️c1')[0].style.setProperty ('--🖥️-c1-🖼️', v ? `url(${v})` : ''); 
	if (!gallery.length) return P (''); 
	if (gallery.length > counter) P (gallery [counter++]);
	if (gallery.length <= counter) counter = 0;
	if (gallery.length > 1) i_carousel = setTimeout (Carousel, 3 * 60 * 1000);
}


})();