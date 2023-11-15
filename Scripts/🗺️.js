
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
	return new T (id);
}


// 🗺️ base
class B {

static name = "🗺️";
static israel = 0;
static lib = 0;

//
static async Init () {
	(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",p="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+p);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[p]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
		key: localStorage.getItem(B.name), // Blue
		v: "weekly",
		region: "IL",
		language: "iw",
	});

	//
	B.lib = google.maps;
	const { Map } = await B.lib.importLibrary("maps");
	const { Places } = await B.lib.importLibrary("places");
	
	B.israel = new B.lib.LatLng (31.94117, 35.00818);
}

} // B

B.Init ();

// 🗺️
class T extends B {
	
#id = "";
#e = null; // 🗒: 'sid' failed with show/hide.
#map = null;
#service = null;
#markers = [];

//
#minlt = null;
#maxlt = null;
#minlg = null;
#maxlg = null;
#i_zoom = null; 

//
constructor (id) {
	super ();
	this.#id = `${B.name}️.${id}`;
	this.#Init_vars ();
	this.#Init ();
}

async #WaitFor (o) {
	await new Promise(resolve => {
		const R = ()=> setTimeout(()=> { o ? resolve() : R() }, 1000);
		R ();
	});
}
  
async #Init () {
	this.#e = $("<div>").attr("id", this.#id).addClass(B.name).hide().appendTo(`#${$app.Constants.Name}`);
	
	/**/
	await this.#WaitFor ((o)=> B.lib.Map);
	if (!B?.lib?.Map) return setTimeout ((t)=> t.#Init(), 1000, this); // 🗒: '()=>' needed
	/**/
	
	this.#map = new B.lib.Map(document.getElementById (this.#id), {
		center: B.israel, 
		zoom: 7,
		mapTypeId: "hybrid", // terrain, hybrid, satellite
		disableDefaultUI: true, // - doesn't work
	});
	
	/**/
	await this.#WaitFor (()=> B.lib.places.PlacesService); 
	const PS = (t, B)=> {
		if (B.lib.places.PlacesService) return t.#service = new B.lib.places.PlacesService(t.#map);
		setTimeout ((t, B)=> PS, 1000, this, B); 
		return false;
	};
	PS (this, B);
	/**/
}

//
async Set (p, ic) {
	/**/
	await this.#WaitFor (()=> this.#map); 
	await this.#WaitFor (()=> this.#service); 
	if (!this.#map || !this.#service) return setTimeout ((t, p, ic)=> t.Set(p, ic), 1000, this, p, ic); // 🗒: '()=>' needed
	/**/
	
	if (typeof p == 'object') {
		let g;
		
		// add to markers
		for (const e of p) 
			if (this.#Add (e.p, e.ic)) g = 1;
		
		// remove from markers
		for (const i in this.#markers) {
			const m = this.#markers [i];
			if (!p.find ((e)=> e.p == m.p && e.ic == m.ic) {
				this.#Clear(i);
				g = 1;
			}
		}
		
		// exit if no change
		if (!g) return;
		
		// 
		this.#Init_vars ();
		for (const m of this.#markers) this.#LatLng (m.r);
	}
	else this.#Add (p, ic);
	
	//
	
	if (this.#markers.length) this.#Center ()
	else this.#Clear ();
}

//
#Add (p, ic) {
	if (this.#markers.find((e)=> e.p == p && e.ic == ic)) return;
	
	this.#e.show ();
	
	const ls_id = `${B.name}️.${p}`,
		ls = JSON.parse(localStorage.getItem (ls_id)),
		Add = (n)=> {
			if (!n?.length) return; // just to be safe
			let r;
			for (let i = 0; i < n.length; i++) 
				if (this.#Marker (n[i], p, ic)) r = true;
			return r;
		};
	
	//
	if (ls) {
		Add (ls);
		return true;
	}
	//
	const request = {
		query: p,
		fields: ["geometry.location"],
		language: "iw",
		locationBias: B.israel,
	};
	this.#service.findPlaceFromQuery(request, (n, status) => {
		if (status === B.lib.places.PlacesServiceStatus.OK && Add (n) )
			localStorage.setItem(ls_id, JSON.stringify(n));
	});
	return true;
}

//  instead of Places:
/*
	new B.lib.Geocoder()
	.geocode(p)
	.then((result) => {
		const { results } = result;
		map.setCenter(results[0].geometry.location);
		const marker = new B.lib.Marker();
		marker.setPosition(results[0].geometry.location);
		marker.setMap(this.#map);
	})
	.catch((e) => {
		alert("Geocode was not successful for the following reason: " + e);
	}); 
	//this.#map.setCenter(r.geometry.location);
	//marker.setPosition(results[0].geometry.location);
*/

//
#Marker (r, p, ic) {
	if (!r?.geometry?.location) return;
	
	const h = 32, image = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${h}" height="${h}"><text dx="-1" dy="26" style="font: ${h-4}px sans-serif;" >${ic}</text></svg>`;
	
	this.#markers.push({
		r: r,
		p: p, 
		ic: ic,
		m: new google.maps.Marker({
			position: r.geometry.location, 
			map: this.#map,
			icon: image,
			/*label: {
				text: p,
				className: "marker",
			},*/
			optimized: true,
		})
	});
	this.#LatLng (r);
	return true;
}
	
//
#LatLng (r) {
	const lt = typeof r.geometry.location.lat == 'number' ? r.geometry.location.lat : r.geometry.location.lat (), 
		lg = typeof r.geometry.location.lng == 'number' ? r.geometry.location.lng : r.geometry.location.lng ();
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

})();
