
//
(()=>{

// Ask Assistant
const wdgt = new $app.Widget('🔮', { appendTo: '' });

// Debug
//setTimeout (Ask, 5000)

//
wdgt.Init = manual=> {
	if ($app.Vars ['🕯️🕯️'] == "true") return;
	if (manual == '🤖') return Ask ();
	// init
	const R = k=> {
			window ['🙊'].SetValue (k, '');
			window ['🙊'].AddValueChangeListener (`${wdgt.id}.${k}`, (k, oldV, v, remote)=> {
				const qa = typeof v == 'number' ? false : (e=> { return { q: unescape (e.q), a: unescape (e.a)}}) (JSON.parse (v));
				if (!qa) window ['🙊'].Focus ()
				else $app.Widgets ['🔔'].Info (qa.q, qa.a, parseInt (qa.a.split (' ').length / 5) + 5);
			});
		};
	
	R ('🎤')
	R ('💬')
	$(wdgt.sid).html ('');
};

//
wdgt.Update = ()=> {}

let ask;
function Ask () {
	ask?.close ();
	$app.Widgets ['🔔'].Info (`${wdgt.id} Loading...`, "", 20);
	ask = window ['🙊'].OpenInTab ("https://copilot.microsoft.com/?🐵", { active: false, setParent: true } );
}


})();