
// ⏳
class Countdown {

static #template = `<ul class="cdc_flip cdc_dgtPlay">
	<li class="cdc_before">
		<div class="cdc_up">
			<div class="cdc_shadow"></div>
			<div class="cdc_inn">dgt_before</div>
		</div>
		<div class="cdc_down">
			<div class="cdc_shadow"></div>
			<div class="cdc_inn">dgt_before</div>
		</div>
	</li>
	<li class="cdc_active">
		<div class="cdc_up">
			<div class="cdc_shadow"></div>
			<div class="cdc_inn">dgt_active</div>
		</div>
		<div class="cdc_down">
			<div class="cdc_shadow"></div>
			<div class="cdc_inn">dgt_active</div>
		</div>
	</li>
</ul>`;

static #n_s; 
static #i_Play;

static Start (n) {
	try {
	n = parseInt(n);
	if (n <= 0) return;
	Countdown.#n_s = ('' + n);
	
	Countdown.#Stop(true);
	
	if ($("#⏳").length!=0) $("#⏳").remove();
	$("<div>").attr("id","⏳").appendTo("#🪵").html('<div class="cdc_container"></div>');
		
	var html = '', n_s_before = Countdown.#n_s;
	Countdown.#Play(); 
	for (var i = 0; i < n_s_before.length; i++) {
		html += Countdown.#template.replaceAll("cdc_dgtPlay", "cdc_" + i + "Play")
			.replaceAll("dgt_before", parseInt(n_s_before.charAt(i)))
			.replaceAll("dgt_active", parseInt(Countdown.#n_s.charAt(i)));
	}

	$("#⏳ .cdc_container").html(html);

	$("#⏳ .cdc_container").show('slow');
		
	Countdown.#i_Play = setInterval(Countdown.#Play, 1000); 
	
	} catch(e) { console.log('⏳ Init:\n' + e); }
}

//
static #Play() {
	try {
	var minus1 = Countdown.#Timefy(parseInt(Countdown.#n_s)-1);
	
	if (minus1.length < Countdown.#n_s.length) 
		$(".cdc_container .cdc_" + (Countdown.#n_s.length - minus1.length - 1) + "Play").hide('slow');
	
	for (var i = minus1.length-1; i >= 0; i--) {
		var n_s_i = i + (Countdown.#n_s.length - minus1.length);
		if (Countdown.#n_s.charAt(n_s_i) != minus1.charAt(i)) {
						$(".cdc_container .cdc_" + n_s_i + "Play li").toggleClass("cdc_active cdc_before");
			$(".cdc_container .cdc_" + n_s_i + "Play .cdc_active .cdc_inn").text(
			  minus1.charAt(i)
			); 

		}
	}
	Countdown.#n_s = minus1.padStart(Countdown.#n_s.length, '0');
	
	Countdown.#Stop();
	
	} catch(e) { console.log('⏳ Play:\n' + e); }
}

static #Stop(force) {
	if (!force && parseInt(Countdown.#n_s)!=0 ) 
		return;
		
	clearInterval(Countdown.#i_Play);
	Countdown.#beep();
  
	if (!force) 
		setTimeout(()=>$("#⏳ .cdc_container").hide('slow'), 3000);
}

static #Timefy(n) {
	var s = ('' + n);
	n = 0;
	for (var i = 0; i < s.length; i++) {
		var d = parseInt(s.charAt(i));
		if ((s.length - i) % 2 == 0 && d > 5) 
			d = 5;
		n = n * 10 + d;
	}
	return ('' + n);
}

static #beep() {
	try {
  const snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
  snd.play();
	} catch(e) { console.log('⏳ Beep:\n' + e); }
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

static Add (html, t) {
	const p = $("<div>")
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
				$(".popup").each((i, t)=> {
					height += $(t).outerHeight() + 10;
				});
				return -height; 
			}
		});
	t && setTimeout(()=>p.remove(), t*1000);
}

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
//$(Countdown).text(index + '' + o) ;
		if (index == o) 
			$(Countdown).remove()
		else {
			height += $(Countdown).innerHeight() + 10;
			$(Countdown).css({ 'margin-top' : function() {return -height;} });
		} 
	});
} 
*/
