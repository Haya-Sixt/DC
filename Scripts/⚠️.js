// Import
document.querySelector('html').$app.Import();

(()=>{

// C2: Command and Control
function Init(steps) {

	setInterval(function () {
		var forcast = $("canvas.canvasjs-chart-canvas");
		if ("157,190".indexOf(parseInt(forcast.height())) == -1
		 || "360,332".indexOf(parseInt(forcast.width())) == -1) {
			$app.Widgets['🌡️'].Reset ('⚠️');
			//Popup.Dimention();
			}

		var calendar = $("#🗓️ table");
		if ("629,438".indexOf(parseInt(calendar.width())) == -1) {
			$app.Widgets['🗓️'].Reset ('⚠️');
			//Popup.Dimention();
			}

	//
	// MD waits 5m before taking the screenshot, 
	// so here the iteration is 6m at least, 
	// for allowing the screen rotation to correctly render.
	//
	}, 1000*60*2); 
	
	//body.onclick = popup_dimention; // doesn't work 
}

window.addEventListener("load", Init);

});