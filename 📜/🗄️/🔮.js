
//
(()=>{

// Ask Assistant
const wdgt = new $app.Service('🔮');

// Debug
//setTimeout (Ask, 5000)

//
wdgt.Init = op=> {
	if ($app.Vars ['🕯️🕯️'] == "true") return;
	if (op?.manual == '🤖') return Ask ();
	// init
	const R = k=> {
			k = `${wdgt.id}.${k}`;
			window ['🐵'].SetValue (k, '');
			window ['🐵'].AddValueChangeListener (k, (k, oldV, v, remote)=> {
				const qa = typeof v == 'number' ? false : (e=> { return { q: unescape (e.q), a: unescape (e.a)}}) (JSON.parse (v));
				if (!qa) window ['🐵'].Focus ()
				else $app.Widgets ['🔔'].Info (qa.q, qa.a, parseInt (qa.a.split (' ').length / 5) + 5);
			});
		};
	
	R ('🎤')
	R ('💬')
};


let ask, i_ask;
function Ask () {
	$app.Widgets ['🔔'].Info (`${wdgt.id} Loading...`, "", 20);
	// closing all  
	SetValue (wdgt.id, ""); 
	// 🦺
	clearTimeout (i_ask);
	i_ask = setTimeout (()=> ask?.close (), 2*60*1000);
	//
	ask?.close ();
	ask = window ['🐵'].OpenInTab (`https://copilot.microsoft.com/?${$app.Const ['🐵']}`, { active: false, setParent: true } );
}


})();