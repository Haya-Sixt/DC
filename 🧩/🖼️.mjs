//import wdgt from "./🧩/🧩.Widget.mjs"
export default ()=> [

// Background Image
(async ()=> {
	const m = await import ('./🧩.mjs')
	
	
wdgt.dependency = [$app.Formats.Var('🌃'), $app.Formats.Var('🕯️🕯️'), $app.Formats.Var('📆')];

let i_carousel, gallery, counter;

//
wdgt.Init = ()=> {
	$(wdgt.sid).html('');   
	
	clearTimeout (i_carousel);
	gallery = [];
	counter = 0;
	if ($app.Vars ['🌃'] == 'true') return Carousel ();
	
	const Add = async (dir)=> (await (await fetch (`/ls ${wdgt.id}/${dir}`)).json()).forEach ((e)=> gallery.push (e)),
		R = (e, f)=> e?.reduce((s, e)=> `${s},${f (e)},`, ''), a = [], 
		c = $('#🗓️ .tdCurrent:not(.tdCurrentHeb)').text().match(Helpers.Emoji());
	if (!c) return Carousel (); 
	
	// shabbat 
	let m = $('#🗓️ .tdCurrentHeb').text().match(Helpers.Emoji()),
		parasha = [ $('#🗓️ .tdCurrentHeb .parasha').text () ]; 
	m = R (m, (e)=> (c ?? ' ').includes (e) ? '' : e);
	//if ($app.Vars ['🕯️🕯️'] == "true")
	
	
	
	m = `${m},🕯️🕯️`;
	// holiday 
	if (m?.includes (',🌱,')) parasha.push ('כי תבוא');
	if (m?.includes (',🌊,')) parasha.push ('בשלח');
	if (m?.includes (',🫓,')) { parasha.push ('וארא'); parasha.push ('בא') }
	parasha = R (parasha, (e)=> `📖/${e}`);
	
	//m = '🫓,📖/אחרי מות,🕯️🕯️'; // TEST
	
	`${m},${parasha}`.split (',').forEach ((e)=> e && a.push (Add (e)));
	Promise.all (a).then (Carousel);
}

//
wdgt.Update = ()=> { };

//
function Carousel () { 
	const c = $(wdgt.sid).parent ().attr ('id'),
		P = (v)=> $(`#${c}`).css (`--${$app.Formats.Name}-${c}-${wdgt.id}`, v ? `url("${v}")` : ''); 
	if (!gallery.length) return P (''); 
	if (gallery.length > counter) P (gallery [counter++]);
	if (gallery.length <= counter) counter = 0;
	if (gallery.length > 1) i_carousel = setTimeout (Carousel, 3 * 60 * 1000);
}


})

] // export