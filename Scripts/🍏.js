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
            this.window.$app = document.querySelector('html').$app; // needed
        },
        Widgets: [],
        Widget: class Widget {
            constructor (id) {
                this.id = id;
                this.sid = `#${id}`;
                this.init = init;
                this.update = update;
                $('<div>').attr('id', id).html(`${id}...`).appendTo('body');
                Widgets[id] = this;
            }
            _Init () {
                try {
                    $(this.sid).text(`${this.id} Init...`).removeClass("errorBorder");
                    this.init();
                } catch (e) { $(this.sid).text(`${this.id} Init: ${e}`).addClass("errorBorder"); } 
            }
            _Update (xhr) {
                try {
                    $(this.sid).text(`${this.id} Update...`).removeClass("errorBorder");
                    this.Update($.parseJSON(xhr.responseText));
                } catch (e) { $(this.sid).text(`${this.id} Update: ${e}`).addClass("errorBorder"); }
            }
            Restart (m) {
                setTimeout(this._Init, 1000*60*m);
            }
            Reset (fn='get') {
                $(this.sid).text(`${this.id} ${fn} failed.\nResetting (40s)...`);
                setTimeout(this._Init, 1000*40);
            }
        }
    };

    app.Import ();

    
    function Load () {
        const s = event.target.readyState;
        if (s == "loading") webBrowser()
        else if (s == "interactive") Head ()
        else Widgets.forEach((w)=>w.Init());
    }
    
    function Head () {
        ['🖥️','⏳'].forEach((e)=> { const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = $app.Vars.base + 'Css/' + e + '.css'; document.head.appendChild(link); } ); 
        ['jquery-3.5.0.min','canvasjs.min','🌡️','🗓️','🪵','📒','⚠️','⏱️','⏳'].forEach((e)=> { const script = document.createElement('script'); script.type = 'text/javascript'; script.src = $app.Vars.base + 'Scripts/' + e + '.js'; document.head.appendChild(script); } ); 
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