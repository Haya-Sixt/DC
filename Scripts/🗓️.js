
//
function calendarInit() {
	try {
		
	$("#calendar").text("🗓️ Init");
	
	var year = new Intl.DateTimeFormat('he-u-ca-hebrew',{year:'numeric'}).format(new Date()),
		month = monthHeb(new Date()),
		fn = year + '_' + month + '.htm',
		fnNext = Next().year + '_' + Next().month + '.htm';

	calendarInitTimes(fn);
	calendarInitTablet(fn, fnNext);
	
	heb();
	
	
   } catch (e) {
   	$("#calendar").text("calendarInit failed:" + e + " \n🗓️ Rebooting (40s)...");
   	$("#calendar").addClass("errorBorder");
   	setTimeout(calendarInit, 1000*40);
   } 
   
   
   function Next() {
		var now = new Date(), monthNext = month;
		while (month==monthNext) {
		  now.setDate(now.getDate()+1); 
		  monthNext = monthHeb(now);
		}
		yearNext = new Intl.DateTimeFormat('he-u-ca-hebrew',{year:'numeric'}).format(now);
		return {"month":monthNext,"year":yearNext};
	}
	
	function monthHeb (now) {
		let m = new Intl.DateTimeFormat('he-u-ca-hebrew',{month:'long'}).format(now);
		if (m.includes('כסלו')) m = 'כסליו';
		if (m.includes('אדר ')) m = m.slice(0, m.length-1) + "'";
		return m;
	}
	
	function heb() {
		var seven = !(year % 7) ? 'שנת שמיטה' : 'שנה ' + String.fromCharCode((year % 7) + 'א'.charCodeAt(0) - 1) + "'", 
			leap = '' + ([0,3,6,8,11,14,17].includes(year % 19) ? 'מעוברת' : 'פשוטה');

		$("#hebMonthYear").text( month + '  ' + year + '  ' + seven + '  ' + leap );
	}
}

//
function calendarInitTimes(fn) {
	try {
		
	$("#today").text("🗓️ Init Times");

	const url = "http://localhost:8181/Documents/MacroDroid/🖥️/📑/times/times_"+fn;
	$.get( url, function( data, s, xhr ) {
		calendarUpdateTimes(xhr.responseText);
    })
    .fail(function(jqXHR, textStatus) {
		$("#today").text("calendarInitTimes.get failed. \n🗓️ Rebooting (40s)...");
		$("#today").addClass("errorBorder");
		setTimeout(calendarInitTimes, 1000*40);
    });
    
   } catch (e) {
   	$("#today").text("calendarInitTimes failed:" + e + " \n🗓️ Rebooting (40s)...");
   	$("#today").addClass("errorBorder");
   	setTimeout(calendarInitTimes, 1000*40);
   } 
}


//
function calendarInitTablet(fn, fnNext) {
	try {
		
	$("#calendar").text("🗓️ Init Tablet");

	const url = "http://localhost:8181/Documents/MacroDroid/🖥️/📑/🗓️/🗓️_";
	$.get( url+fn, function( data, s, xhr ) {

		$.get( url+fnNext, function( data, s, xhrNext ) {
			calendarUpdateTablet(xhr.responseText, xhrNext.responseText);
		})
	    .fail(function(jqXHR, textStatus) {
			$("#calendar").text("calendarInitTablet.getNext failed. \n🗓️ Rebooting (40s)...");
			$("#calendar").addClass("errorBorder");
			setTimeout(calendarInitTablet, 1000*40);
	    }); 
    })
    .fail(function(jqXHR, textStatus) {
		$("#calendar").text("calendarInitTablet.get failed. \n🗓️ Rebooting (40s)...");
		$("#calendar").addClass("errorBorder");
		setTimeout(calendarInitTablet, 1000*40);
    });
    
   } catch (e) {
   	$("#calendar").text("calendarInitTablet failed:" + e + " \n🗓️ Rebooting (40s)...");
   	$("#calendar").addClass("errorBorder");
   	setTimeout(calendarInitTablet, 1000*40);
   } 
}


//
function calendarUpdateTimes(data) {
	try {
		
	if ($("#today table").length) return; 
	
	var times = "", ldate = new Date().toLocaleDateString('he-IL').replace('.','/').replace('.','/'),
		trH = data.substring(data.indexOf("<td"),data.indexOf("</tr")), 
		trT = data.substring(data.indexOf(ldate));

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
	$("#today").html(times);
	
	
	// Mark Current Zman
	setInterval(todayMark, 1000*60*3); 
	todayMark(); 
	
	dispatchEvent(new Event('#today'));
	
	$("#today").removeClass("errorBorder");
		
	} catch(e) {
		$("#today").text("calendarUpdateTimes failed:" + e + " \n🗓️ Rebooting (40s)...");
		$("#today").addClass("errorBorder");
		setTimeout(calendarInitTimes, 1000*40);
	} 
	
	
	function td(emoji) {
		times += '<tr><td class="timesName">'+emoji+'</td><td class="timesVal">'+trT[i]+'</td></tr>';
	}
	
	function tdDafYomi() {
		times += '<tr><td class="timesName"></td><td class="timesVal"><div class="dafYomi">'+trT[i]+'</div></td></tr>';
	}
	
	function todayMark() {
		var time = parseInt( new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }).replace(':','') ); 
		var firstMark = null;
	
		$("#today td.timesVal").each(function( index ) {
			var val = parseInt( $( this ).text().replace(':','') );
			if ( time <= val && !firstMark) {
				firstMark = $( this ).parent();
				if (val-time <= 3) Countdown((val-time)*100);
			} else {
				$( this ).parent().removeClass('markIconText');
			}
		});
		if (firstMark ) {
			firstMark.addClass('markIconText'); 
		}
	}  
} 


//
function calendarUpdateTablet(data, dataNext) {
	try {
	
	var tHTML1 = data.replaceAll("tdCurrent",""),
		tHTML2 = dataNext.replaceAll("tdCurrent","");
			
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
		.replaceAll("פורים",j("🥸"))
		.replaceAll("שושן פורים",j("🥸"))
		.replaceAll(" קטן","")
		.replaceAll("תענית אסתר",j("🚱"))
		.replaceAll("שבת פרה",j("🐮"))
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
	
	// 🗓️ 
	$("#calendar").html(tHTML4);
	
	// current 
	$('#calendar .tdDay').each(function() {
		if ($(this).html().indexOf(current)!=-1) {
			$(this).addClass('tdCurrent');
			return false;
		}
	});
	
	// omer 
	$('#calendar span[name=omer]').parent().addClass('omer');
	
	// daf yomi
	$('#today .dafYomi').width($('#calendar .tdCurrent').width())
		.appendTo('#calendar .tdCurrent');  // 🗒: '.detach()' not needed
	$( window ).resize(function() {
		$('#calendar .dafYomi').width($('#calendar .tdCurrent').width());
	});
	
	
	dispatchEvent(new Event('#calendar'));
	
	$("#calendar").removeClass("errorBorder");
		
	} catch(e) {
		$("#calendar").text("calendarUpdateTablet failed:" + e + " \n🗓️ Rebooting (40s)...");
		$("#calendar").addClass("errorBorder");
		setTimeout(calendarInitTablet, 1000*40);
	} 
	
	
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
}
