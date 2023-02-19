// App
const $app = (function () {

const app = {
    Constants : {
        Status : { Done: 'done', NoRepeat: 'noRepeat' },
        Name: '🖥️',
        Host: location.href.match(/.*\//umg)[0],
        Mode: location.hash.replace('#','')
    },
    Vars : { 
        Dependency: (v)=> `V.${v}`,
        '🕯️': 0, 
        '🕯️🕯️': false, 
        '🌇': 0, // used by 📒 (set by 📆)
        '☔': false
    },
    Widgets: [],
    Widget: class Widget {
        constructor (id) {
            this.id = id;
            this.sid = `#${id}`;
            this.status = this.init = this.update = this.url = this.dependency = null;
            this.repeat = {init: 0, update: 0};

            $('<div>').attr('id', id).addClass('wdgt').html(`${id}...`).appendTo('body'); // 🗒: ⌚ must have this #text node.
            app.Widgets[id] = this;
        }
        get Init () {
            return ()=> { 
            try {
            const ResolveDependency = ()=> {
                if (!this.dependency || this.status == app.Constants.Status.Done) return true;
                const f = this.dependency.filter(d=> (d.startsWith(app.Vars.Dependency()) ? app.Vars[`_${d.replace(app.Vars.Dependency(), '')}`] : app.Widgets[d].status) != app.Constants.Status.Done);
                if (f.length) return false
                else return true;
            },
            Get = (url, i=0)=> {
                let u = `${app.Constants.Mode}.json`;
                if (url instanceof Array) u = url[i]
                else if (url) u = url;
                const db = u.endsWith('json') && app.Constants.Mode=='' ? '../' : '';
                $.get( `${$app.Constants.Host}${db}📑/${this.id}${u}` )
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
                this.init();
                this.repeat.init && setTimeout(this.Init, 1000*60*this.repeat.init);
                this.Update();
            }
            else Get (this.url && this.url()); // 🗒: Url is a function (and not just a var), to be evaluated after Dependencies
            } catch (e) { this.Error(e, 'Init') } }
        }
        set Init (f) {
            this.init = f;
        }
        get Update () {
            return ()=>{ try {
            $(this.sid).removeClass("error");
            let i_update
            this.repeat.update && (i_update = setTimeout(this.Update, 1000*60*this.repeat.update));
            this.update && (this.update() == app.Constants.Status.NoRepeat) && clearTimeout(i_update);
            if (this.status != app.Constants.Status.Done) {
                this.status = app.Constants.Status.Done;
                dispatchEvent(new Event(`${app.Constants.Name}.${this.id}`));
            }
            } catch (e) { this.Error(e, 'Update') } }
        }
        set Update (f) {
            this.update = f;
        }
        Reset (e='get') {
            this.Error(e, 'failed.\nResetting (40s)...');
            setTimeout(this.Init, 1000*40);
        }
        Error (e, t) {
            if (e.stack) {
                const a = e.stack.split('\n'); 
                e = a.filter((s, i)=> i < 2 || i == a.length - 1).join('\n').replaceAll(location.origin, '').replaceAll('<anonymous>', '').replaceAll('/DC/Scripts/', '');
                e = decodeURIComponent(decodeURIComponent(e));
            }
            $(this.sid).text(`${this.id} ${t}: ${e}`).addClass("error");
        }
    }
};


function Load () {
    const s = event.target.readyState;
    if (s == "interactive") Init ()
    else if (s == "complete") On ();
}

function Init () {
    Observers ();
    Resources ();
}

function Observers () {
    app.Vars = new Proxy(app.Vars, {
        get: function(target, prop) {
            return Reflect.get(target, prop);
        },
        set: function(target, prop, value) {
            target[`_${prop}`] = app.Constants.Status.Done;
            dispatchEvent(new Event(`${app.Constants.Name}.${app.Vars.Dependency(prop)}`));
            return Reflect.set(target, prop, value);
        }
    });
}

function Resources () {
    [app.Constants.Name,'⏳'].forEach((e)=> { const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = app.Constants.Host + 'Css/' + e + '.css'; document.head.appendChild(link); } ); 
    ['🎉','📅','🌡️','🪵','⏱️','📒','⚠️'].forEach((e)=> { const script = document.createElement('script'); script.type = 'text/javascript'; script.src = app.Constants.Host + 'Scripts/' + e + '.js'; document.head.appendChild(script); } ); 
}

function On () {
    for (const [k, w] of Object.entries(app.Widgets)) {
        w.dependency && w.dependency.forEach(d=> addEventListener(`${app.Constants.Name}.${d}`, w.Init));
        w.Init();
    }
}

//
document.addEventListener("readystatechange", Load);
return app;

})();

//
class Helpers {
	static Emoji (endsWith = null, exclude = '🌾') { 
        if (exclude) exclude = `(?<!${exclude})`;
        return new RegExp(`\\p{Extended_Pictographic}${exclude}.${endsWith}`,'ugm');
    }
    static Css (v) {
        return getComputedStyle($('html')[0]).getPropertyValue(decodeURIComponent(v)).trim();
    }
}