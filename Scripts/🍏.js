// App
(function () {

    const app = document.querySelector('html').$app = {
        Constants : {
            Status : { Done: 'done' },
            Name: '🖥️',
            Host: document.location.href.match(/.*\//umg)[0]
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
                this.init = this.update = this.url = null;
                this.repeat = {init: 0, update: 0};
                this.dependency = this.status = '';

                $('<div>').attr('id', id).html(`${id}...`).appendTo('body');
                app.Widgets[id] = this;
            }
            get Init () {
                return ()=> { try {
                    const Dependency = ()=> this.dependency && 
                        this.status != app.Constants.Status.Done && // 🗒: potential 🐛 - add multiple listeners when this.init fails 
                        app.Widgets[this.dependency].status != app.Constants.Status.Done;
                    $(this.sid).removeClass("errorBorder");
                    if (this.init) {
                        if (Dependency ()) {
                            addEventListener(`${app.Constants.Name}.${this.dependency}`, ()=> {
                                this.init();
                                this.repeat.init && setTimeout(this.Init, 1000*60*this.repeat.init);
                                this.Update();
                            }, {once: true});
                        }
                        else {
                            this.init();
                            this.repeat.init && setTimeout(this.Init, 1000*60*this.repeat.init);
                            this.Update();
                        }
                    }
                    else {
                        const Get = (i=0)=> {
                            let u = '.json';
                            if (!i && this.Url) this.url = this.Url();
                            if (this.url instanceof Array) u = this.url[i]
                            else if (this.url) u = this.url;
                            $.get( `${$app.Constants.Host}📑/${this.id}${u}` )
                            .done((d)=> { 
                                try {
                                    if (this.url instanceof Array) {
                                        if (!i) this.data = [];
                                        this.data.push(d);
                                        if (i < this.url.length - 1) return Get (i+1);
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
                        if (Dependency ()) addEventListener(`${app.Constants.Name}.${this.dependency}`, Get, {once: true})
                        else Get ();
                    }
                } catch (e) { $(this.sid).text(`${this.id} Init: ${e}`).addClass("errorBorder"); } }
            }
            set Init (f) {
                this.init = f;
            }
            get Update () {
                return ()=>{ try {
                    $(this.sid).removeClass("errorBorder");
                    this.repeat.update && setTimeout(this.Update, 1000*60*this.repeat.update);
                    this.update && this.update();
                    this.status != app.Constants.Status.Done && dispatchEvent(new Event('🖥️.' + this.id));
                    this.status = app.Constants.Status.Done;
                } catch (e) { $(this.sid).text(`${this.id} Update: ${e}`).addClass("errorBorder"); } }
            }
            set Update (f) {
                this.update = f;
            }
            Reset (fn='get') {
                $(this.sid).text(`${this.id} ${fn} failed.\nResetting (40s)...`);
                setTimeout(this.Init, 1000*40);
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
        ['🪵','🌡️','📅','📒','⏱️','🎉','⚠️'].forEach((e)=> { const script = document.createElement('script'); script.type = 'text/javascript'; script.src = app.Constants.Host + 'Scripts/' + e + '.js'; document.head.appendChild(script); } ); 
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