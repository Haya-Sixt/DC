// 1.
(()=>{

// Date Loazi
const wdgt = new $app.Widget('📅👉');

//
wdgt.Init = ()=> {
	let date = new Date().toLocaleDateString('he-IL', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace("יום ","").replace('.','/'); 
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
	const seven = !(wdgt.data.year % 7) ? 'שנת שמיטה' : 'שנה ' + String.fromCharCode((wdgt.data.year % 7) + 'א'.charCodeAt(0) - 1) + "'", 
		leap = '' + ([0,3,6,8,11,14,17].includes(wdgt.data.year % 19) ? 'מעוברת' : 'פשוטה'),
		year = `${wdgt.data.year.slice(1)}'5`;
	
	$(wdgt.sid).text( wdgt.data.month + '  ' + year + '  ' + seven + '  ' + leap );
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
	let now = new Date(), month, monthNext;
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
	let t1 = wdgt.data[0].replaceAll("tdCurrent",""),
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
	let r1last = t1.substring(t1.lastIndexOf("<tr")),
		r2first = t2.substring(0,t2.indexOf("</tr>")+5),
		u=0, rU = t2.substring(0,t2.indexOf("<td "));
	for (let i=0; i<7; i++) {
		let td1 = r1last.substring(r1last.indexOf("<td "), r1last.indexOf("</td>")+5),
			td2 = r2first.substring(r2first.indexOf("<td "), r2first.indexOf("</td>")+5);
		r1last = r1last.replace(td1,"");
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
	const j = (i, o, f)=> { t = t.replaceAll(i, (o == '' || o.startsWith('<') || !o.match(Helpers.Emoji())) ? o : `<imo${f ? ` style='filter:${f};'` : ``}>${o}</imo>`) };
	let t = (t1+t2)
	j("כניסת ","")
	j("צאת ","")
	j("שבת:","")
	j("החג:","")
	j("הצום:","")
	j("דראש","ראש")
	j("ערב ראש חודש","")
	j("א' ראש חודש","🌒")
	j("א' דר\"ח","🌒") // (חנוכה)
	j("ב' ראש חודש","🌘")
	j("ב' דר\"ח","🌘") // (חנוכה)
	j("ראש חודש","🌑", "brightness(2)")
	j(" לעומר","<span name='omer'>🌾</span>")
	j("יום הזכרון לשואה ולגבורה","🏴‍☠️", "brightness(2)")
	j("יום הזכרון","🪖")
	j("יום העצמאות","🇮🇱")
	j(" מוקדם","🐇")
	j("תענית שני","")
	j("תענית חמישי","")
	j(" קמא","")
	j(" בתרא","")
	j("פסח שני","🫓")
	j("ל\"ג בעומר","🔥")
	j("יום ירושלים","🏰")
	j("ערב חג השבועות","")
	j("ערב חג הסוכות","")
	j("ערב חג הפסח","")
	j("חג ה","")
	j("שבועות","📜")
	j("צום י\"ז בתמוז","🚱")
	j("נדחה","🦥")
	j("שבת חזון","🕶️")
	j("תשעה באב","🚱")
	j("חמשה עשר באב","💕")
	j("א' דסליחות לעדות המזרח","🙇")
	j("א' דסליחות לאשכנזים","🙇🏻")
	j("ערב ראש השנה","")
	j("א' ראש השנה","👑")
	j("ב' ראש השנה","👑")
	j("שבת ראש השנה","👑")
	j("צום גדליה","🚱")
	j("שבת שובה", "שובה")
	j("ערב יום הכיפורים","")
	j("יום הכיפורים","⚖️", "brightness(2)")
	j('שבת חוה"מ פסח',"")
	j('שבת חוה"מ סוכות',"")
	j("חול המועד ","")
	j("סוכות","🍋")
	j("הושענא רבה","🌿")
	j("שמחת תורה","🎉")
	j("אסרו חג","🐏")
	j("שבת חנוכה","")
	j("זאת חנוכה","🕎")
	j("חנוכה","🕎")
	j("צום עשרה בטבת","🚱")
	j("שבת שירה","🎤")
	j("ראש השנה לאילנות","🌱")
	j("שבת שקלים","💰")
	j("שבת זכור","🛀")
	j("פורים","🥸")
	j("שושן ","")
	j(" קטן","")
	j("תענית אסתר","🚱")
	j("שבת פרה","🐮")
	j("שבת החודש","👑")
	j("עוברים ל","") // שעון קיץ
	j("שבת הגדול","🐑")
	j("שביעי של פסח","🌊")
	j("פסח","🫓")
	j('🇮🇱','🇮🇱')
	j('עי"ט',"") // ערב יום טוב
	j("שבת וחג:","")
	j('<div> ערוב תבשילין','<div class="hideOut"> ערוב תבשילין')
		
	// show only 4 rows
	let t4 = t.substring(0, t.indexOf("</tr>")+5)
		current = hebDay();
	
	for (let i=0,show=0; i<12 && show<5; i++) {
		let itr = t.indexOf("<tr");
		if (itr==-1) break;
		let tr = t.substring(itr, t.indexOf("</tr>")+5);
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
	$(wdgt.sid + ' td.tdDay').each((i, t)=> {
		if ($(t).html().indexOf(current)!=-1) {
			$(t).addClass('tdCurrent');
			return false;
		}
	});
	
	// omer 
	$(wdgt.sid + ' span[name=omer]').parent().addClass('omer');

	// daf yomi
	$( window ).resize(function() {
		$(wdgt.sid + ' .dafYomi').width($(wdgt.sid + ' td.tdCurrent').width());
	});
};

function hebDay() {
	let d = parseInt(new Intl.DateTimeFormat('he-u-ca-hebrew',{day:'numeric'}).format(new Date()) ), hd="";
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
	let i = 0, times = '', ldate = new Date().toLocaleDateString('he-IL').replace('.','/').replace('.','/'),
		trH = wdgt.data.substring(wdgt.data.indexOf("<td"), wdgt.data.indexOf("</tr")), 
		trT = wdgt.data.substring(wdgt.data.indexOf(ldate));

	wdgt.data = {};
	trH = trH.replaceAll(' class="tdHead visible ','').replaceAll('type-date"','').replaceAll('type-time"','').replaceAll('type-limud"','').replaceAll('</td><td>','|').replaceAll('<td>','').replaceAll('</td>','').split('|'); 
	trT = trT.substring(0, trT.indexOf("</tr")).replaceAll('</td><td>','|').replaceAll('</td>','').split('|');
	
	for (; i<trH.length; i++) {
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

	times = `<table>${times}</table>`;
	$(wdgt.sid).html(times);

	// daf yomi
	$(wdgt.sid + ' .dafYomi').width($('#🗓️ td.tdCurrent').width())
		.appendTo('#🗓️ td.tdCurrent');  // 🗒: '.detach()' not needed

	// Mark Current Zman
	setInterval(Mark, 1000*60*3); 
	Mark();


	//
	function td(emoji) {
		const hm = trT[i].split(':'),
			t = new Date();
		t.setHours(hm[0], hm[1], 0, 0);
		wdgt.data[emoji] = parseInt(t.getTime()/1000); // In used: 📒
		times = `${times}<tr><td class="${wdgt.id}name">${emoji}</td><td class="${wdgt.id}val">${trT[i]}</td></tr>`;
	}

	//
	function tdDafYomi() {
		times += `<tr><td class="${wdgt.id}name"></td><td class="${wdgt.id}val"><div class="dafYomi">${trT[i]}</div></td></tr>`;
	} 
};

//
function Mark() {
	let now = parseInt( new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }).replace(':','') ), 
	  first = null, current = `💤`;

	$(`${wdgt.sid} td.${wdgt.id}val`).each((i, t)=> {
		let v = parseInt( $(t).text().replace(':','') );
		if ( now <= v && !first) {
			first = $(t).parent();
			if (v - now <= 3) $app.Widgets['⏳'].Start ((v - now)*100);
		} 
		else {
			$(t).parent().removeClass('markIconText');
			if (!first) current = $(t).parent().find(`td.${wdgt.id}name`).text();
		}
	});
	if (first ) {
		first.addClass('markIconText'); 
	}
	wdgt.data.current = current;
	
	//
	CurrentBySunset ();

	//
	Background ();
} 

//
function CurrentBySunset () {
	const c = 'tdCurrentHeb',
		a = Array.from(document.querySelectorAll('#🗓️ td.tdDay')),
		x = a.findIndex((e)=> e.classList.contains('tdCurrent')),
		h = a [x + ( wdgt.data['🌇'] > new Date().getTime() / 1000 ? 0 : 1)];
	if (h != a[x]) a[x].classList.remove(c);
	h.classList.add(c);
	
	const cs = h.textContent.match(Helpers.Emoji()) ?? [];
	Helpers.Css ('background-image', '#🗓️', cs.join(''));
}

function Background () {
	Helpers.Css ('background-image', wdgt.sid, wdgt.data.current);
//		const circle = `<circle cx='calc(${x} + 2.37em)' cy='calc(${y} - 1.3em)'`, radius = 2.1,
//		  def = `<defs><clipPath id='cp'>${circle} r='${radius}em'/></clipPath><clipPath id='bg_cp'>${circle} r='calc(${radius}em + 1em)'/></clipPath><filter id='bg_f'><feGaussianBlur in='SourceGraphic' stdDeviation='8'/></filter></defs>`;
//		c = `${def}${text} dx='-0.1em' clip-path='url(%23bg_cp)' filter='url(%23bg_f)' opacity='0.4'>${cs}</text>${text} clip-path='url(%23cp)' opacity='0.6'>${cs}`;
}

})();