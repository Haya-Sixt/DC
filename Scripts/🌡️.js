// Import
document.querySelector('html').$app.Import();

// 1.
(()=>{

// Forecast
const wdgt = new $app.Widget('🌡️');

let chart, images = [], rangeBuilder = [], columnBuilder = [], axisY_max = -100, axisY_min = 100;

//{"data":[{"moonrise_ts":1655587278,"wind_cdir":"WNW","rh":53,"pres":935.7,"high_temp":29,"sunset_ts":1655657353,"ozone":288.9,"moon_phase":0.582192,"wind_gust_spd":11.6,"snow_depth":0,"clouds":0,"ts":1655622060,"sunrise_ts":1655606026,"app_min_temp":18.8,"wind_spd":4.5,"pop":0,"wind_cdir_full":"west-northwest","slp":1010.8,"moon_phase_lunation":0.69,"valid_date":"2022-06-19","app_max_temp":29.4,"vis":24.128,"dewpt":14.4,"snow":0,"uv":2,"weather":{"icon":"c01d","code":800,"description":"Clear Sky"},"wind_dir":300,"max_dhi":null,"clouds_hi":0,"precip":0,"low_temp":17.8,"max_temp":29,"moonset_ts":1655628794,"datetime":"2022-06-19","temp":25.3,"min_temp":18.8,"clouds_mid":0,"clouds_low":5},
//{"moonrise_ts":1655851715,"wind_cdir":"W","rh":68,"pres":934.4,"high_temp":27.4,"sunset_ts":1655916589,"ozone":293.2,"moon_phase":0.266352,"wind_gust_spd":10.2,"snow_depth":0,"clouds":9,"ts":1655845260,"sunrise_ts":1655865263,"app_min_temp":17.9,"wind_spd":5.4,"pop":0,"wind_cdir_full":"west","slp":1006.5,"moon_phase_lunation":0.79,"valid_date":"2022-06-22","app_max_temp":27.6,"vis":24.128,"dewpt":15.1,"snow":0,"uv":11.2,"weather":{"icon":"c02d","code":801,"description":"Few clouds"},"wind_dir":281,"max_dhi":null,"clouds_hi":0,"precip":0,"low_temp":19.1,"max_temp":27.4,"moonset_ts":1655898707,"datetime":"2022-06-22","temp":22,"min_temp":17.9,"clouds_mid":0,"clouds_low":33}],"city_name":"West Jerusalem","lon":"35.21961","timezone":"Asia\/Jerusalem","lat":"31.78199","country_code":"IL","state_code":"06"};


//
wdgt.Update = ()=> {
	
	dataBuilder();

	render();
    
  addImages();
};

function dataBuilder () {
	$.each( wdgt.data.data, function( key, val) {
		axisY_max=val.max_temp>axisY_max?val.max_temp:axisY_max;
		axisY_min=val.min_temp<axisY_min?val.min_temp:axisY_min;
		
		rangeBuilder.push({ 
				label: (new Date(val.ts*1000))
				.toLocaleDateString('he-IL', { weekday: 'short' }).replace("יום ","").replace("׳",""), 
				y: [val.min_temp, val.max_temp], 
				icon: val.icon
		});
	});
	
	$app.Vars['☔'] = false;
	$.each( wdgt.data.data, function( key, val, i) {
		if (key==1 && val.pop) $app.Vars['☔'] = true;
		
		columnBuilder.push({
			y: [axisY_min,(axisY_max-axisY_min)*val.pop/100+axisY_min]
		});
	});
}

function render() {
	chart = wdgt.data.chart = new CanvasJS.Chart(wdgt.id, {
		axisY: {
			minimum: axisY_min-1,
			maximum: axisY_max+3,
			gridThickness: 0,
			tickLength: 0,
			lineThickness: 0,
			labelFontColor: "transparent"
		},
		axisX: {
			gridThickness: 0,
			tickLength: 0,
			lineThickness: 0,
			labelFontSize: 20,
			labelFontColor: "gray", 
			labelPlacement:"outside"
		},
		theme: "dark1",
		backgroundColor: null,
		dataPointWidth: 35,
		data: [{
			type: "rangeSplineArea",
			fillOpacity: 0.0,
			indexLabelFontSize: 20,
			indexLabelFontColor: "#E6E6E6",
			lineThickness: 12, 
			dataPoints: rangeBuilder
			}, {
			type: "rangeColumn",
			color: "#1187DC",
			dataPoints: columnBuilder
		}]
	}); 

	chart.render();
}
	 
function addImages() {
	for(var i = 0; i < chart.data[0].dataPoints.length; i++) {
		var nm = "", ic=chart.data[0].dataPoints[i].icon;

		images.push($("<img>").attr("src", $app.Vars.base + "Images/weatherbit/"+ic+".png").attr("title",ic));

		if (ic.substring(0,1)=="a") nm="cloudy"
		else if (ic.substring(0,1)=="c") nm="sunny"
		else nm="rainy";
		chart.data[0].dataPoints[i].name = nm;

		images[i].attr("class", nm)
			.appendTo($(wdgt.sid));
		positionImage(images[i], i);
	}
}
	 
function positionImage(image, index) {
	var x = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x);

	image.width("40px")
		.css({ "left": x - 20 + "px",
		"position": "absolute","top":"-30px"});

	// yesterday dimmer
	index || 
		$("<div>")
		.height($(wdgt.sid).height() * 1.5)
		.css({ "left": x - 24 + "px" })
		.appendTo($(wdgt.sid));
}
	 

$( window ).resize(function() {
	var cloudy = 0, rainy = 0, sunny = 0;    
	var iC = 0;
	if (!chart) return;
	for(var i=0;i<chart.data[0].dataPoints.length;i++) {
		iC = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
		if(chart.data[0].dataPoints[i].name == "cloudy") {					
			$(".cloudy").eq(cloudy++).css({ "left": iC});
		} else if(chart.data[0].dataPoints[i].name == "rainy") {
			$(".rainy").eq(rainy++).css({ "left": iC});  
		} else if(chart.data[0].dataPoints[i].name == "sunny") {
			$(".sunny").eq(sunny++).css({ "left": iC});  
		}                
	}
});

})();


// 2.
(()=>{

// Temperature
const wdgt = new $app.Widget('🏳️‍🌈');
wdgt.dependency = '🌡️';

//
wdgt.Init = ()=> {
	wdgt.data = parseFloat($app.Widgets['🌡️'].data.data[0].temp).toFixed(2);
};

//
wdgt.Update = ()=> {
	let canvas = $(wdgt.sid).html("<canvas width='100%' height='100%'></canvas>"),
		c = canvas.children().attr('width',canvas.width()).attr('height',canvas.height()),
		ctx = c[0].getContext("2d"),
		width = canvas.width(), height = canvas.height(), 
		margin = 5, stops = GredientConverter.maxTemperature()/10, 
		section = (height - margin*2)/10,
		t = wdgt.data; 
	
	for (var i=0; i < 10; i++) {
		var grd = ctx.createLinearGradient(0, margin + section*i, 0, margin + section*(i+1) );
		for (var j=0; j <= stops; j++) {
			grd.addColorStop(j/stops, GredientConverter.toTemperature((10-i)*stops-j-1));
		} 
		ctx.fillStyle = grd; 
		ctx.fillRect(margin, margin+(section*i), width-(margin*2), section );
	}

	// mark the current temperature 
	t=t<0?0:t;
	t=t>GredientConverter.maxTemperature()?GredientConverter.maxTemperature():t;
	Mark ("5","#AAA");
	Mark ("3","#FFF");

	$("<span>")
		.html(parseInt(t)+'°')
		.appendTo(wdgt.sid);
	
		
	function Mark(lineWidth,strokeStyle) {
		var y =  margin + (height - margin*2) - (t / GredientConverter.maxTemperature() * (height - margin*2) );
		var curve = margin/1.5;
		ctx.beginPath(); 
		ctx.lineWidth = lineWidth*1.5;
		ctx.strokeStyle = strokeStyle;
		ctx.moveTo(margin, y-margin);
		ctx.lineTo(width-margin, y-margin);
		ctx.quadraticCurveTo(width-curve, y-margin, width-curve, y-curve);
		ctx.lineTo(width-curve, y+curve);
		ctx.quadraticCurveTo(width-curve, y+margin, width-margin, y+margin);
		ctx.lineTo(margin, y+margin);
		ctx.quadraticCurveTo(curve, y+margin, curve, y+curve);
		ctx.lineTo(curve, y-curve);
		ctx.quadraticCurveTo(curve, y-margin, margin, y-margin);
		ctx.stroke();
	}
};

})();


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
// 🗒: called inside canvasjs (hacked)
//
function strokeStyleGredient (b,d,r,up) {
	b.stroke();

	for (var g = f = 0; f < d.length - 3; f += 3, g++) {
		b.beginPath();
		b.moveTo(d[f].x, d[f].y);
		r[g] && r[g].newStrokeStyle && (b.strokeStyle = r[g].newStrokeStyle);
		r[g] && r[g].newLineDashArray && b.setLineDash(r[g].newLineDashArray);
		b.bezierCurveTo(d[f + 1].x, d[f + 1].y, d[f + 2].x, d[f + 2].y, d[f + 3].x, d[f + 3].y);
		
		var dataPoints = $app.Widgets['🌡️'].data.chart.data[0].dataPoints;
		var n1 = dataPoints[g].y[up];
		var n2 = dataPoints[g+1].y[up];

		var gradient = b.createLinearGradient(d[f].x, d[f].y, d[f+3].x, d[f+3].y);
		gradient.addColorStop(0, GredientConverter.toTemperature(n1));
		gradient.addColorStop(1, GredientConverter.toTemperature(n2)); 
		b.strokeStyle = gradient;

		b.stroke();
	}
}