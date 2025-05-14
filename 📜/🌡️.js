
// 1.
(()=>{

// Forecast
const wdgt = new $app.Widget('🌡️', {
	http: true, 
	// repeat️: been initiated by '$app.Service ('🤖')'
});
	
let chart, splineBuilder, columnBuilder, axisY_max = -100, axisY_min = 100;

//{"data":[{"moonrise_ts":1655587278,"wind_cdir":"WNW","rh":53,"pres":935.7,"high_temp":29,"sunset_ts":1655657353,"ozone":288.9,"moon_phase":0.582192,"wind_gust_spd":11.6,"snow_depth":0,"clouds":0,"ts":1655622060,"sunrise_ts":1655606026,"app_min_temp":18.8,"wind_spd":4.5,"pop":0,"wind_cdir_full":"west-northwest","slp":1010.8,"moon_phase_lunation":0.69,"valid_date":"2022-06-19","app_max_temp":29.4,"vis":24.128,"dewpt":14.4,"snow":0,"uv":2,"weather":{"icon":"c01d","code":800,"description":"Clear Sky"},"wind_dir":300,"max_dhi":null,"clouds_hi":0,"precip":0,"low_temp":17.8,"max_temp":29,"moonset_ts":1655628794,"datetime":"2022-06-19","temp":25.3,"min_temp":18.8,"clouds_mid":0,"clouds_low":5},
//{"moonrise_ts":1655851715,"wind_cdir":"W","rh":68,"pres":934.4,"high_temp":27.4,"sunset_ts":1655916589,"ozone":293.2,"moon_phase":0.266352,"wind_gust_spd":10.2,"snow_depth":0,"clouds":9,"ts":1655845260,"sunrise_ts":1655865263,"app_min_temp":17.9,"wind_spd":5.4,"pop":0,"wind_cdir_full":"west","slp":1006.5,"moon_phase_lunation":0.79,"valid_date":"2022-06-22","app_max_temp":27.6,"vis":24.128,"dewpt":15.1,"snow":0,"uv":11.2,"weather":{"icon":"c02d","code":801,"description":"Few clouds"},"wind_dir":281,"max_dhi":null,"clouds_hi":0,"precip":0,"low_temp":19.1,"max_temp":27.4,"moonset_ts":1655898707,"datetime":"2022-06-22","temp":22,"min_temp":17.9,"clouds_mid":0,"clouds_low":33}],"city_name":"West Jerusalem","lon":"35.21961","timezone":"Asia\/Jerusalem","lat":"31.78199","country_code":"IL","state_code":"06"};


//
wdgt.Update = ()=> {
	Data ();
	Configure ();
	chart.Render ();
};


//
function Data () {
	splineBuilder = [];
	let i = 0;
	$.each( wdgt.data.data, function( key, val) {
		axisY_max=val.max_temp>axisY_max?val.max_temp:axisY_max;
		axisY_min=val.min_temp<axisY_min?val.min_temp:axisY_min;
		
		splineBuilder.push({ 
			label: (new Date(val.ts*1000)).toLocaleDateString('he-IL', { weekday: 'short' }).replace("יום ","").replace("׳","").replace ("שבת",'<tspan dx="25">🕯🕯</tspan>'), 
			x: i++,
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
	
	
	// 🚥
	function Pop (p) {
		const pop = [null, '☂️', '☔', '⚡', '❄️'];
		p = pop[ Math.ceil( p / (100 / (pop.length - 1) ) ) ];
		$app.Widgets['🚥']?.Remove (wdgt.id);
		p && $app.Widgets['🚥']?.Add (wdgt.id, p);
	}
}

//
function Configure () {
	const f = (i, dp, mn)=> '12'.includes(i) ? Math.round(dp [i].y[mn]) : '';

	chart = wdgt.data.chart = new Chart ({
		sid: wdgt.sid,
		
		axisY: {
			minimum: axisY_min-4,
			maximum: axisY_max+6,
		},
		axisX: {
			labelFontSize: 30,
		},
		data: [{
			type: "Spline",
			labelFontSize: 30,
			labelFormatter: f,
			iconSize: 50,
			dataPoints: splineBuilder
			}, {
			type: "Column",
			color: "#1187DC", // 🗒: Hard-coded rain color (therefore not in css)
			dataPoints: columnBuilder
		}]
	});
}


//
class Chart {
	
	constructor (i_chart) {
		this.ct = i_chart
	}
	 
	Render () {
		const ct = this.ct, axisY = ct.axisY, axisX = ct.axisX, d_main = ct.data.find ((e)=> e.type == 'Spline'), 
			vb = {w: 460, get h() {return 280}, get d() {return vb.h/10}, get cw() {return vb.w/(d_main.dataPoints.length*2)}, get icons () {return {h: 1.5*vb.d}}, get graph () {return {h: 7.5*vb.d}}, get axisX () {return {h: vb.d}}},
			svg = ct.svg = $('<svg>').attr ("xmlns", "http://www.w3.org/2000/svg").attr ("viewBox", `0 0 ${vb.w} ${vb.h}`).attr ("style", "display: block; width: 100%; height: 100%;"),
			G = (c)=> $('<g>').appendTo (svg).addClass (c),
			X = (i)=> { return (i*2+1)*vb.cw },
			Lable = (g, l, i, size, y, dx)=> l && $("<text>").appendTo (g).html (l).attr ("x", X(i) + (size/2)).attr ("y", y).attr ("font-size", size).attr ("dx", dx ? dx : 0);
		
		Icons (d_main);
		
		ct.data.forEach ((d)=>{
			d.type == "Spline" && Spline (d);
			d.type == "Column" && Column (d);
		});
		
		AxisX (d_main);
		
		DimTodayColumn ();
		
		//
	    $(ct.sid).html(`${ct.svg.prop('outerHTML')}<div class='${ct.sid.slice (1)}overlay'></div>`); 
	    
	    
	//
	function Spline (d) {
		const dp = d.dataPoints, g = G ('Spline'), 
			strokeW = 20, dm = [], LG = (mn, o)=> o ? (mn ? lg1 : lg0) : `${ct.sid.slice (1)}_def_lg${mn}`,
			lg0 = $("<linearGradient>").attr ("id",LG(0)).attr ("x1","0").attr ("x2","100%").attr ("y1","0").attr ("y2","0").appendTo ($("<defs>").appendTo (g)),
			lg1 = lg0.clone ().attr ("id",LG(1)).appendTo (lg0.parent ()),
			Path = (mn)=> $("<path>").appendTo (g).attr ("d", dm [mn]).attr ("fill",`url(#${LG(mn)})`).attr ("stroke-width", 0), 
			Stop = (i, mn)=> $("<stop>").appendTo (LG (mn, 1)).attr ("offset", `${X(i)/vb.w*100}%`).attr ("stop-color", GredientConverter.toTemperature(dp[i].y[mn])),
			Y = (deg, ltr)=> { return  vb.icons.h + vb.graph.h - (deg - axisY.minimum)/(axisY.maximum - axisY.minimum)*vb.graph.h + ltr*strokeW/2},
			D = (i, mn, ltr = -1, m)=> m === 1 ? `M ${vb.cw} ${Y(dp[0].y[mn], ltr)}${D (i, mn, ltr, 2)}` : ` S ${X(i) + (!m ? ltr*vb.cw : 0)} ${Y(dp[i].y[mn], ltr)} ${X(i) + (m === 2 ? vb.cw/-2 : 0)} ${Y(dp[i].y[mn], ltr)}`;
		
		// 
		for (let i = 0; i < dp.length; i++)
			for (let j = 0; j < 2; j++) {
				!i && dm.push (D(i, j, 1, 1));
				dm [j] += D (i, j);
				Stop (i, j);
			}
		for (let i = dp.length - 1; i >= 0; i--)
			for (let j = 0; j < 2; j++) {
				dm [j] += D (i, j, 1);
				!i && Path (j);
			}
			
		// Lbl
		for (let i = 0; i < dp.length; i++) 
		  for (let j = 0; j < 2; j++) {
		  	const l = d.labelFormatter (i, dp, j);
		  	Lable (g, l, i, d.labelFontSize, Y(dp [i].y [j], -2));
		  	Lable (g, "⚫", i, strokeW/3 , Y(dp [i].y [j], 5/strokeW));
			}
	}
		
	//
	function Column (d) {
		const dp = d.dataPoints, g = G ('Column'), paddingW = 0.4,
			Y = (deg)=> { return  vb.icons.h + vb.graph.h - (deg - axisY.minimum)/(axisY.maximum - axisY.minimum)*vb.graph.h}, 
			Rect = (i, mn, mx)=> (mn != mx) && $("<rect>").appendTo (g).attr ("x", X(i) - vb.cw*(1-paddingW)).attr ("width", vb.cw*(2-paddingW*2)).attr ("y", Y(mx)).attr ("height", Y(mn) - Y(mx)).attr ("rx", 10).attr ("opacity", 0.6).attr ("fill", d.color).attr ("stroke-width",0);
			
		for (let i = 0; i < dp.length; i++) {
			Rect (i, dp [i].y [0], dp [i].y [1]);
		}
	}
		
	//
	function AxisX (d) {
		const dp = d.dataPoints, g = G ('AxisX');
		for (let i = 0; i < dp.length; i++) {
			Lable (g, dp [i].label, i, axisX.labelFontSize, vb.h-8);
		}
	}
	
	//
	function Icons (d) {
		const dp = d.dataPoints, g = G ('Icons'),
		  c_icons = [['☀️',['c01']],
			['🌤️',['c02']], ['⛅',['c']], ['☁️',['a']], ['🌦',['r01','r04','r05','t01','t02']], ['🌧️',['d','f','r','u']], ['⛈️',['t']], ['🌨️',['s']]],
		  Icon = (c) => {
				for (let i = 0; i < c_icons.length; i++) {
					for (let j = 0; j < c_icons[i][1].length; j++) {
						if (c.startsWith(c_icons[i][1][j])) return c_icons[i][0];
					}
				}
			};
		for (let i = 0; i < dp.length; i++) {
			Lable (g, Icon (dp [i].icon), i, d.iconSize, d.iconSize, d.iconSize/6);
		}
	}
	
	// 
	function DimTodayColumn () {
		$("<rect>").appendTo (G ('DimTodayColumn')).attr ("x", vb.cw*2).attr ("width", vb.cw*2).attr ("height", vb.h).attr ("rx", 5).attr ("opacity", 0.3).attr ("fill",`white`).attr ("stroke-width",0);
	} 
	
	} // Render
} // Chart


})();


// 2.
(()=>{

// Temperature
const wdgt = new $app.Widget('💈', {
	dependency: { init: ['🪵'] },
});

// 
wdgt.Init = ()=> {
	wdgt.data = parseInt($app.Widgets['🪵'].data[wdgt.id]);
};

//
wdgt.Update = ()=> {
	const vb = {w: 15, get h() {return 100}, get d() {return vb.h/10}, get graph () {return {h: 8.5*vb.d}}, get axisX () {return {h: 1.5*vb.d}}}, 
		svg = $('<svg>').appendTo (wdgt.sid).attr ("xmlns", "http://www.w3.org/2000/svg").attr ("viewBox", `0 0 ${vb.w} ${vb.h}`).attr ("style", "display: block; width: 100%; height: 100%;"),
		g = $('<g>').appendTo (svg), c_id_lg = `${wdgt.sid}_def_lg`, graphW = 2, paddingH = 15, paddingW = (vb.w - graphW)/2, fontSize = vb.w - 4;
	
	// gradient
	$("<linearGradient>").appendTo ($("<defs>").appendTo (g)).attr ("id", c_id_lg.slice (1)).attr ("x1","0").attr ("x2","0").attr ("y1","0").attr ("y2","100%");
	for (let i = 0; i < GredientConverter.maxTemperature(); i++) {
		$("<stop>").appendTo (c_id_lg).attr ("offset", `${(i+1)/GredientConverter.maxTemperature()*100}%`).attr ("stop-color", GredientConverter.toTemperature(i));
	}
	// graph
	$("<rect>").appendTo (g).attr ("x", paddingW).attr ("width", vb.w - paddingW*2).attr ("y", paddingH).attr ("height", vb.graph.h - paddingH).attr ("fill", `url(${c_id_lg})`).attr ("stroke-width",0);
	// mark
	$("<text>").appendTo (g).html ('⚫').attr ("x", vb.w - graphW*1.2).attr ("y", (Math.min (GredientConverter.maxTemperature(), Math.max (0, wdgt.data))+1)/GredientConverter.maxTemperature()*vb.graph.h).attr ("font-size", graphW*4);
	// °
	$("<text>").appendTo (svg).html (wdgt.data).attr ("x", vb.w).attr ("y", vb.graph.h + paddingW).attr ("font-size", fontSize);
	//
	$(wdgt.sid).html($(wdgt.sid ).html()); // 🥝🐛?
	
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
