// App
(function () {

    const app = document.querySelector('html').$app = {
        Vars : { 
            'base': document.location.href.match(/.*\//umg)[0], 
            '🕯️': 0, 
            '🕯️🕯️': false, 
            '🌇': 0, 
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
                this.init = null;
                this.update = null;
                this.repeat = {init: 0, update: 0};
                this.dependency = '';
                $('<div>').attr('id', id).html(`${id}...`).appendTo('body');
                app.Widgets[id] = this;
            }
            get Init () {
                return ()=> { try {
                    $(this.sid).text(`${this.id} Init...`).removeClass("errorBorder");
                    if (this.init) {
                        this.init();
                    }
                    else {
                        const url = `${$app.Vars.base}📑/${this.id}.json`;
                        $.get( url, 
                            (d, s, xhr)=> {
                                this.repeat.init && setTimeout(this.Init, 1000*60*this.repeat.init);
                                const data = $.parseJSON(xhr.responseText);
                                this.Update(data);
                        })
                        .fail(()=> wdgt.Reset());
                    }
                } catch (e) { $(this.sid).text(`${this.id} Init: ${e}`).addClass("errorBorder"); } }
            }
            set Init (f) {
                this.init = f;
            }
            get Update () {
                return (data)=>{ try {
                    $(this.sid).text(`${this.id} Update...`).removeClass("errorBorder");
                    this.update(data);
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
        else app.Widgets.forEach((w)=>w.Init());
    }
    
    function Head () {
        ['🖥️','⏳'].forEach((e)=> { const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = app.Vars.base + 'Css/' + e + '.css'; document.head.appendChild(link); } ); 
        //['jquery-3.5.0.min','canvasjs.min','🌡️','🗓️','🪵','📒','⚠️','⏱️','⏳'].forEach((e)=> { const script = document.createElement('script'); script.type = 'text/javascript'; script.src = $app.Vars.base + 'Scripts/' + e + '.js'; document.head.appendChild(script); } ); 
        ['jquery-3.5.0.min','canvasjs.min','🪵'].forEach((e)=> { const script = document.createElement('script'); script.type = 'text/javascript'; script.src = app.Vars.base + 'Scripts/' + e + '.js'; document.head.appendChild(script); } ); 
    }
    
    function webBrowser() {
        return;
        if (!app.Vars.base.startsWith('http:')) 
            location.replace('http://localhost:8181/Documents/🖥️/🖥️.html');
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