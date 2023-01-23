
function forecastInit() {

	$("#forecast").text("🌡️ init");

//var json2202060000 = {"data":[{"moonrise_ts":1644045453,"wind_cdir":"W","rh":84,"pres":942.7,"high_temp":9.8,"sunset_ts":1644074313,"ozone":337.4,"moon_phase":0.338598,"wind_gust_spd":12.4,"snow_depth":0,"clouds":72,"ts":1644044460,"sunrise_ts":1644035438,"app_min_temp":7.3,"wind_spd":5.4,"pop":20,"wind_cdir_full":"west","slp":1021.4,"moon_phase_lunation":0.16,"valid_date":"2022-02-05","app_max_temp":9.8,"vis":22.65,"dewpt":5.9,"snow":0,"uv":0,"weather":{"icon":"c04d","code":804,"description":"Overcast clouds"},"wind_dir":273,"max_dhi":null,"clouds_hi":0,"precip":0.0144043,"low_temp":6.8,"max_temp":9.8,"moonset_ts":1644093902,"datetime":"2022-02-05","temp":8.7,"min_temp":7.3,"clouds_mid":22,"clouds_low":64},{"moonrise_ts":1644133565,"wind_cdir":"W","rh":80,"pres":945.4,"high_temp":12.1,"sunset_ts":1644160767,"ozone":322.8,"moon_phase":0.43786,"wind_gust_spd":9.5,"snow_depth":0,"clouds":55,"ts":1644098460,"sunrise_ts":1644121793,"app_min_temp":3.6,"wind_spd":3.3,"pop":20,"wind_cdir_full":"west","slp":1024.3,"moon_phase_lunation":0.2,"valid_date":"2022-02-06","app_max_temp":12.1,"vis":24.128,"dewpt":5.3,"snow":0,"uv":0.7,"weather":{"icon":"c03d","code":803,"description":"Broken clouds"},"wind_dir":267,"max_dhi":null,"clouds_hi":0,"precip":0.000976562,"low_temp":7.8,"max_temp":12.1,"moonset_ts":1644183742,"datetime":"2022-02-06","temp":8.9,"min_temp":6.8,"clouds_mid":5,"clouds_low":53},{"moonrise_ts":1644221691,"wind_cdir":"WSW","rh":78,"pres":944.9,"high_temp":13.2,"sunset_ts":1644247221,"ozone":316.3,"moon_phase":0.537198,"wind_gust_spd":6.1,"snow_depth":0,"clouds":59,"ts":1644184860,"sunrise_ts":1644208146,"app_min_temp":7.8,"wind_spd":1.9,"pop":20,"wind_cdir_full":"west-southwest","slp":1023.3,"moon_phase_lunation":0.23,"valid_date":"2022-02-07","app_max_temp":13.2,"vis":24.128,"dewpt":6.2,"snow":0,"uv":0.6,"weather":{"icon":"c03d","code":803,"description":"Broken clouds"},"wind_dir":256,"max_dhi":null,"clouds_hi":0,"precip":0.0742188,"low_temp":7.9,"max_temp":13.2,"moonset_ts":1644187170,"datetime":"2022-02-07","temp":10.1,"min_temp":7.8,"clouds_mid":23,"clouds_low":54},{"moonrise_ts":1644309908,"wind_cdir":"SW","rh":64,"pres":942.8,"high_temp":16.3,"sunset_ts":1644333674,"ozone":302.3,"moon_phase":0.63353,"wind_gust_spd":6,"snow_depth":0,"clouds":27,"ts":1644271260,"sunrise_ts":1644294499,"app_min_temp":7.9,"wind_spd":2,"pop":0,"wind_cdir_full":"southwest","slp":1019.7,"moon_phase_lunation":0.26,"valid_date":"2022-02-08","app_max_temp":16.3,"vis":24.128,"dewpt":4.6,"snow":0,"uv":1.2,"weather":{"icon":"c02d","code":802,"description":"Scattered clouds"},"wind_dir":233,"max_dhi":null,"clouds_hi":18,"precip":0,"low_temp":8.7,"max_temp":16.3,"moonset_ts":1644276990,"datetime":"2022-02-08","temp":11.6,"min_temp":7.9,"clouds_mid":9,"clouds_low":1}],"city_name":"West Jerusalem","lon":"35.21961","timezone":"Asia\/Jerusalem","lat":"31.78199","country_code":"IL","state_code":"06"};
//forecastUpdate(json2202060000);

//var json220619 = {"data":[{"moonrise_ts":1655587278,"wind_cdir":"WNW","rh":53,"pres":935.7,"high_temp":29,"sunset_ts":1655657353,"ozone":288.9,"moon_phase":0.582192,"wind_gust_spd":11.6,"snow_depth":0,"clouds":0,"ts":1655622060,"sunrise_ts":1655606026,"app_min_temp":18.8,"wind_spd":4.5,"pop":0,"wind_cdir_full":"west-northwest","slp":1010.8,"moon_phase_lunation":0.69,"valid_date":"2022-06-19","app_max_temp":29.4,"vis":24.128,"dewpt":14.4,"snow":0,"uv":2,"weather":{"icon":"c01d","code":800,"description":"Clear Sky"},"wind_dir":300,"max_dhi":null,"clouds_hi":0,"precip":0,"low_temp":17.8,"max_temp":29,"moonset_ts":1655628794,"datetime":"2022-06-19","temp":25.3,"min_temp":18.8,"clouds_mid":0,"clouds_low":5},{"moonrise_ts":1655675528,"wind_cdir":"WNW","rh":55,"pres":935.9,"high_temp":28.6,"sunset_ts":1655743766,"ozone":290.8,"moon_phase":0.470351,"wind_gust_spd":10.2,"snow_depth":0,"clouds":0,"ts":1655672460,"sunrise_ts":1655692437,"app_min_temp":17.8,"wind_spd":3.8,"pop":0,"wind_cdir_full":"west-northwest","slp":1011.5,"moon_phase_lunation":0.73,"valid_date":"2022-06-20","app_max_temp":28.5,"vis":24.128,"dewpt":12.5,"snow":0,"uv":11.2,"weather":{"icon":"c01d","code":800,"description":"Clear Sky"},"wind_dir":291,"max_dhi":null,"clouds_hi":0,"precip":0,"low_temp":18.4,"max_temp":28.6,"moonset_ts":1655718881,"datetime":"2022-06-20","temp":22.5,"min_temp":17.8,"clouds_mid":0,"clouds_low":2},{"moonrise_ts":1655763643,"wind_cdir":"WNW","rh":72,"pres":933.2,"high_temp":26.6,"sunset_ts":1655830178,"ozone":289.5,"moon_phase":0.36374,"wind_gust_spd":13.6,"snow_depth":0,"clouds":5,"ts":1655758860,"sunrise_ts":1655778849,"app_min_temp":18.2,"wind_spd":5.9,"pop":0,"wind_cdir_full":"west-northwest","slp":1009.3,"moon_phase_lunation":0.76,"valid_date":"2022-06-21","app_max_temp":26.5,"vis":24.128,"dewpt":15.3,"snow":0,"uv":11.2,"weather":{"icon":"c02d","code":801,"description":"Few clouds"},"wind_dir":288,"max_dhi":null,"clouds_hi":0,"precip":0,"low_temp":17.9,"max_temp":26.6,"moonset_ts":1655808829,"datetime":"2022-06-21","temp":21.4,"min_temp":18.2,"clouds_mid":0,"clouds_low":37},{"moonrise_ts":1655851715,"wind_cdir":"W","rh":68,"pres":934.4,"high_temp":27.4,"sunset_ts":1655916589,"ozone":293.2,"moon_phase":0.266352,"wind_gust_spd":10.2,"snow_depth":0,"clouds":9,"ts":1655845260,"sunrise_ts":1655865263,"app_min_temp":17.9,"wind_spd":5.4,"pop":0,"wind_cdir_full":"west","slp":1006.5,"moon_phase_lunation":0.79,"valid_date":"2022-06-22","app_max_temp":27.6,"vis":24.128,"dewpt":15.1,"snow":0,"uv":11.2,"weather":{"icon":"c02d","code":801,"description":"Few clouds"},"wind_dir":281,"max_dhi":null,"clouds_hi":0,"precip":0,"low_temp":19.1,"max_temp":27.4,"moonset_ts":1655898707,"datetime":"2022-06-22","temp":22,"min_temp":17.9,"clouds_mid":0,"clouds_low":33}],"city_name":"West Jerusalem","lon":"35.21961","timezone":"Asia\/Jerusalem","lat":"31.78199","country_code":"IL","state_code":"06"};
//forecastUpdate(json220619);
//return;

	//const url ="https://api.weatherbit.io/v2.0/forecast/daily?city_id=7498240&days=4&key=5321f849e8a548dcac3f9b0d3b2eab31";
	const url = "http://localhost:8181/Documents/MacroDroid/🖥️/📑/🌡️.json";
	$.get( url, function( data, s, xhr ) {
    	var json = $.parseJSON(xhr.responseText);
		forecastUpdate(json);
    })
    .fail(function(jqXHR, textStatus) {
		$("#forecast").text("forecastInit.get failed. \n🌡️ Rebooting (40s)...");
		setTimeout(forecastInit, 1000*40);
    });

}

var forecast_chart;

function forecastUpdate(json) {

	var images = [];
	var rangeBuilder = [], columnBuilder = [];
	var axisY_max=-100,axisY_min=100;
	 

	if (!json.data) {
		$("#forecast").text("forecastUpdate Error: !json.data");
		return;
	}
	
	
	dataBuilder();

	render();
    
    addImages();
    
    temperatureBar(parseFloat(json.data[0].temp).toFixed(2)); 
    
	
	function dataBuilder () {
		$.each( json.data, function( key, val) {
			axisY_max=val.max_temp>axisY_max?val.max_temp:axisY_max;
			axisY_min=val.min_temp<axisY_min?val.min_temp:axisY_min;
			
			rangeBuilder.push({ 
			    label: (new Date(val.ts*1000))
					.toLocaleDateString('he-IL', { weekday: 'short' }).replace("יום ","").replace("׳",""), 
			    y: [val.min_temp, val.max_temp], 
			    icon: val.icon
			});
		});
		
		Vars['☔'] = false;
		$.each( json.data, function( key, val, i) {
			if (key==1 && val.pop) Vars['☔'] = true;
			
			columnBuilder.push({ 
				//label: val.pop,
				y: [axisY_min,(axisY_max-axisY_min)*val.pop/100+axisY_min]
			});
		});
	}

	function render() {

	    forecast_chart = new CanvasJS.Chart("forecast", {
		//animationEnabled: true,
	      /*title:{
	    	   text: "תחזית מזג אויר"              
	    	},*/
	    	axisY: {
	    		//suffix: " °C",
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
				//labelFontWeight: "bold",
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
	    		//color: "#91AAB1",
	    		indexLabelFormatter: formatter,
	    		//indexLabelFontWeight: "bold",
				indexLabelFontSize: 20,
				indexLabelFontColor: "#E6E6E6",
				lineThickness: 12, 
				dataPoints: rangeBuilder
		    	}, {
				type: "rangeColumn",
	    		//fillOpacity: 0.1,
	    		color: "#1187DC", //128CE4
	    		//indexLabelFontWeight: "normal",
				//indexLabelFontSize: 14,
				//indexLabelFontColor: "#E6E6E6",
				dataPoints: columnBuilder
			}]
	    	}); 

		forecast_chart.render();
	}
     
	function addImages() {
		for(var i = 0; i < forecast_chart.data[0].dataPoints.length; i++){
    		var dpsName = "", dpsIcon=forecast_chart.data[0].dataPoints[i].icon;

			images.push($("<img>").attr("src", Vars.base + "Images/weatherbit/"+dpsIcon+".png").attr("title",dpsIcon));

    		if (dpsIcon.substring(0,1)=="a") dpsName="cloudy"
            else if (dpsIcon.substring(0,1)=="c") dpsName="sunny"
            else dpsName="rainy";
			forecast_chart.data[0].dataPoints[i].name = dpsName;

	        images[i].attr("class", dpsName)
				.appendTo($("#forecast"));//>.canvasjs-forecast_chart-container"));
        	positionImage(images[i], i);
		}
	}
     
	function positionImage(image, index) {
		var imageCenter = forecast_chart.axisX[0].convertValueToPixel(forecast_chart.data[0].dataPoints[index].x);
		var imageTop =  forecast_chart.axisY[0].convertValueToPixel(forecast_chart.axisY[0].maximum);
 
		image.width("40px")
			.css({ "left": imageCenter - 20 + "px",
			"position": "absolute","top":"-30px"});

		index || 
			$("<div>")
			.attr("id","🌡️yesterday")
			.height($("#forecast").height() * 1.5)
			.css({ "left": imageCenter - 24 + "px" })
			.appendTo($("#forecast"));
	}
     

	$( window ).resize(function() {
		var cloudyCounter = 0, rainyCounter = 0, sunnyCounter = 0;    
		var imageCenter = 0;
		for(var i=0;i<forecast_chart.data[0].dataPoints.length;i++) {
			imageCenter = forecast_chart.axisX[0].convertValueToPixel(forecast_chart.data[0].dataPoints[i].x) - 20;
			if(forecast_chart.data[0].dataPoints[i].name == "cloudy") {					
				$(".cloudy").eq(cloudyCounter++).css({ "left": imageCenter});
			} else if(forecast_chart.data[0].dataPoints[i].name == "rainy") {
				$(".rainy").eq(rainyCounter++).css({ "left": imageCenter});  
			} else if(forecast_chart.data[0].dataPoints[i].name == "sunny") {
				$(".sunny").eq(sunnyCounter++).css({ "left": imageCenter});  
			}                
		}
	});


	function formatter(e) { 
		/*if(e.index === 0 && e.dataPoint.x === 0) {
		return " Min " + e.dataPoint.y[e.index] + "°";
		} else if(e.index == 1 && e.dataPoint.x === 0) {
		return " Max " + e.dataPoint.y[e.index] + "°";
		} else {*/
		return e.dataPoint.y[e.index];// + "°";
		//}
	} 

}


// 🗒: called inside canvasjs (hacked)
function strokeStyleGredient(b,d,r,up) {
	try {

	b.stroke();

	for (var g = f = 0; f < d.length - 3; f += 3, g++) {

		b.beginPath();
		b.moveTo(d[f].x, d[f].y);
		r[g] && r[g].newStrokeStyle && (b.strokeStyle = r[g].newStrokeStyle);
		r[g] && r[g].newLineDashArray && b.setLineDash(r[g].newLineDashArray);
		b.bezierCurveTo(d[f + 1].x, d[f + 1].y, d[f + 2].x, d[f + 2].y, d[f + 3].x, d[f + 3].y);
		
		var dataPoints = forecast_chart.data[0].dataPoints;
		var n1 = dataPoints[g].y[up];
		var n2 = dataPoints[g+1].y[up];

		var gradient = b.createLinearGradient(d[f].x, d[f].y, d[f+3].x, d[f+3].y);
		gradient.addColorStop(0, GredientConverter.toTemperature(n1));
		gradient.addColorStop(1, GredientConverter.toTemperature(n2)); 
		b.strokeStyle = gradient;

		b.stroke();
	}

	} catch(e) { alert(e); }

} 



function temperatureBar(t) {
	try {
	
	var canvas = $("#🌡️")
		.html("<canvas id='temperatureBar' width='100%' height='100%'></canvas>");
	// bug 🐛
	$("#temperatureBar")
		.attr('width',canvas.width())
		.attr('height',canvas.height());

	var ctx = document.getElementById("temperatureBar")
		.getContext("2d");
	var width = canvas.width(), height = canvas.height(), 
		margin = 5, stops = GredientConverter.maxTemperature()/10, 
		section = (height - margin*2)/10; 
	
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
	mark ("5","#AAA");
	mark ("3","#FFF");
	
	
	$("<span>")
		.html(parseInt(t)+'°')
		.appendTo("#🌡️");

	} catch(e) { alert(e); }


	function mark(lineWidth,strokeStyle) {
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
} 


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
		//$("#log").html(color+"<br>"+$("#log").html());
		return "#" + this.colors()[color];
	}  
}