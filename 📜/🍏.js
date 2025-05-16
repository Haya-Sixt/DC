// App
const $app = (function () {

const app = {
    Const : {
    	Event: (id, id2 = '')=> `${app.Const.Name}.${id}${id2 ? '.' : ''}${id2}`, 
	    Var: (v = '')=> `V.${v}`,
        Status : { Done: 'done', NoRepeat: 'noRepeat' },
        Name: '🖥️', ['🐵']: '🐵', Libs: { '📜': '📜/' }, 
        Host: location.href.match(/.*\//umg)[0],
        ['🌃']: { Dim: 'Dim', Hide: 'Hide', None: 'None' },
    },
    Vars : { 
    	Mode: location.hash.replace('#',''),
        '🕯️': 0, '🕯️🕯️': 'false', '🌃': 'false',
        '📆': '',
    },
    Widgets: [],
    UIComponent: class T {
    	constructor (id, options = {}) {
            this.id = id;
            this.sid = `#${id}`;
            
            $(this.sid).remove (); // e.g. 🗺️
            //const e = 
            $('<div>').attr('id', id).text(id)
            	.appendTo (options.appendTo ?? `#${app.Const.Name}`);
            
            //if (options.appendTo) {
            //	const id = options.appendTo, ids = id.startsWith('.') ? id : `#${id}`;
            //	if (!(this.appendTo = $(ids))) this.appendTo = $('<div>').attr('id', id);
            //}
            //if (!this.appendTo) this.appendTo = $(`#${app.Const.Name}`);
            //e.appendTo (this.appendTo);
            
            const p = '🌃', c = `${p}${ options[p] ?? app.Const[p].Hide }`; 
            this[`_${p}`] = typeof options?.[p] == 'undefined' ? app.Const[p].Hide : options[p];
            addEventListener (app.Const.Event (app.Const.Var(p)), this [p]);
            this[p] ();
        }
        //
        get ['🌃'] () {
        	return ()=> {
        	const p = '🌃', c = `${p}${this [`_${p}`]}`;
        	if (app.Vars[p] == "true") $(this.sid).addClass (c)
        	else $(this.sid).removeClass (c);
        	}
        }
        set ['🌃'] (v) {
            this ['_🌃'] = v;
        } 
    },
};

//
app.Widget = class T extends app.UIComponent {
	constructor (id, options = {}) {
	    if (!options.appendTo) options.appendTo = `#${app.Const.Name}w`;
	    super (id, options);
	    app.Widgets[id] = this;
	    
	    this.status = this.init = this.update = null;
	    this.threads = {};
	    
	    this.http = options.http;
	    this['🖌️'] = options['🖌️'];
	    
	    const IU = (o, iu)=> {
	    	if (!o) return { init:null, update:null }; 
	    	if (o instanceof Array || typeof o != 'object') return (iu ? { init:o, update:null } : { init:null, update:o });
	    	return o;
    	};
	    this.repeat = IU (options.repeat, this.http);
	    this.dependency = IU (options.dependency);
	    this.dependency.var = IU (options.dependency?.var);
	
	    $(this.sid).addClass('wdgt');
	}
	//
	get Init () {
	    return async (op = {})=> {
    	// 🗒️ op {manual} aren't in used (🤖->👁️‍🗨️).
	    try {
    	if (this.threads.Init) return setTimeout (()=> this.Init, 1000, Object.assign (op, {repeat:{init: 1}}));
    	this.threads.Init = 1;
	    const Get = async w=> {    	
	    	const U = u=> {
		    		if (!u) u = `${app.Vars.Mode}.json`;
			        if (!u.startsWith('http')) {
			        	const db = u.endsWith('json') && app.Vars.Mode=='' ? '../' : '';
			        	u = `${$app.Const.Host}${db}📑/${w.id}${u}`;
		        	}
		        	return u; 
	        	};
	    	try {
	    		let au = (w.http !== true && w.http()); // 🗒: Url is a function (and not just a var), to be evaluated after Dependencies
	            if (au instanceof Array) w.data = []
	            else {
	            	au = [au];
	            	w.data = null; // for repeated init
            	}
//console.log (`🍏.${w.id}.get`, 'au', au)
                for (let i = 0; i < au.length; i++) {
                	const u = U (au[i]);
console.log (`🍏.${w.id}`, 'await fetch - before', u)
                	let d = await fetch (u);
console.log (`🍏.${w.id}`, 'await fetch - after', d)
                	if (u.endsWith('json')) {
						d = await d.json()
//console.log (`🍏.${w.id}.get`, 'await d.json', d)
                	}
					else {
						d = await (await d.blob()).text();
//console.log (`🍏.${w.id}.get`, 'await d.blob', d.slice (0,80))
                	}

/*
try {
console.log (`🍏.${w.id}.get testing a retry`)
let d2 = await fetch (u);
if (u.endsWith('json')) {
						d2 = await d2.json()
console.log (`🍏.${w.id}.get`, 'await d.json', d2)
                	}
					else {
						d2 = await (await d2.blob()).text();
console.log (`🍏.${w.id}.get`, 'await d.blob', d2.slice (0,80))
                	}
}
catch (e) { !e?.message.includes(`Unexpected token '<', "<tbody><tr`) && console.error (`🍏.${w.id}.get testing a retry failed`, e) }


try {
console.log (`🍏.${w.id}.get testing a reverse retry`)
let d3 = await fetch (u);
if (!u.endsWith('json')) {
						d3 = await d3.json()
console.log (`🍏.${w.id}.get`, 'await d.json', d3)
                	}
					else {
						d3 = await (await d3.blob()).text();
console.log (`🍏.${w.id}.get`, 'await d.blob', d3.slice (0,80)) 
                	}
}
catch (e) { !e?.message.includes(`Unexpected token '<', "<tbody><tr`) && console.error (`🍏.${w.id}.get testing a reverse retry failed`, e) }
*/


					if (w.data instanceof Array) w.data.push(d)
                	else w.data = d;
                };
            } catch (e) { w.Reset(e) }
	    };
	    //
	    if (!this.#ResolveDependency ('init')) return (this.threads.Init = 0);
	    $(this.sid).removeClass("error").text ('');
	    this.status = null; // to be able to dispatch again 
	    this.http && (await Get (this));
	    this.init && (await this.init(op));
	    this.repeat.init && !op.repeat?.init && setTimeout(this.Init, 1000*60*this.repeat.init, op);
	    this.threads.Init = 0;
	    this.Update(op);
	    } catch (e) { this.Error(e, 'Init', 1) } }
	}
	set Init (f) {
	    this.init = f;
	}
	//
	get Update () { 
	    return async (op = {})=>{
    	if (this.threads.Update) return setTimeout (()=> this.Update, 1000, Object.assign (op, {repeat:{update: 1}}));
    	this.threads.Update = 1;
    	try {
	    if (this.threads.Init || (!this.#ResolveDependency ('init') || !this.#ResolveDependency ('update'))) return (this.threads.Update = 0);
	    $(this.sid).removeClass("error");
	    let i_update
	    this.repeat.update && !op.repeat?.update (i_update = setTimeout(this.Update, 1000*60*this.repeat.update, op));
	    this.update && (await this.update(op) == app.Const.Status.NoRepeat) && clearTimeout(i_update);
	    if (this.status != app.Const.Status.Done) {
	        this.status = app.Const.Status.Done;
	        dispatchEvent(new Event( app.Const.Event (this.id) ));
	    }
	    this.threads.Update = 0;
	    } catch (e) { this.Error(e, 'Update', 1) } }
	}
	set Update (f) {
	    this.update = f;
	}
	//
	Reset (e='get') {
	    this.Error(e, 'failed.\nResetting (40s)...');
	    setTimeout(this.Init, 1000*40);
	    app.Service['🤖']?.Send (`${this.id}.Reset`);
	}
	Error (e, t, release) {
		if (release) this.threads[t] = 0;
		console.error (this.id, t, e);
		try { if (e.stack) e = decodeURIComponent (e.stack.replace('\n','').match (new RegExp (`.*:[0-9]{1,4}:[0-9]{1,4}\\)`, 'gum'))[0].replace (`/${app.Const.Libs ['📜']}`, '').replace (location.href.split('/').slice(0,-1).join('/'), '')) }
		catch { 
	        const a = e.stack.split('\n'); 
	        e = a.filter((s, i)=> i < 1 || i == a.length - 1).join('\n').replaceAll(location.origin, '').replaceAll('<anonymous>', '').replaceAll(`/DC/${app.Const.Libs ['📜']}`, '');
	        e = decodeURIComponent(decodeURIComponent(e));
	        if (e.includes(' at XMLHttpRequest')) e = e.slice(0, e.indexOf(' at XMLHttpRequest'));
	    }
	    app.Widgets['🔔'].Alert(`${this.id} ${t}: ${e}`);
	    $(this.sid).text(`${this.id} ${t}: ${e}`).addClass("error");
	}
	#ResolveDependency (iu) {
        if (this.status == app.Const.Status.Done
        	|| (!this.dependency[iu]?.filter (d=> app.Widgets[d].status != app.Const.Status.Done)?.length
        		&& !this.dependency.var[iu]?.filter (d=> !d.startsWith ('?') && app.Vars[`_${d}`] != app.Const.Status.Done)?.length) ) {
    		return true;
        }
    }
} // Widget


//
app.Service = class T extends app.Widget {
	constructor (id, options = {}) {
		const p = '🌃';
		if (!options[p]) options[p] = app.Const[p].None;
		if (!options.appendTo) options.appendTo = `#${app.Const.Name}s`;
		super (id, options);
	    //
	    if (!this.repeat.update) this.repeat.update = 1;
	}
}



//
function Init () {
    App ();
    Observers ();
    Resources ();
    
	//
	function App () {
	    const a = $("<div>").attr("id", app.Const.Name), 
	    	w = $("<div>").attr("id", `${app.Const.Name}w`)
	    	s = $("<div>").attr("id", `${app.Const.Name}s`);
	    a.appendTo('body')
	    	.append(w).append(s);
	}
	
	//
	function Observers () {
	    app.Vars = new Proxy(app.Vars, {
	        get: function(target, prop) {
	            return Reflect.get(target, prop);
	        },
	        set: function(target, prop, value) {
	        	const eq = target [prop] === value,
	        		r = Reflect.set (target, prop, value);
	        	if (r && (!eq || target[`_${prop}`] != app.Const.Status.Done)) {
		            target[`_${prop}`] = app.Const.Status.Done;
		            dispatchEvent (new Event( app.Const.Event (app.Const.Var(prop)) ));
	            }
	            return r;
	        }
	    });
	}
	
	//
	async function Resources () {
	    [app.Const.Name,'⏳'].forEach(e=> { const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = `🖌️/${e}.css`; document.head.appendChild(link); } ); 
	    const a = [];
	    (await (await fetch (`/ls DC/${app.Const.Libs ['📜']}`)).json()).forEach ((e)=> { e = e.slice (e.indexOf ('/DC/') + 4); if (document.head.querySelector (`script[src$="${e}"]`) ) return; const script = document.createElement('script'); a.push (new Promise ((resolve)=> { script.onload = ()=> resolve(1) })); script.type = 'text/javascript'; script.src = e; document.head.appendChild(script); } ); 
		Promise.all (a).then (Ready);
	}
	
	//
	async function Ready  () {
		await Helpers.WaitFor (()=> window ['🐵'].Ready);
		const L = (w, iu, cb, v)=> w.dependency[iu]?.forEach (d=> addEventListener (app.Const.Event (v ? app.Const.Var (d.startsWith ('?') ? d.slice (1) : d) : d), cb)) || (!v && L (w, iu, cb, true));
	    for (const [k, w] of Object.entries(app.Widgets)) {
	        L (w, 'init', e=> w.Init (e));
	        L (w, 'update', e=> w.Update (e));
	        w.Init();
	    }
	}
} // Init

//
Init ();

return app;
})();


//
class Helpers {

    //
	static Emoji (exclude = '(🌾)') { 
        const e0 = `\\p{Extended_Pictographic}${exclude ? `(?<!${exclude})` : ''}`, e1 = decodeURIComponent('%EF%B8%8F'), e2 = decodeURIComponent('%E2%80%8D');
        return new RegExp(`\[🇦-🇿]{2}|${e0}${e1}${e2}${e0}${e1}|${e0}${e2}${e0}${e1}${e2}${e0}|${e0}${e2}${e0}${e1}|${e0}`,'ugm'); // 🗒: *. Tested on '👁️‍🗨️👨‍❤️‍👨🏴‍☠️🗣️'.  *. dot isn't needed (although the emoji looks partial ).  *. 'A-Z' is for countries (They are two values in the range of U+1F1E6 (Regional Indicator Symbol Letter A) and U+1F1FF (Regional Indicator Symbol Letter Z))
    }

    // If No 'e', Than It's A Get Var.
    // Otherwise, The Default Match Is To Replace <Text>. 
    // If No 'to' Is Supply, Than It Replace Var.
    static Css (prop, e, to) {
        const delimiter = '{{,}}', Decode = ()=> { try { a[1] = decodeURIComponent(a[1]) } catch {} }; // i.e: 'svg+xml,%253Csvg'. 
        
        //
        if (!e) return Get ();

        //
        let a = $(e).css(prop);
        //if (!a.startsWith ('url')) a = `url('data:image/svg+xml;utf8,${a}`;
        a = a.replace (',', delimiter).split(delimiter);
        if (a.length < 2) return; // bg-image is 'none' in Portrait

	    Decode ();
        Decode ();

        let c = `${a[0]},${a[1]}`.replace(';utf8','').replaceAll('\\','')
            .replaceAll ('%3E', '>').replaceAll ('%3C', '<') // Needed. The Decode Is Partial.
			.replaceAll ("'", '"').replaceAll ('%22','"').replace ('url("','').replace ('svg>")','svg>');
            // 🗒: replacing '#' with '%23' ( i.e: 'url(#' ) should be done in the css (hard coded). Otherwise it returns back to '#' (Also tried after the encoding)

		Text ();
    	Var ();
    
        a = c.replace (',', delimiter).split(delimiter);
        a[1] = encodeURIComponent(a[1]);

        c = `url('${a[0]},${a[1]}')`;
        
        $(e).css(prop, c);


        //
        function Get (p = prop) {
            return getComputedStyle($('html')[0]).getPropertyValue(decodeURIComponent(p)).trim();
        }

        //
        function Text () {
            if (typeof to == 'undefined') return;
            a = c.split('</text>');
            for (let i = 0; i < a.length - 1; i++) {
            	if (a[i].includes('<tspan')) a[i] = a[i].slice(0, a[i].indexOf('<tspan')); 
            	a[i] = a[i].slice(0, a[i].lastIndexOf('>') + 1); 
        	}
            c = a.join(`${to.replaceAll ("'", '"')}</text>`);
        }

        //
        function Var () {
        	const x = c.indexOf('var('),
        		x2 = x + c.slice(x).indexOf(')');
            if (x == -1) return;
            const v = Get (c.slice(x + 4, x2));
        	c = `${c.slice(0, x)}${v}${c.slice(x2 + 1)}`;
            Var ();
        }
    }
    
	//
	static async WaitFor (o, steps = 15) {
		if (typeof o == 'number') {
			steps = o;
			o = ()=> false;
		}
		return new Promise ((resolve)=> {
			const Resolve = ()=> {
					let ok;
					if (!steps) ok = 1;
					try { ok || (ok = o ()) } catch { }
					if (ok) resolve ()
					else Repeat (--steps);
				}, 
				Repeat = (steps)=> setTimeout (Resolve, 1000);
			Resolve ();
		})
	}  
}