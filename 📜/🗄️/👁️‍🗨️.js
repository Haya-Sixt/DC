
//
false && (()=>{


// WhatsApp (DISABLED)
const wdgt = new $app.Widget('👁️‍🗨️', {
	dependency: { var: ['🌃', '🕯️🕯️', '📆'] },
});
let i_carousel, gallery, counter;

//
wdgt.Update = ()=> {
	clearTimeout (i_carousel);
	gallery = [];
	counter = 0;
	if ($app.Vars ['📆'] == '🥋') Web ();
	if ($app.Vars ['🌃'] == 'true') return Carousel ();
	
	const max_days = 7, m = /(?<=IMG-)\d*(?=-WA\d.)/,
		Add = ()=> fetch (`/ls 🖼️/${wdgt.id}`).then (r=> r.json().then (r=> r.forEach (e=> (new Date () - Date.parse (e.match (m)?.toString()?.split('')?.toSpliced(6, 0, '/')?.toSpliced(4, 0, '/')?.join(''))) / (24 * 60 * 60 * 1000) < max_days && gallery.push (e)) ) );
	if ($app.Vars ['🕯️🕯️'] != "true") return Carousel ();
	
	Add ().then (Carousel); 
};

//
function Carousel () { 
	const P = (v)=> $(`${wdgt.sid}`).css (`--${$app.Const.Name}-${wdgt.id}`, v ? `url(${v})` : '');
	if (!gallery.length) return P (''); 
	$(wdgt.sid).html('<div></div>');
	if (gallery.length > counter) P (gallery [counter++]);
	if (gallery.length <= counter) counter = 0;
	if (gallery.length > 1) i_carousel = setTimeout (Carousel, 3 * 60 * 1000);
}

//
let web, i_web;
function Web () {
	with (window ['🐵']) {
		// prevent "Download again". (previous code used - Notif (`...Web`) )
		if (GetValue (wdgt.id) == new Date().getDate ()) return;
		// closing all 
		SetValue (wdgt.id, ""); 
		// 🦺
		clearTimeout (i_web);
		i_web = setTimeout (()=> web?.close (), 20*60*1000);
		//
		web?.close ();
		web = OpenInTab (`https://web.whatsapp.com/?${$app.Const ['🐵']}`, { active: false, setParent: true })
	}
}

})();