// App
const $app = (function () {

const app = {
	Name: null,
	['📑']: location.hash.replace('#',''),
	Consts: {
		Libs: { Css: '🖌️' },
		Status : { Done: 'done', NoRepeat: 'noRepeat' },
    	['🌃']: { Dim: 'Dim', Hide: 'Hide', None: 'None' },
	},
    Vars : { 
        '🕯️': 0, '🕯️🕯️': 'false', '🌃': 'false',
        '📆': '',
    },
	Formats: {
		Event: (id, id2 = '')=> `${app.Name}.${id}${id2 ? '.' : ''}${id2}`, 
    	Var: (v = '')=> `V.${v}`,
	},
    Widgets: [],
    UIComponent: class T {
    	constructor (id, options = {}) {
            this.id = id;
            this.sid = `#${id}`;
            
            $(this.sid).remove (); // e.g. 🗺️
            $('<div>').attr('id', id).appendTo (`#${app.Name}${ typeof options?.appendTo == 'undefined' ? 'c1' : options.appendTo }`);
            
            const p = '🌃', c = `${p}${ typeof options?.[p] == 'undefined' ? app.Consts[p].Hide : options[p] }`; 
            this[`_${p}`] = typeof options?.[p] == 'undefined' ? app.Consts[p].Hide : options[p];
            addEventListener (app.Formats.Event (app.Formats.Var(p)), this [p]);
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
	    super (id, options);
	    app.Widgets[id] = this;
	    
	    this.status = this.init = this.update = this.url = this.dependency = null;
	    this.repeat = {init: 0, update: 0};
	
	    $(this.sid).addClass('wdgt');
	}
	//
	get Init () {
	    return async ()=> { 
	    try {
	    const ResolveDependency = ()=> {
	        if (!this.dependency || this.status == app.Consts.Status.Done) return true;
	        const f = this.dependency.filter(d=> (d.startsWith(app.Formats.Var()) ? app.Vars[`_${d.replace(app.Formats.Var(), '')}`] : app.Widgets[d].status) != app.Consts.Status.Done);
	        if (f.length) return false
	        else return true;
	    },
	    Get = (url, i=0)=> {
	        let u = `${app['📑']}.json`;
	        if (url instanceof Array) u = url[i]
	        else if (url) u = url;
	        if (!u.startsWith('http')) {
	        	const db = u.endsWith('json') && app['📑']=='' ? '../' : '';
	        	u = `${$app.Consts.Host}${db}📑/${this.id}${u}`;
	    	}
	        $.get( u )
	        .done((d)=> { 
	            try {
	            if (url instanceof Array) {
	                if (!i) this.data = [];
	                this.data.push(d);
	                if (i < url.length - 1) return Get (url, i+1);
	            }
	            else this.data = d;
	            this.repeat.init && setTimeout(this.Init, 1000*60*this.repeat.init);
	            this.Update();
	            } catch (e) { this.Reset(e) }
	        })
	        .fail(()=> this.Reset());
	    };
	    //
	    $(this.sid).removeClass("error");
	    if (!ResolveDependency ()) return;
	    this.status = null; // to be able to dispatch again 
	    if (this.init) {
	        await this.init();
	        this.repeat.init && setTimeout(this.Init, 1000*60*this.repeat.init);
	        this.Update();
	    }
	    else Get (this.url && this.url()); // 🗒: Url is a function (and not just a var), to be evaluated after Dependencies
	    } catch (e) { this.Error(e, 'Init') } }
	}
	set Init (f) {
	    this.init = f;
	}
	//
	get Update () {
	    return async ()=>{ try {
	    $(this.sid).removeClass("error");
	    let i_update
	    this.repeat.update && (i_update = setTimeout(this.Update, 1000*60*this.repeat.update));
	    this.update && (await this.update() == app.Consts.Status.NoRepeat) && clearTimeout(i_update);
	    if (this.status != app.Consts.Status.Done) {
	        this.status = app.Consts.Status.Done;
	        dispatchEvent(new Event( app.Formats.Event (this.id) ));
	    }
	    } catch (e) { this.Error(e, 'Update') } }
	}
	set Update (f) {
	    this.update = f;
	}
	//
	Reset (e='get') {
	    this.Error(e, 'failed.\nResetting (40s)...');
	    setTimeout(this.Init, 1000*40);
	    app.Service['🤖']?.Send (`${app.Name}.${this.id}.Reset`);
	}
	Error (e, t) {
		console.log (this.id, t, e);
		try { if (e.stack) e = decodeURIComponent (e.stack.replace('\n','').match (new RegExp (`.*:[0-9]{1,4}:[0-9]{1,4}\\)`, 'gum'))[0].replace (`/${app.Consts.Libs ['📜']}`, '').replace (location.href.split('/').slice(0,-1).join('/'), '')) }
		catch { 
	        const a = e.stack.split('\n'); 
	        e = a.filter((s, i)=> i < 1 || i == a.length - 1).join('\n').replaceAll(location.origin, '').replaceAll('<anonymous>', '').replaceAll(`/DC/${app.Consts.Libs ['📜']}`, '');
	        e = decodeURIComponent(decodeURIComponent(e));
	        if (e.includes(' at XMLHttpRequest')) e = e.slice(0, e.indexOf(' at XMLHttpRequest'));
	    }
	    app.Widgets['🔔'].Alert(`${this.id} ${t}: ${e}`);
	    $(this.sid).text(`${this.id} ${t}: ${e}`).addClass("error");
	}
} // Widget


//
app.Service = class T extends app.Widget {
	constructor (id, options = {}) {
		const p = '🌃';
		if (typeof options?.[p] == 'undefined') options[p] = app.Consts[p].None;
	    super (id, options);
	}
}


//
function Init () {
	Consts ();
    App ();
    Observers ();
    Resources ();
    
    function Consts () {
    	const P = (i, trailer = '/')=> `${decodeURIComponent (p [i])}${trailer}`, p = new URL (document.querySelector ('script[type="module"]').src).pathname.slice (1, -4).split ('/');
    	app.Consts.Libs.Repo = P (0); 
    	app.Consts.Libs.Widget = P (1); 
    	app.Name = P (2, '');  
    }
    
	//
	function App () {
	    const a = $("<div>").attr("id", app.Name),
	    	c1 = $("<div>").attr("id", `${app.Name}c1`);
	    a.appendTo('body');
	    c1.appendTo(a);
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
	        	if (r && (!eq || target[`_${prop}`] != app.Consts.Status.Done)) {
		            target[`_${prop}`] = app.Consts.Status.Done;
		            dispatchEvent (new Event( app.Formats.Event (app.Formats.Var(prop)) ));
	            }
	            return r;
	        }
	    });
	}
	
	//
	async function Resources () {
		const V = (r)=>  r.endsWith (`.mjs`) && !document.head.querySelector (`script[src$="${r}"]`) && !r.endsWith (`/${app.Name}.mjs`) && !r.endsWith (`/🧩.mjs`), 
			//S = r=> { if (V (r)) return; const e = document.createElement('script'); e.type = 'text/javascript'; e.src = r; document.head.appendChild (e); return new Promise (resolve=> e.addEventListener ('load', resolve)) },
			L = r=> { const e = document.createElement('link'); e.rel = 'stylesheet'; e.type = 'text/css'; e.href = r; document.head.appendChild (e) },
			W = r=> V (r) /*&& (window.$app = app) && (window.$wdgt = new app.Widget (r.split ('/').at (-1).split ('.') [0]) )*/ && import (r)
				.then (e => {
					//window.$app = app
					e.default ().forEach (w=> {
					window.$app = app;
					window.wdgt = new app.Widget (r.split ('/').at (-1).split ('.') [0]); 
					//w.wdgt = wdgt
					w () 
					//w.call ({wdgt: wdgt }) 
					//eval (`(${w}) ()`);
					//w.call (w)
					//w.call ((()=>{}))
					});
				}),
			R = async (r, f)=> {
				const a = [];
				(await (await fetch (`/ls ${app.Consts.Libs.Repo}/${r}`)).json()).forEach (r=> {
					r = r.replace (`/${app.Consts.Libs.Repo}/`, '');  
					a.push (f (r))
				});
				await Promise.all (a); // 🗒: for import(), it's redandent 
			};
			
		R (app.Consts.Libs.Css, L)
		.then ( ()=> R (app.Consts.Libs.Widget, W) )
		.then (Complete); 
		
	    //[app.Name,'⏳'].forEach((e)=> { const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = `🖌️/${e}.css`; document.head.appendChild(link); } ); 
	    //const a = [];
	    //(await (await fetch (`/ls ${app.Consts.Libs.Repo}/${app.Consts.Libs.Widget}`)).json()).forEach (e=> { e = e.replace (`/${app.Consts.Libs.Repo}/`, ''); if (document.head.querySelector (`script[src$="${e}"]`) ) return; const script = document.createElement('script'); a.push (new Promise ((resolve)=> { script.onload = ()=> resolve(1) })); script.type = 'text/javascript'; script.src = e; document.head.appendChild(script); } ); 
		//Promise.all (a).then (Complete);
	}
	
	//
	function Complete  () {
	    for (const [k, w] of Object.entries(app.Widgets)) {
	        w.dependency && w.dependency.forEach(d=> addEventListener(app.Formats.Event (d), w.Init));
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