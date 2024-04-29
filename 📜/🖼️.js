// 
(()=>{

// Background 
const wdgt = new $app.Widget('🖼️');
wdgt.dependency = [$app.Constants.Var('🌃'), $app.Constants.Var('🕯️🕯️'), $app.Constants.Var('📆')]; 
let i_carousel, gallery, counter;

//
wdgt.Init = ()=> {
	$(wdgt.sid).html('');   
	
	clearTimeout (i_carousel);
	gallery = [];
	counter = 0;
	if ($app.Vars ['🌃'] == 'true') return Carousel ();
	
	const Add = async (dir)=> (await (await fetch (`/ls ${wdgt.id}/${dir}`)).json()).forEach ((e)=> gallery.push (e)),
		a = [], c = $('#🗓️ .tdCurrent:not(.tdCurrentHeb)').text().match(Helpers.Emoji());
	if (!c) return Carousel (); 
	
	let m = $('#🗓️ .tdCurrentHeb').text().match(Helpers.Emoji());
	m && (m = m.reduce((s, e)=> (s == '' ? '' : `${s},`) + ((c ?? ' ').includes(e) ? '' : e), ''));
	
	//m = '🫓,🕯️🕯️'; // TEST
	
	if ($app.Vars ['🕯️🕯️'] == "true") m = `${m ? `${m},` : ``}🕯️🕯️`;
	
	m && m.split (',').forEach ((e)=> a.push (Add (e)));
	Promise.all (a).then (Carousel);
}

//
wdgt.Update = ()=> { };

//
function Carousel () { 
	const c = $(wdgt.sid).parent ().attr ('id'),
		P = (v)=> $(`#${c}`).css (`--${$app.Constants.Name}-${c}-${wdgt.id}`, v ? `url(${v})` : ''); 
	if (!gallery.length) return P (''); 
	if (gallery.length > counter) P (gallery [counter++]);
	if (gallery.length <= counter) counter = 0;
	if (gallery.length > 1) i_carousel = setTimeout (Carousel, 3 * 60 * 1000);
}


})();