
//
(()=>{

// Map 
const wdgt = new $app.Widget('🗺️');

//
wdgt.Init = ()=> {
	$(wdgt.sid).html('');
};

//
wdgt.Update = ()=> {
	//T.Init ();
};

wdgt.Add = (id)=> {
	const e = {
		ls_id: `${wdgt.id}.🦺`,
		m: new T (id),
		Napot: (args)=> {
			e.m.Napot (args).catch (()=> e.Reset (args));
			sessionStorage.removeItem (e.ls_id); 
		},
		Reset: (args)=> { 
			//const t = 3, A = (m = '')=> $app.Widgets['🔔'].Alert (`${wdgt.id}.Reset${m ? `: ${m}` : ''}`);
			//try { //A (); //T.Init (); //setTimeout (()=> //(e.m = new T (id)).Set (args).catch (()=> { //A (`Failed twice. Reload in ${t}s`); //setTimeout (()=> 
			if (sessionStorage.getItem (e.ls_id)) return; sessionStorage.setItem (e.ls_id, true);
			location.reload ()//, t * 1000); // 🗒: needed '()=>'. Otherwise 'Illegal Invocation'
			//}) //, t * 1000); //} catch (er) { A (er) }
		},
	}; 
	return e; 
}

//
wdgt.napot = {
	77:{n:'חברון',lat:31.532569,lng:35.09982600000001},
	62:{n:'באר שבע',lat:31.2521018,lng:34.7867691},
	24:{n:'עכו',lat:32.933052,lng:35.082678},
	11:{n:'ירושלים',lat:31.768319,lng:35.21371},
	42:{n:'פתח תקווה',lat:32.084041,lng:34.887762},
	23:{n:'עפולה',lat:32.610493,lng:35.287922},
	29:{n:'הגולן',lat:33.01558540000001,lng:35.784354},
	22:{n:'כנרת',lat:32.723787,lng:35.565242},
	61:{n:'אשקלון',lat:31.6687885,lng:34.5742523},
	43:{n:'רמלה',lat:31.931566,lng:34.872938},
	41:{n:'השרון',lat:32.3235643,lng:34.9286096},
	32:{n:'חדרה',lat:32.4340458,lng:34.9196518},
	73:{n:'טול כרם',lat:32.3194054,lng:35.0239857},
	76:{n:'בית לחם',lat:32.734558,lng:35.191271},
	21:{n:'צפת',lat:32.964648,lng:35.495997},
	75:{n:'יריחו',lat:31.8611058,lng:35.4617583}, // Jordan
	74:{n:'ראמאללה',lat:31.9037641,lng:35.2034184},
	44:{n:'רחובות',lat:31.8943652,lng:34.8115292},
	53:{n:'חולון',lat:32.015833,lng:34.787384},
	52:{n:'רמת גן',lat:32.068424,lng:34.824785},
	72:{n:'שכם',lat:32.2226678,lng:35.2621461}, // Nablus
	25:{n:'נצרת',lat:32.699635,lng:35.303546},
	31:{n:'חיפה',lat:32.7940463,lng:34.989571},
	51:{n:'תל אביב',lat:32.0852999,lng:34.78176759999999},
	71:{n:"ג'נין",lat:32.4646353,lng:35.2938591},
};


// 🗺️
class T extends $app.UIComponent {

//
static name = "🗺️";
static israel = 0;
static lib = 0;

//
// 🗒: It's after T - 'class T {...}  T.init ()'.
static async Init () {
	(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",p="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+p);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[p]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
		key: sessionStorage.getItem(T.name), // Blue
		v: "weekly",
		region: "IL",
		language: "iw",
	});

	//
	T.lib = google.maps;
	const { Map } = await T.lib.importLibrary("maps");
	//const { Places } = await T.lib.importLibrary("places");
	
	T.israel = new T.lib.LatLng (31.94117, 35.00818);
}

//
#e = null; // 🗒: 'sid' failed with show/hide.
#map = null;
//#service = null;
#markers = [];
#minlt = null;
#maxlt = null;
#minlg = null;
#maxlg = null;
#i_zoom = null; 

//
constructor (id) {
	super (`${T.name}️_${id}`, { appendTo: '' });
	this.#e = $(document.getElementById (this.id)).addClass(T.name).hide();
	this.#Init_vars ();
	this.#Init ();
}

//
async #WaitFor (o) {
	return new Promise ((resolve)=> {
		const R = ()=> setTimeout (()=> { o ? resolve() : R() }, 1000);
		R ();
	})
}

//
async #Init () {
	await this.#WaitFor ((o)=> T.lib.Map);
	
	this.#map = new T.lib.Map (document.getElementById (this.id), {
		center: T.israel, 
		zoom: 7,
		mapTypeId: "hybrid", // terrain, hybrid, satellite
		disableDefaultUI: true, // - doesn't work
	});
	
	//await this.#WaitFor (()=> T.lib.places.PlacesService); 
	//this.#service = new T.lib.places.PlacesService(this.#map);
}

//
async Napot (a) {
	await this.#WaitFor (()=> this.#map); 
	//await this.#WaitFor (()=> this.#service);
	
	//this.#e.text().includes('אופס! משהו השתבש') && location.reload (); // d id="🗺️️_🪖" class="🗺️" » d » d class="gm-err-container 
	
	let g;
	
	// add to markers
	for (const ac of a)
		for (const e of ac.napot) 
			if (this.#Add (e.n, ac.cat, e)) g = 1;
	
	// remove from markers
	for (const i in this.#markers) {
		const m = this.#markers [i];
		if (!a.find ((e)=> e.cat == m.ic && e.napot.some ((e)=> e.n == m.n))) {
			this.#Clear(i);
			g = 1;
		}
	}
	
	// exit if no change
	if (!g) return;
	
	// 
	this.#Init_vars ();
	for (const m of this.#markers) this.#LatLng (m.l);
	
	//
	if (this.#markers.length) this.#Center ()
	else this.#Clear ();
}

//
#Add (n, ic, l) { 
	if (this.#markers.find ((e)=> e.n == n && e.ic == ic)) return;
	
	this.#e.show ();
	
	if (this.#Marker (n, ic, l)) return true;
}
	
//
#Marker (n, ic, l) {
	if (!l) return;
	
	const h = 32, image = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${h}" height="${h}"><text dx="-1" dy="26" style="font: ${h-4}px sans-serif;" >${ic}</text></svg>`;
	
	this.#markers.push({
		n: n, 
		ic: ic,
		l: l,
		m: new google.maps.Marker({
			position: l, 
			map: this.#map,
			icon: image,
			/*label: {
				text: p,
				className: "marker",
			},*/
			optimized: true,
		})
	});
	this.#LatLng (l);
	return true;
}
	
//
#LatLng (l) {
	const lt = typeof l.lat == 'number' ? l.lat : l.lat (), 
		lg = typeof l.lng == 'number' ? l.lng : l.lng ();
	if (this.#minlt > lt) this.#minlt = lt;
	if (this.#minlg > lg) this.#minlg = lg;
	if (this.#maxlt < lt) this.#maxlt = lt; 
	if (this.#maxlg < lg) this.#maxlg = lg;
}

//
#Center () {
	const maxzoom = (this.#maxlt - this.#minlt) > 1 ? 8 : 9, // 🗒: between עכו to באר שבע There's 1.68 in latitude
		padding = 3,
		ltp = (this.#maxlt - this.#minlt) / padding,
		lgp = (this.#maxlg - this.#minlg) / padding,
		bounds = {
			east: this.#maxlg - lgp,
			west: this.#minlg + lgp,
			north: this.#maxlt - ltp,
			south: this.#minlt + ltp,
		}; 
	this.#map.fitBounds(bounds); 
	// 🗒: needed (due to G maps inner cache ?)
	if (this.#i_zoom) clearInterval (this.#i_zoom);
	let steps = 5;
	this.#i_zoom = setInterval (()=> {
		if (!steps) clearInterval (this.#i_zoom);
		steps = --steps;
		if (this.#map.zoom > maxzoom) this.#map.setZoom (maxzoom);
	}, 1000)
} 

//
#Clear (i = -1) {
	if (i == -1) {
		while (!this.#Clear (++i));
		return;
	}
	this.#markers [i].m.setMap(null);
	delete this.#markers [i]; 
	if (i == this.#markers.length - 1 && !( this.#markers = this.#markers.filter ((m)=> m) ).length) {
		this.#e.hide ();
		this.#Init_vars ();
		return true; 
	}
}

//
#Init_vars () {
	this.#minlt = 100;
	this.#maxlt = 0;
	this.#minlg = 100;
	this.#maxlg = 0; 
}

} // T

//
T.Init (); 

})();


// #Add () {
	//const ls_id = `${T.name}️.${p}`,
		//ls = JSON.parse(localStorage.getItem (ls_id)),
		//Add = (n)=> {
			//if (!n?.length) return; // just to be safe
			//let r;
			//for (let i = 0; i < n.length; i++) 
				//if (this.#Marker (n[i], p, ic)) r = true;
			//return r;
		//};
	
	//
	//if (!ls) return;
	//Add (ls);
	
	//const request = { //query: p, //fields: ["geometry.location"], //language: "iw", //locationBias: T.israel, //};
	//this.#service.findPlaceFromQuery(request, (n, status) => {
		//if (status === T.lib.places.PlacesServiceStatus.OK && Add (n) )
			//localStorage.setItem(ls_id, JSON.stringify(n));
	//});
	//return true;
//}

// instead of Places:
//new T.lib.Geocoder().geocode(p).then((result) => {
//const { results } = result; map.setCenter(results[0].geometry.location); const marker = new T.lib.Marker(); marker.setPosition(results[0].geometry.location); marker.setMap(this.#map); })
//.catch((e) => { alert("Geocode was not successful for the following reason: " + e); });


//
//for (let i=0; localStorage.length >i;i++) document.getElementById ("ls").textContent += `\n{k:'${localStorage.key (i)}',v:'${localStorage.getItem(localStorage.key (i))}'},`;
/* <div id="ls">
{k:'🗺️️.רמת גן',v:'[{"geometry":{"location":{"lat":32.068424,"lng":34.824785}},"html_attributions":[]}]'},
{k:'🗺️️.רחובות',v:'[{"geometry":{"location":{"lat":31.8943652,"lng":34.8115292}},"html_attributions":[]}]'},
{k:'🗺️️.חולון',v:'[{"geometry":{"location":{"lat":32.015833,"lng":34.787384}},"html_attributions":[]}]'},
{k:'🗺️️.אשקלון',v:'[{"geometry":{"location":{"lat":31.6687885,"lng":34.5742523}},"html_attributions":[]}]'},
{k:'🗺️️.עכו',v:'[{"geometry":{"location":{"lat":32.933052,"lng":35.082678}},"html_attributions":[]}]'},
{k:'🗺️️.באר שבע',v:'[{"geometry":{"location":{"lat":31.2521018,"lng":34.7867691}},"html_attributions":[]}]'},
{k:'🗺️️.תל אביב',v:'[{"geometry":{"location":{"lat":32.0852999,"lng":34.78176759999999}},"html_attributions":[]}]'},
{k:'🗺️️.צפת',v:'[{"geometry":{"location":{"lat":32.964648,"lng":35.495997}},"html_attributions":[]}]'},
{k:'🗺️️.פתח תקווה',v:'[{"geometry":{"location":{"lat":32.084041,"lng":34.887762}},"html_attributions":[]}]'},
{k:'🗺️️.רמלה',v:'[{"geometry":{"location":{"lat":31.931566,"lng":34.872938}},"html_attributions":[]}]'},</div>  */

