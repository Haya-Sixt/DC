function Init () {
    ...
    Hotword ();
    ...
    
    // 🔮 
    function Hotword () {
	    const porcupine = new Worker("/DC/🔮/index.js")//, {type:"module"});
	    porcupine.onmessage = e=> {
	    	console.log('Message received from 🔮', e.data, e);
		}
	}
	
	
} // Init