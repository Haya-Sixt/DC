
//
(()=>{

// Ask Assistant
const wdgt = new $app.Widget('🔮', { appendTo: '' });

//
wdgt.Init = e=> {
	if ($app.Vars ['🕯️🕯️'] == "true") return;
	if (e == '🤖') return Ask ();
	// init
	const R = k=> {
			window ['🙊'].SetValue (k, '');
			window ['🙊'].AddValueChangeListener (`${wdgt.id}.${k}`, (k, oldV, v, remote)=> {
				const n = typeof v == 'number';
				$app.Widgets['🔔'].Info (wdgt.id, n ? k : v, (n ? 5 : parseInt(v.split (' ').length / 5) + 5) * 1000);
			});
		};
	R ('🎤')
	R ('💬')
	$(wdgt.sid).html ('');
};

//
wdgt.Update = ()=> {}

function Ask () {
	window['🙊'].OpenInTab ("https://copilot.microsoft.com", { active: false, setParent: true } );
}



/*

//
wdgt.Add = (id = 'ifr')=> {
	const sid = `${wdgt.id}_${id}`, url = 'https://copilot.microsoft.com/'// 'https://gemini.google.com';
	
	if ($app.Vars ['🕯️🕯️'] == "true") return;
	
	//??if ( $(`#${sid} > iframe`).contents ().find ('a').length ) return;
	
	top.$ = $;
	top.$app = $app;
	top.Helpers = Helpers;
	
	IFR (sid, url);
}

//
wdgt.Remove = (id = 'ifr')=> {
	const sid = `${wdgt.id}_${id}`;
	if (wdgt.data) wdgt.data [id] = wdgt.data [`_${sid}`] = null;
	$(`#${sid}`).remove ();
}


//
async function IFR (id, url) {
	new $app.UIComponent (id, { appendTo: '' });
	const ifr = $(`#${id}`)
		.addClass(wdgt.id)
		.hide ()
		.append ('<iframe>')
		.children().first ()
		.attr ('width', '100%')
		.attr ('height', '100%')
		.attr ('frameborder', '0')
		.attr ('scrolling', 'no')
		.attr ('allowtransparency', 'true');
		
	const b = ifr.contents ()
		.find ('body')
		.addClass (wdgt.id)
		.attr ('onload', `${Load.toString ().replaceAll ('"', "'")} Load('${wdgt.id}', '${id}', '${url}')`); 
	
	b.trigger('load'); // 🗒: Iframe.apply(b[0].ownerDocument);
	//??await Helpers.WaitFor (()=> wdgt?.data?.[`_${id}`]);
	
	return b;
	
	// 🗒: "Uncaught in promise" - if (!wdgt?.data?.[id]) throw `${wdgt.id}.Map failed`;
	// 🗒: '"' not allowed! (due to function.toString) 
	// 🗒: How To Debug ? - use errors (e.g: T.israel = 0), and DevTools...
	function Load (wdgt_id, id, url) {
		//document.write ('<body></body>');
		top ['🙊'].XmlhttpRequest ({
			method: "GET",
			url: url,
			onload: xhr=> {
				document.open ();
				document.write (xhr.responseText);
				document.close ();
				top.$(`${wdgt_id}`).show ();
			},
			onerror: ()=> document.write (`${wdgt_id}.Load.XmlhttpRequest.onerror`)
		}); 
		
		// Auto Remove
		setTimeout (()=> {
			top.$app.Widgets [wdgt_id].Remove ();
		}, 10 * 3000);
	} // Load

} // IFR

*/

})();