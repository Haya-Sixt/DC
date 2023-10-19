
//
(()=>{

// Map 
const wdgt = new $app.Widget('🗺️');

//
wdgt.Init = ()=> {
	$(wdgt.sid).html('');
};

wdgt.Add = (id)=> {
	return new T (id);
}

// 🗺️
class T {

#name = "🗺️";
#id = "";
#sid = "";
#map = 0;
#service = 0;
#israel = 0;
#lib = 0;
#markers = [];
#minlt = 1000;
#maxlt = 0;
#minlg = 1000;
#maxlg = 0;

constructor (id) {
	this.#id = `${this.#name}️.${id}`;
	this.#sid = `#${this.#id}`;
	this.#Init ();
}

async #Init () {
	//
	(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
		key: localStorage.getItem(this.#name), // Blue
		v: "weekly",
		region: "IL",
		language: "iw",
	});

	//
	this.#lib = google.maps;
	const { Map } = await this.#lib.importLibrary("maps");
	const { Places } = await this.#lib.importLibrary("places");
	
	this.#israel = new this.#lib.LatLng (31.94117, 35.00818);  
	
	$("<div>").attr("id", this.#id).addClass(this.#name).hide().appendTo(`#${$app.Constants.Name}`);
	
	this.#map = new this.#lib.Map(document.getElementById (this.#id), {
		center: this.#israel, 
		zoom: 7,
		mapTypeId: "hybrid", // terrain, hybrid, satellite
		disableDefaultUI: true, // - doesn't work
	});
	this.#service = new this.#lib.places.PlacesService(this.#map);
}

//
async Add (q, ic) {
	if (!this.#map) return setTimeout ((t, q, ic)=> t.Add(q, ic), 1000, this, q, ic); // 🗒: '()=>' needed
	
	$(this.#sid).show ();
	
	const ls_id = `${this.#name}️.${q}`,
		ls = JSON.parse(localStorage.getItem (ls_id)),
		Add = (n)=> {
			let r;
			if (!n?.length) return; // just to be safe 
			for (let i = 0; i < n.length; i++) 
				if (this.#Marker (n[i], q, ic)) r = true;
			return r;
		};
	
	//
	if (ls) Add (ls);
	else {
		const request = {
			query: q,
			fields: ["geometry.location"],
			language: "iw",
			locationBias: this.#israel,
		};
		this.#service.findPlaceFromQuery(request, (n, status) => {
			if (status === this.#lib.places.PlacesServiceStatus.OK && Add (n) )
				localStorage.setItem(ls_id, JSON.stringify(n));
		});
	}

//  instead of Places:
/*
	new this.#lib.Geocoder()
	.geocode(q)
	.then((result) => {
		const { results } = result;
		map.setCenter(results[0].geometry.location);
		const marker = new this.#lib.Marker();
		marker.setPosition(results[0].geometry.location);
		marker.setMap(this.#map);
	})
	.catch((e) => {
		alert("Geocode was not successful for the following reason: " + e);
	}); 
	//this.#map.setCenter(r.geometry.location);
	//marker.setPosition(results[0].geometry.location);
*/
}

//
#Marker (r, q, ic) {
	if (!r?.geometry?.location) return;
	
	const h = 32, image = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${h}" height="${h}"><text dx="-1" dy="26" style="font: ${h-4}px sans-serif;" >${ic}</text></svg>`;
	
	this.#markers.push(new google.maps.Marker({
		position: r.geometry.location, 
		map: this.#map,
		icon: image,
		label: {
			text: q,
			className: "marker",
		},
		optimized: true,
	}));
	this.#Center (r); 
	return true;
}
	
//
#Center (r) {
	const lt = typeof r.geometry.location.lat == 'number' ? r.geometry.location.lat : r.geometry.location.lat (), 
		lg = typeof r.geometry.location.lng == 'number' ? r.geometry.location.lng : r.geometry.location.lng ();
	if (this.#minlt > lt) this.#minlt = lt;
	if (this.#minlg > lg) this.#minlg = lg;
	if (this.#maxlt < lt) this.#maxlt = lt; 
	if (this.#maxlg < lg) this.#maxlg = lg;
	//
	const minzoom = 9, padding = 3,
		ltp = (this.#maxlt - this.#minlt) / padding,
		lgp = (this.#maxlg - this.#minlg) / padding,
		bounds = {
			east: this.#maxlg - lgp,
			west: this.#minlg + lgp,
			north: this.#maxlt - ltp,
			south: this.#minlt + ltp,
		};
	this.#map.fitBounds(bounds); 
	if (this.#map.zoom > minzoom) this.#map.setZoom(minzoom);
} 

//
Clear () {
	while (this.#markers.length) 
		this.#markers.pop().setMap(null);
	(!this.#markers.length) && $(this.#sid).hide ();
}

} // T

})();
