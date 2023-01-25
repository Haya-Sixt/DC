// App
(function () {

    const app = document.querySelector('html').$app = {
        Vars : { 
            'base': document.location.href.match(/.*\//umg)[0], 
            '🕯️': 0, 
            '🕯️🕯️': false, 
            'sunset': 0, 
            '☔': false 
        },
        Import () {
            this.window.$app = document.querySelector('html').$app; // needed
        }
    };
    
    function Load () {
        const s = event.target.readyState;
        if (s == "loading") webBrowser()
        else if (s == "interactive") Init ();
    }
    
    function Init () {
        // Head
        ['🖥️','⏳'].forEach((e)=> { const link = document.createElement('link'); link.rel = 'stylesheet'; link.type = 'text/css'; link.href = app.Vars.base + 'Css/' + e + '.css'; document.head.appendChild(link); } ); 
        ['jquery-3.5.0.min','canvasjs.min','🌡️','🗓️','🪵','📒','⚠️','⏱️','⏳'].forEach((e)=> { const script = document.createElement('script'); script.type = 'text/javascript'; script.src = app.Vars.base + 'Scripts/' + e + '.js'; document.head.appendChild(script); } ); 
    }
    
    function webBrowser() {
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