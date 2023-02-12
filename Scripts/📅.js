// Import
document.querySelector('html').$app.Import();

// 1.
(()=>{

// Date Loazi
const wdgt = new $app.Widget('📅👉');

//
wdgt.Init = ()=> {
	var date = new Date().toLocaleDateString('he-IL', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace("יום ","").replace('.','/'); 
	$(wdgt.sid).text(date);
};

})();


// 2.
(()=>{

// Date Hebrew
const wdgt = new $app.Widget('📅👈');

//
wdgt.Init = ()=> {
	wdgt.data = { 
		year: new Intl.DateTimeFormat('he-u-ca-hebrew',{year:'numeric'}).format(new Date()),
		month: wdgt.Month(new Date()) 
	};
};
	
//
wdgt.Update = ()=> {
	var seven = !(wdgt.data.year % 7) ? 'שנת שמיטה' : 'שנה ' + String.fromCharCode((wdgt.data.year % 7) + 'א'.charCodeAt(0) - 1) + "'", 
		leap = '' + ([0,3,6,8,11,14,17].includes(wdgt.data.year % 19) ? 'מעוברת' : 'פשוטה');
	
	$(wdgt.sid).text( wdgt.data.month + '  ' + wdgt.data.year + '  ' + seven + '  ' + leap );
};

//
wdgt.Month = (now)=> {
	let m = new Intl.DateTimeFormat('he-u-ca-hebrew',{month:'long'}).format(now);
	if (m.includes('כסלו')) m = 'כסליו';
	if (m.includes('אדר ')) m = m.slice(0, m.length-1) + "'";
	return m;
	};

})();


// 3. 
(()=>{

	// Calendar
	const wdgt = new $app.Widget('🗓️');
	wdgt.dependency = ['📅👈'];
	
	//
	wdgt.url = ()=> [
		`/${wdgt.id}_${$app.Widgets['📅👈'].data.year}_${$app.Widgets['📅👈'].data.month}.htm`,
		`/${wdgt.id}_${Next().year}_${Next().month}.htm`
	];
	
	//
	function Next() {
		var now = new Date(), month, monthNext;
		month = monthNext = $app.Widgets['📅👈'].data.month;
		while (month == monthNext) {
			now.setDate(now.getDate()+1); 
			monthNext = $app.Widgets['📅👈'].Month(now);
		}
		yearNext = new Intl.DateTimeFormat('he-u-ca-hebrew',{year:'numeric'}).format(now);
		return {"month":monthNext,"year":yearNext};
	}
	
	//
	wdgt.Update = ()=> {
		var tHTML1 = wdgt.data[0].replaceAll("tdCurrent",""),
			tHTML2 = wdgt.data[1].replaceAll("tdCurrent","");
				
		// NOTE:  On month 'Eyar' the last row was all marked by ' tdUnused' (on all 7 td),
		// 		so need to be removed also.
		if (tHTML1.substring(tHTML1.lastIndexOf("<tr")).indexOf(" tdUsed") ==-1) 
			// remove empty row
			tHTML1 = tHTML1.substring(0,tHTML1.lastIndexOf("<tr"));
	
		// remove header of next month
		tHTML2 = (tHTML2 = tHTML2.substring( tHTML2.indexOf("<tr")+3)).substring( tHTML2.indexOf("<tr"));
		// remove empty row
		tHTML2 = tHTML2.substring(0,tHTML2.lastIndexOf("<tr"));
		
		// merge two months
		var r1last = tHTML1.substring(tHTML1.lastIndexOf("<tr"));
		var r2first = tHTML2.substring(0,tHTML2.indexOf("</tr>")+5);
		var u=0,rU = tHTML2.substring(0,tHTML2.indexOf("<td "));
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
			tHTML1 = tHTML1.substring(0,tHTML1.lastIndexOf("<tr"))
				+ rU + "</tr>";
	
			tHTML2 = tHTML2.substring( tHTML2.indexOf("</tr>")+5);
		}
		let j = (j)=>`<imo>${j}</imo>`,
			tHTML = (tHTML1+tHTML2)
			.replaceAll("כניסת ","").replaceAll("צאת ","")
			.replaceAll("שבת:","")
			.replaceAll("החג:","")
			.replaceAll("הצום:","")
			.replaceAll("דראש","ראש")
			.replaceAll("ערב ראש חודש","")
			.replaceAll("א' ראש חודש",j("🌒"))
			.replaceAll("א' דר\"ח",j("🌒")) // (חנוכה)
			.replaceAll("ב' ראש חודש",j("🌘"))
			.replaceAll("ב' דר\"ח",j("🌘")) // (חנוכה)
			.replaceAll("ראש חודש",j("🌑"))
			.replaceAll(" לעומר","<span name='omer'>🌾</span>")
			.replaceAll("יום הזכרון לשואה ולגבורה",j("🏴‍☠️"))
			.replaceAll("יום הזכרון",j("🪖"))
			.replaceAll("יום העצמאות",j("🇮🇱"))
			.replaceAll(" מוקדם",j("🐇"))
			.replaceAll("תענית שני",j("🚱"))
			.replaceAll("תענית חמישי",j("🚱"))
			.replaceAll(" קמא","")
			.replaceAll(" בתרא","")
			.replaceAll("פסח שני",j("🧇🦥"))
			.replaceAll("ל\"ג בעומר",j("🔥"))
			.replaceAll("יום ירושלים",j("🏰"))
			.replaceAll("ערב חג השבועות","")
			.replaceAll("ערב חג הסוכות","")
			.replaceAll("ערב חג הפסח","")
			.replaceAll("חג ה","")
			.replaceAll("שבועות",j("📜"))
			.replaceAll('צום י"ז בתמוז',j("🚱"))
			.replaceAll("נדחה",j("🦥"))
			.replaceAll("שבת חזון","חזון")
			.replaceAll("תשעה באב",j("🚱"))
			.replaceAll("חמשה עשר באב",j("💕"))
			.replaceAll("א' דסליחות לעדות המזרח",j("🙇"))
			.replaceAll("א' דסליחות לאשכנזים",j("🙇🏻"))
			.replaceAll("ערב ראש השנה","")
			.replaceAll("א' ראש השנה",j("👑"))
			.replaceAll("ב' ראש השנה",j("👑"))
			.replaceAll("צום גדליה",j("🚱"))
			.replaceAll("ערב יום הכיפורים","")
			.replaceAll("יום הכיפורים",j("⚖️"))
			.replaceAll("סוכות",j("🍋"))
			.replaceAll("חול המועד ","")
			.replaceAll('שבת חוה"מ',"")
			.replaceAll("הושענא רבה",j("🌿"))
			.replaceAll("שמחת תורה",j("🎉"))
			.replaceAll("אסרו חג",j("🐑"))
			.replaceAll("שבת חנוכה","")
			.replaceAll("זאת חנוכה",j("🕎"))
			.replaceAll("חנוכה",j("🕎"))
			.replaceAll("צום עשרה בטבת",j("🚱"))
			.replaceAll("שבת שירה",j("🎤"))
			.replaceAll("ראש השנה לאילנות",j("🌱"))
			.replaceAll("שבת שקלים",j("💰"))
			.replaceAll("שבת זכור",j("🛀"))
			.replaceAll("פורים",j("🥸"))
			.replaceAll("שושן פורים",j("🥸"))
			.replaceAll(" קטן","")
			.replaceAll("תענית אסתר",j("🚱"))
			.replaceAll("שבת פרה",j("🐮"))
			.replaceAll("שבת ויקהל",j("👨‍👩‍👧‍👦"))
			.replaceAll("פסח",j("🍪"))
			.replaceAll("שביעי של פסח",j("🌊"));
			
			
		// show only 4 rows
		var tHTML4 = tHTML.substring(0, tHTML.indexOf("</tr>")+5)
			current = hebDay();
		
		for (var i=0,show=0; i<12 && show<5; i++) {
			var itr = tHTML.indexOf("<tr");
			if (itr==-1) break;
			var tr = tHTML.substring(itr, tHTML.indexOf("</tr>")+5);
			tHTML = tHTML.replace(tr,"");
			
			if (show || tr.indexOf(current)!=-1) {
				tHTML4 += tr;
				show++;
			}
		}
		tHTML4 = "<table>" + tHTML4 + "</table>";
		
		// 
		$(wdgt.sid).html(tHTML4);
		
		// current 
		$(wdgt.sid + ' .tdDay').each(function() {
			if ($(this).html().indexOf(current)!=-1) {
				$(this).addClass('tdCurrent');
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
				hd="ל";
				d-=30;
		} else if (d>=20) {
				hd="כ";
				d-=20;
		} else if (d>=10) {
				hd="י";
				d-=10;
		} 
		hd+=d?String.fromCharCode(d + 'א'.charCodeAt(0) - 1):'';
		if (hd=='יה') hd='טו'
		else if (hd=='יו') hd='טז';
		if (hd.length>1) hd = hd.slice(0, 1) + '"' + hd.slice(1)
		else hd += "'";
		return '<span class="hebdate">' + hd; 
	}
	
})();


// 4.
(()=>{

// Times
const wdgt = new $app.Widget('📆');
wdgt.dependency = ['🗓️'];

//
wdgt.url = ()=> `/times_${$app.Widgets['📅👈'].data.year}_${$app.Widgets['📅👈'].data.month}.htm`;

//
wdgt.Update = ()=> {
	let times = '', ldate = new Date().toLocaleDateString('he-IL').replace('.','/').replace('.','/'),
		trH = wdgt.data.substring(wdgt.data.indexOf("<td"),wdgt.data.indexOf("</tr")), 
		trT = wdgt.data.substring(wdgt.data.indexOf(ldate));
	trH = trH.replaceAll(' class="tdHead visible ','').replaceAll('type-date"','').replaceAll('type-time"','').replaceAll('type-limud"','').replaceAll('</td><td>','|').replaceAll('<td>','').replaceAll('</td>','').split('|'); 
	trT = trT.substring(0, trT.indexOf("</tr")).replaceAll('</td><td>','|').replaceAll('</td>','').split('|');
		
	for (var i=0; i<trH.length; i++) {
		switch (trH[i]) {
		case "עלות השחר": td("🏙️"); break;
		case "זמן טלית ותפילין": td("🫂"); break;
		case "הנץ החמה": td("🌄"); break;
		case 'סו"ז ק"ש למג"א': td("🛡️"); break;
		case 'סו"ז ק"ש לגר"א': td("👑"); break;
		case 'סו"ז תפילה למג"א': td("🛡️"); break;
		case 'סו"ז תפילה לגר"א': td("🙏"); break;
		case "חצות": td("✴️"); break;
		case "מנחה גדולה": td("🌾"); break;
		case "פלג המנחה": td("🥋"); break;
		case "שקיעה": td("🌇"); break;
		case "צאת הכוכבים": td("🌃"); break;
		case "דף יומי בבלי": tdDafYomi(); break;
		}
	}

	times = "<table>"+times+"</table>";
	$(wdgt.sid).html(times);

	// 🌇
	var shm = $(wdgt.sid + " td:contains(🌇)").next().text().split(':');
		($app.Vars['🌇']=new Date()).setHours(shm[0], shm[1], 0, 0);
		$app.Vars['🌇'] = parseInt(new Date($app.Vars['🌇']).getTime()/1000);
	
	// daf yomi
	$(wdgt.sid + ' .dafYomi').width($('#🗓️ .tdCurrent').width())
		.appendTo('#🗓️ .tdCurrent');  // 🗒: '.detach()' not needed

	// Mark Current Zman
	setInterval(Mark, 1000*60*3); 
	Mark();


	//
	function td(emoji) {
		times += '<tr><td class="📆name">'+emoji+'</td><td class="📆val">'+trT[i]+'</td></tr>';
	}

	//
	function tdDafYomi() {
		times += '<tr><td class="📆name"></td><td class="📆val"><div class="dafYomi">'+trT[i]+'</div></td></tr>';
	}
};

//
function Mark() {
	var now = parseInt( new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }).replace(':','') ); 
	var first = null;

	$(wdgt.sid + " td.📆val").each((i, t)=> {
		var v = parseInt( $(t).text().replace(':','') );
		if ( now <= v && !first) {
			first = $(t).parent();
			if (v - now <= 3) Countdown((v - now)*100);
		} else {
			$(t).parent().removeClass('markIconText');
		}
	});
	if (first ) {
		first.addClass('markIconText'); 
	}
}  

})();