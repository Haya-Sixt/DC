// Import
document.querySelector('html').$app.Import();

(()=>{

	window.addEventListener("load", Init);

// C2: Command and Control
function Init(steps) {

	setInterval(function () {
		var forcast = $("canvas.canvasjs-chart-canvas");
		if ("157,190".indexOf(parseInt(forcast.height())) == -1
		 || "360,332".indexOf(parseInt(forcast.width())) == -1) {
			$app.Widgets['forecast'].Init();
			//popup_dimention();
			}

		var calendar = $("#calendar table");
		if ("629,438".indexOf(parseInt(calendar.width())) == -1) {
			$app.Widgets['calendar'].Init();
			//popup_dimention();
			}

	//
	// MD waits 5m before taking the screenshot, 
	// so here the iteration is 6m at least, 
	// for allowing the screen rotation to correctly render.
	//
	}, 1000*60*2); 
	
	//body.onclick = popup_dimention; // doesn't work 
}



// popup 
function popupInit() {

	//setTimeout (popup_dimention, 1000*10);
	//setTimeout (popup_dimention, 1000*60*4);

	//popupAdd("1 ניסיון");
	//popupAdd("2 ניסיון");
	//popupAdd("3 ניסיון");
	//popupAdd("4 ניסיון 4 ניסיון 4 ניסיון 4 ניסיון");
		
	//popupUpdate();
	//setInterval(popupUpdate, 1000*60);
}

function popup_dimention() {
	popupAdd(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
		+':  🌡️ '+ parseInt($("#forecast").height())
		+'X'+ parseInt($("#forecast").width())
		+',  🌡️(canvas) '+ parseInt($("canvas.canvasjs-chart-canvas").height())
		+'X'+ parseInt($("canvas.canvasjs-chart-canvas").width())
		+',  📆 '+ parseInt($("#calendar table").height())
		+'X'+ parseInt($("#calendar table").width())
		//+', body: '+ parseInt($("body").width())
		//+', doc: '+ parseInt($(document).width())
	);
}

/*
function popupUpdate() {
	popupRemove( 1 );
} 

function popupRemove(o) {
	var height=10;
	$(".popup").each(function(index) {
//$(this).text(index + '' + o) ;
		if (index == o) 
			$(this).remove()
		else {
			height += $(this).innerHeight() + 10;
			$(this).css({ 'margin-top' : function() {return -height;} });
		} 
	});
} 
*/

function popupAdd(html) {

	$("<div>")
		.attr("name","popup")
		.attr("class","popup")
		//.attr("style","")
		.html(html)
		.appendTo("body")
		.css({
	        //'position' : 'absolute',
	        //'left' : '50%',
	        //'top' : '50%',
	        'margin-left' : function() {return -$(this).outerWidth()/2},
	        'margin-top' : function() {
				var height=10;
				$(".popup").each(function() {
					height += $(this).innerHeight() + 10;
				});
				return -height; 
			}
	    });

} 

})();