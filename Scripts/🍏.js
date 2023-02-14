// App
(function () {

    const app = document.querySelector('html').$app = {
        Constants : {
            Status : { Done: 'done' },
            Name: '🖥️',
            Host: location.href.match(/.*\//umg)[0],
            Mode: location.hash.replace('#','')
        },
        Vars : { 
            '🕯️': 0, 
            '🕯️🕯️': false, 
            '🌇': 0, // used by 📒 (set by 📆)
            '☔': false
        },
        Import () {
            window.$app = document.querySelector('html').$app; // needed
        },
        Widgets: [],
        Widget: class Widget {
            constructor (id) {
                this.id = id;
                this.sid = `#${id}`;
                this.init = this.update = this.url = this.dependency = null;
                this.repeat = {init: 0, update: 0};
                this.status = '';

                $('<div>').attr('id', id).html(`${id}...`).appendTo('body');
                app.Widgets[id] = this;
            }
            get Init () {
                return ()=> { 
                try {
                const ResolveDependency = ()=> {
                    if (!this.dependency || 
                        this.status == app.Constants.Status.Done) // 🗒: potential 🐛 - add multiple listeners when this.init fails 
                        return true;
                    this.dependency.forEach(d=> removeEventListener(`${app.Constants.Name}.${d}`, this.Init));
                    const f = this.dependency.filter(d=> app.Widgets[d].status != app.Constants.Status.Done);
                    if (f.length) {
                        f.forEach(d=> addEventListener(`${app.Constants.Name}.${d}`, this.Init, {once: true}));
                        return false;
                    }
                    else return true;
                },
                DB = `${['🌡️','📒','🪵'].some(j=> j==this.id) && app.Constants.Mode=='' ? '../' : ''}📑/`,
                Get = (url, i=0)=> {
                    let u = `${app.Constants.Mode}.json`;
                    if (url instanceof Array) u = url[i]
                    else if (url) u = url;
                    $.get( `${$app.Constants.Host}${DB}${this.id}${u}` )
                    .done((d)=> { 
                        try {
                            if (url instanceof Array) {
                                if (!i) this.data = [];
                                this.data.push(d);
                                if (i < url.length - 1) return Get (url, i+1);
                            }
                            else {
                                this.data = d;
                            }
                            this.repeat.init && setTimeout(this.Init, 1000*60*this.repeat.init);
                            this.Update();
                        } catch (e) { this.Reset(e) }
                    })
                    .fail(()=> this.Reset())
                };
                //
                $(this.sid).removeClass("errorBorder");
                if (!ResolveDependency ()) return;
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
                    $(this.sid).removeClass("errorBorder");
                    this.repeat.update && setTimeout(this.Update, 1000*60*this.repeat.update);
                    this.update && this.update();
                    if (this.status != app.Constants.Status.Done) {
                        this.status = app.Constants.Status.Done;
                        dispatchEvent(new Event('🖥️.' + this.id));
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
                $(this.sid).text(`${this.id} ${t}: ${e}`).addClass("errorBorder");
            }
        }
    };

    
    function Load () {
        const s = event.target.readyState;
        if (s == "loading") webBrowser()
        else if (s == "interactive") Head ()
        else Object.entries(app.Widgets).forEach((w)=>w[1].Init());
    }
    
    function Head () {
        [app.Constants.Name,'⏳'].forEach((e)=> { const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = app.Constants.Host + 'Css/' + e + '.css'; document.head.appendChild(link); } ); 
        ['🎉','📅','🌡️','🪵','⏱️','📒','⚠️'].forEach((e)=> { const script = document.createElement('script'); script.type = 'text/javascript'; script.src = app.Constants.Host + 'Scripts/' + e + '.js'; document.head.appendChild(script); } ); 
    }
    
    function webBrowser() {
        return;
        if (!app.Constants.Host.startsWith('http:')) 
            location.replace('http://localhost:8181/Documents/Apps/🖥️/DC/index.html');
        //if (!String.prototype.replaceAll) 
        //	String.prototype.replaceAll = (function (p,r) {return this.split(p).join(r)}); 
        if (document.body.requestFullscreen) {
            //alert ()
            var el = document.documentElement,
                rfs = el.requestFullscreen
                  || el.webkitRequestFullScreen
                  || el.mozRequestFullScreen
                  || el.msRequestFullscreen
                  ;
             rfs.call(el); 
             
            //document.body.requestFullscreen(); // failed 
            //alert ()
        }
        
        //GM_notification('^+F', 'AutoHotkey')
        
        /*
        <input type='button' id='btn'>
        const button = document.getElementById('btn');  
        button.addEventListener('click', () => {
            document.body.requestFullscreen();
        });
        button.onclick();
        */
    }
    
    document.addEventListener("readystatechange", Load);
    
})();