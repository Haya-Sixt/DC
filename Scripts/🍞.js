//
// Helpers
//

//
class GredientConverter {

	// 🗒: array length should be % 10 = 1
	static colors() { return ["0800FF","0614FF","0429FF","023DFF",	//navi to blue
			"0051FF","0072FF","0093FF","00B5FF","00D6FF",	//blue to Turquoise 
			"00F7FF","00F7FF","00F7FF","00FBBB",	//Turquoise to spring green  
			"00FF77",/*"12FF5F",*/"24FF47","35FF30",/*"47FF18",*/	//Spring Green To green
			"59FF00","75F900","90F300","ACEE00","C7E800","E3E200","E3E200",	//Green to yellow
			"FEDC00","FEDC00","FCC201","FAA802","F78E02",	//yellow to orange
			"F57403","F75904","F93E06","FA2307",	//orange to red
			"FC0808","FC0840","FC0878","FC08B0","FC08B0",	//red to pink
			"FC08E8","D508EF","AD08F5","8608FC","8608FC","8608FC"]; }	//pink to purple 
 
	static maxTemperature() { return this.colors().length; }

	static toTemperature(t) {
		return this.toColor(t,0,this.maxTemperature());
	}

	static toColor(n,from,to) {
		n=n<from?from:n;
		n=n>to?to:n;
		// find relative color in colors range
		var color = parseInt( (n-from) / (to-from) * (this.colors().length) );
		return "#" + this.colors()[color];
	}  
}


//
class Popup {

	static Dimention() {
		Add(new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
			+':  🌡️ '+ parseInt($("#🌡️").height())
			+'X'+ parseInt($("#🌡️").width())
			+',  🌡️(canvas) '+ parseInt($("canvas.canvasjs-chart-canvas").height())
			+'X'+ parseInt($("canvas.canvasjs-chart-canvas").width())
			+',  🗓️ '+ parseInt($("#🗓️ table").height())
			+'X'+ parseInt($("#🗓️ table").width())
			//+', body: '+ parseInt($("body").width())
			//+', doc: '+ parseInt($(document).width())
		);
	}
	
	static Add(html) {
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
	/*
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
	
	}