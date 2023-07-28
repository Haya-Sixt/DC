// 1.
(()=>{

// Forecast
const wdgt = new $app.Widget('🌡️'), 
	c_class = `${wdgt.id}-icon`; 
	
let chart, images, rangeBuilder, columnBuilder, axisY_max = -100, axisY_min = 100;

//{"data":[{"moonrise_ts":1655587278,"wind_cdir":"WNW","rh":53,"pres":935.7,"high_temp":29,"sunset_ts":1655657353,"ozone":288.9,"moon_phase":0.582192,"wind_gust_spd":11.6,"snow_depth":0,"clouds":0,"ts":1655622060,"sunrise_ts":1655606026,"app_min_temp":18.8,"wind_spd":4.5,"pop":0,"wind_cdir_full":"west-northwest","slp":1010.8,"moon_phase_lunation":0.69,"valid_date":"2022-06-19","app_max_temp":29.4,"vis":24.128,"dewpt":14.4,"snow":0,"uv":2,"weather":{"icon":"c01d","code":800,"description":"Clear Sky"},"wind_dir":300,"max_dhi":null,"clouds_hi":0,"precip":0,"low_temp":17.8,"max_temp":29,"moonset_ts":1655628794,"datetime":"2022-06-19","temp":25.3,"min_temp":18.8,"clouds_mid":0,"clouds_low":5},
//{"moonrise_ts":1655851715,"wind_cdir":"W","rh":68,"pres":934.4,"high_temp":27.4,"sunset_ts":1655916589,"ozone":293.2,"moon_phase":0.266352,"wind_gust_spd":10.2,"snow_depth":0,"clouds":9,"ts":1655845260,"sunrise_ts":1655865263,"app_min_temp":17.9,"wind_spd":5.4,"pop":0,"wind_cdir_full":"west","slp":1006.5,"moon_phase_lunation":0.79,"valid_date":"2022-06-22","app_max_temp":27.6,"vis":24.128,"dewpt":15.1,"snow":0,"uv":11.2,"weather":{"icon":"c02d","code":801,"description":"Few clouds"},"wind_dir":281,"max_dhi":null,"clouds_hi":0,"precip":0,"low_temp":19.1,"max_temp":27.4,"moonset_ts":1655898707,"datetime":"2022-06-22","temp":22,"min_temp":17.9,"clouds_mid":0,"clouds_low":33}],"city_name":"West Jerusalem","lon":"35.21961","timezone":"Asia\/Jerusalem","lat":"31.78199","country_code":"IL","state_code":"06"};


//
wdgt.Update = ()=> {
	
	Normalize ();

	Render ();
	
	Icons ();
	
	DimTodayColumn ();
	
	Verify ();
};


//
function Normalize () {
	rangeBuilder = [];
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
	
	columnBuilder = [];
	$.each( wdgt.data.data, function( key, val, i) {
		if (key==1) Pop(val.pop);
		
		columnBuilder.push({
			y: [axisY_min,(axisY_max-axisY_min)*val.pop/100+axisY_min]
		});
	});
	
	
	// ☔
	function Pop (p) {
		const pop = [null, '☂️', '☔', '⚡', '❄️'];
		p = pop[ Math.ceil( p / (100 / (pop.length - 1) ) ) ];
	  if (p) $app.Widgets['🚥'].Add (p, undefined, wdgt.id)
	  else $app.Widgets['🚥'].Remove (undefined, wdgt.id)
	}
}


//
function Render() {
	const f = (e)=> e.dataPoint.x == 1 ? e.dataPoint.y[e.index] + "°" : '';

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
			labelFontColor: Helpers.Css('--🖥️-c-t-2'), 
			labelPlacement:"outside"
		},
		theme: "dark1",
		backgroundColor: null,
		dataPointWidth: 35,
		data: [{
			type: "rangeSplineArea",
			fillOpacity: 0.0,
			indexLabelFontSize: 20,
			indexLabelFontColor: Helpers.Css('--🖥️-c-ts-2'),
			indexLabelFontFamily: "sans-serif",
			lineThickness: 12, 
			indexLabelFormatter: f,
			dataPoints: rangeBuilder
			}, {
			type: "rangeColumn",
			color: "#1187DC", // 🗒: Hard-coded rain color (therefore not in css)
			dataPoints: columnBuilder
		}]
	}); 
	
	//chart.creditText = '';
	
	chart.render();
}


//
function Icons () {
	const c_icons = [['☀️',['c01']],
			['🌤️',['c02']],
			['⛅',['c']],
			['☁️',['a']],
			['🌦',['r01','r04','r05','t01','t02']],
			['🌧️',['d','f','r','u']],
			['⛈️',['t']],
			['🌨️',['s']]],
		Icon = (c) => {
				for (let i = 0; i < c_icons.length; i++) {
					for (let j = 0; j < c_icons[i][1].length; j++) {
						if (c.startsWith(c_icons[i][1][j])) return c_icons[i][0];
					}
				}
			};
			
	setTimeout (Set, 250);

	function Set () {
		const d = document.querySelector('#🌡️').firstChild,
			ctx = chart.overlaidCanvasCtx,
			canvas = ctx.canvas,
			f = parseInt (canvas.height / 10), // RN10S 15
			c = parseInt (canvas.width / 8.4), // RN10S 12
			dP = chart.data[0].dataPoints; 
			
		d.querySelectorAll(':not(canvas)').forEach((e)=>{e.style.display = 'none'});
		canvas.style.setProperty('top',`-${f}px`)
		canvas.style.setProperty('left',`-${f}px`)
		ctx.font = `${f}px Calibri`;
		for (let i = 0; i < dP.length; i++) {
			const ic = dP[i].icon;
			ctx.fillText(Icon(ic), c * (i + 1), f);
		}
	}

/*
function Icons () {
	const c_icons = , Icon = (c) => , c_size = 40;
	images = [];
	for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
		const ic = chart.data[0].dataPoints[i].icon;
		images.push($("<img>").attr("src", `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="${c_size}px" font-size="${c_size - 10}px">${Icon(ic)}</text></svg>`));
		Position(images[i], i);
		images[i].attr("class", c_class).appendTo($(wdgt.sid));
	}
	function Position(image, index) {
		var x = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x);
		image.width(`${c_size}px`) // 🗒: width is needed
			.css({ "left": `${x - (c_size / 2)}px`,
				"position": "absolute", 
				"top": `-${c_size}px`});
	}
*/
/* 
function Icons () {
	const c_icons = , Icon = (c) => ,
		f = chart.height / 3.5 / 2,
		s = chart.width / 7.5, // (chart.width - c * 4) / 2
		c = (chart.width - s * 2) / 4; // chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[0].x) 
		 
	chart.ctx.font = `${f}px Calibri`;
	for (var i = 0; i < rangeBuilder.length; i++) {
		const t = rangeBuilder[i].icon;
		chart.ctx.fillText(Icon(t), s + (c * i), 1);
	}
}
*/

}

/*
// 🗒: Needed
function Icon_Resize () {
	for(var i = 0; i < chart.data[0].dataPoints.length; i++) {
		const iC = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
		$(`.${c_class}`).eq(i).css({ "left": iC});
	}
}
*/


// 
function DimTodayColumn () {
	const x = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[0].x);
	$("<div>")
		.html('<div class="tdCurrent"></div>')
		.height($(wdgt.sid).height() * 1.5)
		.css({ "left": x - 24 + "px" })
		.appendTo($(wdgt.sid));
}


//
let verified;
function Verify () {
	const canvas = document.querySelector(`${wdgt.sid} > div.canvasjs-chart-container > canvas:nth-child(1)`),
		c = canvas?.getContext("2d")?.getImageData(0,0,200,200)
			?.data?.filter((p)=>p!=0)?.length; 
	
	if ((c ?? 0) < 7000) { // 7651
		// !verified && wdgt.Reset(`Verify is ${c}`);
		verified = true;
	}
	else verified = false; 
}


// 
$( window ).resize(function() {
	if (!chart) return;
	//Icon_Resize (); 
	Icons ();
	Verify ();
});  


//
function FindBug () {
	const d = document.querySelector(wdgt.sid);
	d.addEventListener ('click', ()=> {
		const canvas = document.querySelector(`${wdgt.sid} > div.canvasjs-chart-container > canvas:nth-child(1)`),
		c = canvas?.getContext("2d")?.getImageData(0,0,200,200)
			?.data?.filter((p)=>p!=0)?.length; 
	
		Popup.Add(`verified: ${verified}, c: ${c}`, 30);
	});
}
FindBug ();
	
})();


// 2.
(()=>{

// Temperature
const wdgt = new $app.Widget('💈');
wdgt.dependency = ['🪵'];

//
wdgt.Init = ()=> {
	wdgt.data = parseFloat($app.Widgets['🪵'].data[wdgt.id]).toFixed(2);
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
