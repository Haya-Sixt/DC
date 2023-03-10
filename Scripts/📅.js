// 1.
(()=>{

// Date Loazi
const wdgt = new $app.Widget('馃搮馃憠');

//
wdgt.Init = ()=> {
	var date = new Date().toLocaleDateString('he-IL', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace("讬讜诐 ","").replace('.','/'); 
	$(wdgt.sid).text(date);
};

})();


// 2.
(()=>{

// Date Hebrew
const wdgt = new $app.Widget('馃搮馃憟');

//
wdgt.Init = ()=> {
	wdgt.data = { 
		year: new Intl.DateTimeFormat('he-u-ca-hebrew',{year:'numeric'}).format(new Date()),
		month: wdgt.Month(new Date()) 
	};
};
	
//
wdgt.Update = ()=> {
	var seven = !(wdgt.data.year % 7) ? '砖谞转 砖诪讬讟讛' : '砖谞讛 ' + String.fromCharCode((wdgt.data.year % 7) + '讗'.charCodeAt(0) - 1) + "'", 
		leap = '' + ([0,3,6,8,11,14,17].includes(wdgt.data.year % 19) ? '诪注讜讘专转' : '驻砖讜讟讛');
	
	$(wdgt.sid).text( wdgt.data.month + '  ' + wdgt.data.year + '  ' + seven + '  ' + leap );
};

//
wdgt.Month = (now)=> {
	let m = new Intl.DateTimeFormat('he-u-ca-hebrew',{month:'long'}).format(now);
	if (m.includes('讻住诇讜')) m = '讻住诇讬讜';
	if (m.includes('讗讚专 ')) m = m.slice(0, m.length-1) + "'";
	return m;
	};

})();


// 3. 
(()=>{

	// Calendar
	const wdgt = new $app.Widget('馃棑锔?');
	wdgt.dependency = ['馃搮馃憟'];
	
	//
	wdgt.url = ()=> [
		`/${wdgt.id}_${$app.Widgets['馃搮馃憟'].data.year}_${$app.Widgets['馃搮馃憟'].data.month}.htm`,
		`/${wdgt.id}_${Next().year}_${Next().month}.htm`
	];
	
	//
	function Next() {
		var now = new Date(), month, monthNext;
		month = monthNext = $app.Widgets['馃搮馃憟'].data.month;
		while (month == monthNext) {
			now.setDate(now.getDate()+1); 
			monthNext = $app.Widgets['馃搮馃憟'].Month(now);
		}
		yearNext = new Intl.DateTimeFormat('he-u-ca-hebrew',{year:'numeric'}).format(now);
		return {"month":monthNext,"year":yearNext};
	}
	
	//
	wdgt.Update = ()=> {
		var t1 = wdgt.data[0].replaceAll("tdCurrent",""),
			t2 = wdgt.data[1].replaceAll("tdCurrent","");
				
		// NOTE:  On month 'Eyar' the last row was all marked by ' tdUnused' (on all 7 td),
		// 		so need to be removed also.
		if (t1.substring(t1.lastIndexOf("<tr")).indexOf(" tdUsed") ==-1) 
			// remove empty row
			t1 = t1.substring(0,t1.lastIndexOf("<tr"));
	
		// remove header of next month
		t2 = (t2 = t2.substring( t2.indexOf("<tr")+3)).substring( t2.indexOf("<tr"));
		// remove empty row
		t2 = t2.substring(0,t2.lastIndexOf("<tr"));
		
		// merge two months
		var r1last = t1.substring(t1.lastIndexOf("<tr"));
		var r2first = t2.substring(0,t2.indexOf("</tr>")+5);
		var u=0, rU = t2.substring(0,t2.indexOf("<td "));
		for (var i=0; i<7; i++) {
			var td1 = r1last.substring(r1last.indexOf("<td "), r1last.indexOf("</td>")+5);
			r1last = r1last.replace(td1,"");
			var td2 = r2first.substring(r2first.indexOf("<td "), r2first.indexOf("</td>")+5);
			r2first = r2first.replace(td2,"");
			if (td1.indexOf(" tdUnused")!=-1) {
				rU += td2;
				u=1; 
			} else { 
				rU += td1;
			}
		}
		if (u) {
			t1 = t1.substring(0,t1.lastIndexOf("<tr"))
				+ rU + "</tr>";
			t2 = t2.substring( t2.indexOf("</tr>")+5);
		}
		const j = (i, o)=> { t = t.replaceAll(i, (o == '' || o.startsWith('<') || !o.match(Helpers.Emoji())) ? o : `<imo>${o}</imo>`) };
		let t = (t1+t2)
		j("讻谞讬住转 ","")
		j("爪讗转 ","")
		j("砖讘转:","")
		j("讛讞讙:","")
		j("讛爪讜诐:","")
		j("讚专讗砖","专讗砖")
		j("注专讘 专讗砖 讞讜讚砖","")
		j("讗' 专讗砖 讞讜讚砖","馃寬")
		j("讗' 讚专\"讞","馃寬") // (讞谞讜讻讛)
		j("讘' 专讗砖 讞讜讚砖","馃寴")
		j("讘' 讚专\"讞","馃寴") // (讞谞讜讻讛)
		j("专讗砖 讞讜讚砖","馃寫")
		j(" 诇注讜诪专","<span name='omer'>馃尵</span>")
		j("讬讜诐 讛讝讻专讜谉 诇砖讜讗讛 讜诇讙讘讜专讛","馃彺鈥嶁槧锔?")
		j("讬讜诐 讛讝讻专讜谉","馃獤")
		j("讬讜诐 讛注爪诪讗讜转","馃嚠馃嚤")
		j(" 诪讜拽讚诐","馃悋")
		j("转注谞讬转 砖谞讬","馃毐")
		j("转注谞讬转 讞诪讬砖讬","馃毐")
		j(" 拽诪讗","")
		j(" 讘转专讗","")
		j("驻住讞 砖谞讬","馃馃Ε")
		j("诇\"讙 讘注讜诪专","馃敟")
		j("讬讜诐 讬专讜砖诇讬诐","馃彴")
		j("注专讘 讞讙 讛砖讘讜注讜转","")
		j("注专讘 讞讙 讛住讜讻讜转","")
		j("注专讘 讞讙 讛驻住讞","")
		j("讞讙 讛","")
		j("砖讘讜注讜转","馃摐")
		j("爪讜诐 讬\"讝 讘转诪讜讝","馃毐")
		j("谞讚讞讛","馃Ε")
		j("砖讘转 讞讝讜谉","馃暥锔?")
		j("转砖注讛 讘讗讘","馃毐")
		j("讞诪砖讛 注砖专 讘讗讘","馃挄")
		j("讗' 讚住诇讬讞讜转 诇注讚讜转 讛诪讝专讞","馃檱")
		j("讗' 讚住诇讬讞讜转 诇讗砖讻谞讝讬诐","馃檱馃徎")
		j("注专讘 专讗砖 讛砖谞讛","")
		j("讗' 专讗砖 讛砖谞讛","馃憫")
		j("讘' 专讗砖 讛砖谞讛","馃憫")
		j("爪讜诐 讙讚诇讬讛","馃毐")
		j("注专讘 讬讜诐 讛讻讬驻讜专讬诐","")
		j("讬讜诐 讛讻讬驻讜专讬诐","鈿栵笍")
		j('砖讘转 讞讜讛"诪 驻住讞',"")
		j('砖讘转 讞讜讛"诪 住讜讻讜转',"")
		j("讞讜诇 讛诪讜注讚 ","")
		j("住讜讻讜转","馃崑")
		j("讛讜砖注谞讗 专讘讛","馃尶")
		j("砖诪讞转 转讜专讛","馃帀")
		j("讗住专讜 讞讙","馃悘")
		j("砖讘转 讞谞讜讻讛","")
		j("讝讗转 讞谞讜讻讛","馃晭")
		j("讞谞讜讻讛","馃晭")
		j("爪讜诐 注砖专讛 讘讟讘转","馃毐")
		j("砖讘转 砖讬专讛","馃帳")
		j("专讗砖 讛砖谞讛 诇讗讬诇谞讜转","馃尡")
		j("砖讘转 砖拽诇讬诐","馃挵")
		j("砖讘转 讝讻讜专","馃泙")
		j("驻讜专讬诐","馃ジ")
		j("砖讜砖谉 ","")
		j(" 拽讟谉","")
		j("转注谞讬转 讗住转专","馃毐")
		j("砖讘转 驻专讛","馃惍")
		j("砖讘转 讛讞讜讚砖","馃憫")
    j("注讜讘专讬诐 诇","") // 砖注讜谉 拽讬抓
		j("砖讘转 讛讙讚讜诇","馃悜")
		j("砖讘讬注讬 砖诇 驻住讞","馃寠")
		j("驻住讞","馃珦")
			
		// show only 4 rows
		var t4 = t.substring(0, t.indexOf("</tr>")+5)
			current = hebDay();
		
		for (var i=0,show=0; i<12 && show<5; i++) {
			var itr = t.indexOf("<tr");
			if (itr==-1) break;
			var tr = t.substring(itr, t.indexOf("</tr>")+5);
			t = t.replace(tr,"");
			
			if (show || tr.indexOf(current)!=-1) {
				t4 += tr;
				show++;
			}
		}
		t4 = "<table>" + t4 + "</table>";
		
		// 
		$(wdgt.sid).html(t4);
		
		// current 
		$(wdgt.sid + ' .tdDay').each((i, t)=> {
			if ($(t).html().indexOf(current)!=-1) {
				$(t).addClass('tdCurrent');
				return false;
			}
		});
		
		// omer 
		$(wdgt.sid + ' span[name=omer]').parent().addClass('omer');
	
		// daf yomi
		$( window ).resize(function() {
			$(wdgt.sid + ' .dafYomi').width($(wdgt.sid + ' .tdCurrent').width());
		});
	};
	
	function hebDay() {
		var d = parseInt(new Intl.DateTimeFormat('he-u-ca-hebrew',{day:'numeric'}).format(new Date()) ), hd="";
		if (d>=30) {
				hd="诇";
				d-=30;
		} else if (d>=20) {
				hd="讻";
				d-=20;
		} else if (d>=10) {
				hd="讬";
				d-=10;
		} 
		hd+=d?String.fromCharCode(d + '讗'.charCodeAt(0) - 1):'';
		if (hd=='讬讛') hd='讟讜'
		else if (hd=='讬讜') hd='讟讝';
		if (hd.length>1) hd = hd.slice(0, 1) + '"' + hd.slice(1)
		else hd += "'";
		return '<span class="hebdate">' + hd; 
	}
	
})();


// 4.
(()=>{

// Times
const wdgt = new $app.Widget('馃搯');
wdgt.dependency = ['馃棑锔?'];

//
wdgt.url = ()=> `/times_${$app.Widgets['馃搮馃憟'].data.year}_${$app.Widgets['馃搮馃憟'].data.month}.htm`;

//
wdgt.Update = ()=> {
	let times = '', ldate = new Date().toLocaleDateString('he-IL').replace('.','/').replace('.','/'),
		trH = wdgt.data.substring(wdgt.data.indexOf("<td"),wdgt.data.indexOf("</tr")), 
		trT = wdgt.data.substring(wdgt.data.indexOf(ldate));
	trH = trH.replaceAll(' class="tdHead visible ','').replaceAll('type-date"','').replaceAll('type-time"','').replaceAll('type-limud"','').replaceAll('</td><td>','|').replaceAll('<td>','').replaceAll('</td>','').split('|'); 
	trT = trT.substring(0, trT.indexOf("</tr")).replaceAll('</td><td>','|').replaceAll('</td>','').split('|');
		
	for (var i=0; i<trH.length; i++) {
		switch (trH[i]) {
		case "注诇讜转 讛砖讞专": td("馃彊锔?"); break;
		case "讝诪谉 讟诇讬转 讜转驻讬诇讬谉": td("馃珎"); break;
		case "讛谞抓 讛讞诪讛": td("馃寗"); break;
		case '住讜"讝 拽"砖 诇诪讙"讗': td("馃洝锔?"); break;
		case '住讜"讝 拽"砖 诇讙专"讗': td("馃憫"); break;
		case '住讜"讝 转驻讬诇讛 诇诪讙"讗': td("馃洝锔?"); break;
		case '住讜"讝 转驻讬诇讛 诇讙专"讗': td("馃檹"); break;
		case "讞爪讜转": td("鉁达笍"); break;
		case "诪谞讞讛 讙讚讜诇讛": td("馃尵"); break;
		case "驻诇讙 讛诪谞讞讛": td("馃"); break;
		case "砖拽讬注讛": td("馃寚"); break;
		case "爪讗转 讛讻讜讻讘讬诐": td("馃寖"); break;
		case "讚祝 讬讜诪讬 讘讘诇讬": tdDafYomi(); break;
		}
	}

	times = "<table>"+times+"</table>";
	$(wdgt.sid).html(times);

	// 馃寚
	var shm = $(wdgt.sid + " td:contains(馃寚)").next().text().split(':');
		($app.Vars['馃寚']=new Date()).setHours(shm[0], shm[1], 0, 0);
		$app.Vars['馃寚'] = parseInt(new Date($app.Vars['馃寚']).getTime()/1000);
	
	// daf yomi
	$(wdgt.sid + ' .dafYomi').width($('#馃棑锔? .tdCurrent').width())
		.appendTo('#馃棑锔? .tdCurrent');  // 馃棐: '.detach()' not needed

	// Mark Current Zman
	setInterval(Mark, 1000*60*3); 
	Mark();


	//
	function td(emoji) {
		times += '<tr><td class="馃搯name">'+emoji+'</td><td class="馃搯val">'+trT[i]+'</td></tr>';
	}

	//
	function tdDafYomi() {
		times += '<tr><td class="馃搯name"></td><td class="馃搯val"><div class="dafYomi">'+trT[i]+'</div></td></tr>';
	}
};

//
function Mark() {
	var now = parseInt( new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }).replace(':','') ); 
	var first = null;

	$(wdgt.sid + " td.馃搯val").each((i, t)=> {
		var v = parseInt( $(t).text().replace(':','') );
		if ( now <= v && !first) {
			first = $(t).parent();
			if (v - now <= 3) Countdown.Start ((v - now)*100);
		} else {
			$(t).parent().removeClass('markIconText');
		}
	});
	if (first ) {
		first.addClass('markIconText'); 
	}
}  

})();