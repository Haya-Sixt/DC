// App
const $app = (function () {

const app = {
    Const : {
    	Event: (id, id2)=> `${app.Const.Name}.${id}${id2 ? `.${id2}` : ''}`, 
	    Var: (v = '')=> `V.${v}`,
        Status : { Done: 'done', NoRepeat: 'noRepeat' },
        Name: '🖥️', Col: { get W() { return `${app.Const.Name}w` } , get S() { return `${app.Const.Name}s` } }, 
        ['🐵']: '🐵', Libs: { '📜': '📜/' }, 
        Host: location.href.match(/.*\//umg)[0],
        ['🌃']: { Dim: 'Dim', Hide: 'Hide', None: 'None' },
    },
    Vars : { 
    	Mode: location.hash.replace('#',''),
        '🕯️': 0, '🕯️🕯️': 'false', '🌃': 'false',
        '📆': '', '🕸️⌚': 0,
    },
    Widgets: [],
    UIComponent: class T {
    	constructor (id, options = {}) {
            this.id = id;
            this.sid = `#${id}`;
            
            $(this.sid).remove (); // e.g. 🗺️
            
            $('<div>').attr('id', id)
            	.text(this instanceof app.Widget || this instanceof app.Service ? id : '') // 🗺️
            	.appendTo (options.appendTo ?? `#${app.Const.Name}`);
            	
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
	    if (!options.appendTo) options.appendTo = `#${app.Const.Col.W}`;
	    super (id, options);
	    app.Widgets[id] = this;
	    this.status = this.init = this.update = null;
	    // 💥 when triggered by 'repeat' and 'dispatch' 
	    this.threads = {};
	    this.http = options.http;
	    this['🖌️'] = options['🖌️'];
	    this._options = options;
	    $(this.sid).addClass('wdgt').addClass(options.addClass);
	}
	Remove () {
		delete app.Widgets[this.id];
		$(this.sid).remove ();
	}
	#ResolveDependency (iu) {
        if (!this.dependency[iu]?.filter (d=> app.Widgets[d].status?.update != app.Const.Status.Done)?.length) {
			return true
		}
    } 
	_Init () {
		const IU = (o, http)=> {
		    	if (!o) return { init:null, update:null }; 
		    	if (o instanceof Array || typeof o != 'object') return ( ((typeof http == 'function') || this.init) ? { init:o, update:null } : { init:null, update:o });
		    	return o;
	    	},
	    	L = (iu, cb, v)=> (v ? this.dependency.var : this.dependency)[iu]?.forEach (d=> addEventListener (app.Const.Event (v ? app.Const.Var (d) : d), cb)) || (!v && L (iu, cb, true));
    	// 1. To dispatch again.  2. Block dependee  
    	this.status = IU ();
    	if (this.repeat) return;
    	// 'repeat.update' won't trigger its dependees
    	// 	i.e. 📆 won't trigger 🪵
    	this.repeat = IU (this._options.repeat, this.http && (()=>{}));
    	// default is 'update', unless there's 'http'.
    	// 	'init' is weaker. It's mainly to allow the app a faster first readiness.
    	// Dependee will be triggered, regardless of its own 'init'/'update'
    	// 	i.e. 🛞's dependency: { init: ['🪵'] }
    	this.dependency = IU (this._options.dependency, this.http);
	    // doesn't block. Only triggers
	    this.dependency.var = IU (this._options.dependency?.var, this.http);
	    L ('init', e=> this.Init (e));
	    L ('update', e=> this.Update (e));
    }
	//
	get Init () {
		this._Init ();
	    //
    	return async (op = {})=> { // 🗒️ op {manual} aren't in used (🤖->👁️‍🗨️).
	    try {
    	clearTimeout (this.i_Reset);
    	if (this.threads.Init) {
    		clearTimeout (this.threads.i_Init);
    		return (this.threads.i_Init = setTimeout (()=> this.Init, 1000, Object.assign (op, {repeat:{init: 1}})));
    	}
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
                for (let i = 0; i < au.length; i++) {
                	const u = U (au[i]);
                	let d = await fetch (u);
                	if (u.endsWith('json')) {
						d = await d.json()
                	}
					else {
						d = await (await d.blob()).text();
                	}
					if (w.data instanceof Array) w.data.push(d)
                	else w.data = d;
                };
            } catch (e) { w.Reset(e) }
	    };
	    //
	    if (!this.#ResolveDependency ('init')) return (this.threads.Init = 0); // 🗒️: no need for 'setTimeout..', bcs the dependency will trigger this
	    if ($(this.sid).removeClass("error").text () == this.id) $(this.sid).text ('');
	    this.http && (await Get (this));
	    this.init && (await this.init(op));
	    this.repeat.init && !op.repeat?.init && setTimeout(this.Init, 1000*60*this.repeat.init, op);
	    this.status.init = app.Const.Status.Done;
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
    	if (this.threads.Update) {
    		clearTimeout (this.threads.i_Update);
    		return (this.threads.i_Update = setTimeout (()=> this.Update, 1000, Object.assign (op, {repeat:{update: 1}})));
    	}
    	this.threads.Update = 1;
    	try {
	    // Why using status, instead of thread? Bcs: 🪵 dispatch 🕯️. Than 📒 fail (bcs _Init is before locking threads)
	    if (this.status?.init != app.Const.Status.Done 
	    		// why to check even when just repeating update (without init)? - bcs the dependee uses the dependency's data, which might be 🚧
	    		// 	i.e. 🛞 & 🪵
	    		|| !this.#ResolveDependency ('init') || !this.#ResolveDependency ('update')) {
			return (this.threads.Update = 0); // 🗒️: no need for 'setTimeout..', bcs the dependency will trigger this
	    }
	    $(this.sid).removeClass("error");
	    let i_update
	    this.repeat.update && !op.repeat?.update && (i_update = setTimeout(this.Update, 1000*60*this.repeat.update, op));
	    this.update && (await this.update(op) == app.Const.Status.NoRepeat) && clearTimeout(i_update);
		// dispatch
		if (this.status.update != app.Const.Status.Done) {
	        this.status.update = app.Const.Status.Done;
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
    	this.i_Reset = setTimeout (this.Init, 1000*40);
	    if (`${e}`.includes ('Failed to fetch')) {
	    	if (Date.now() - app.Vars ['🕸️⌚'] > 10000) {
			    app.Vars ['🕸️⌚'] = Date.now ();
			    app.Service['🤖']?.Send (`🕸️`)
		    }
		    e = ''
	    }
	    this.Error(e, 'Retrying (40s)')
	}
	Error (e, t, release) {
		if (release) this.threads[t] = 0;
		console.error (this.id, t, e);
		try { if (e.stack) e = decodeURIComponent (e.stack.replace('\n','').match (new RegExp (`.*:[0-9]{1,4}:[0-9]{1,4}\\)`, 'gum'))[0].replace (`/${app.Const.Libs ['📜']}`, '').replace (location.href.split('/').slice(0,-1).join('/'), '')) }
		catch { try {
			const a = e.stack.split('\n'); 
	        e = a.filter((s, i)=> i < 1 || i == a.length - 1).join('\n').replaceAll(location.origin, '').replaceAll('<anonymous>', '').replaceAll(`/DC/${app.Const.Libs ['📜']}`, '');
	        e = decodeURIComponent(decodeURIComponent(e));
	        if (e.includes(' at XMLHttpRequest')) e = e.slice(0, e.indexOf(' at XMLHttpRequest'));
	    } finally {} }
	    if (e) t = `${t}:\n${e}`;
	    app.Widgets['🔔'].Alert(`${this.id}❗ ${t}`);
	    $(this.sid).text(`${this.id}❗ ${t}`).addClass("error");
	}
} // Widget


//
app.Service = class T extends app.Widget {
	constructor (id, options = {}) {
		const p = '🌃';
		if (!options[p]) options[p] = app.Const[p].None;
		if (!options.appendTo) options.appendTo = `#${app.Const.Name}s`;
		super (id, options);
	}
	_Init () {
		super._Init ();
		if (!this.repeat.init && !this.repeat.update) this.repeat.update = 1; 
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
	    	w = $("<div>").attr("id", app.Const.Col.W)
	    	s = $("<div>").attr("id", app.Const.Col.S);
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
		for (const [k, w] of Object.entries(app.Widgets)) w.Init ();
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
        const delimiter = '{{,}}', Decode = ()=> { try { if (!a[1].includes ('%"') && !a[1].includes (' ')) a[1] = decodeURIComponent(a[1]) } catch {} }; // i.e: decode into 'svg+xml,%253Csvg'. 
        
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
            return ($('html').css(decodeURIComponent(p))??"").trim();
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