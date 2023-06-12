// 1.
(()=>{

	// Start
	const wdgt = new $app.Widget('⏱️');
	
	//
	wdgt.Init = ()=> {
		wdgt.data = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
	}
	
	//
	wdgt.Update = ()=> {
		$(wdgt.sid).text(`${wdgt.data} ${wdgt.id}`);
	};
	
	})();
	
	
	// 2.
	(()=>{
	
	// Time
	const wdgt = new $app.Widget('⌚');
	wdgt.repeat = { update: 1 };
	
	//
	wdgt.Init = ()=> {
		$(wdgt.sid).text('');
		//
		const x = 186, y = 98;
		$('<div>') // 🗒: without 'div', and insted 'svg', the animation won't work.
		.attr("style","width: 100%; height: 100%;")
		.html(`<svg style="width: 100%; height: 100%; fill: white;" viewbox="0 0 10 10"><defs><filter id="⌚filter"><feTurbulence type="turbulence"><animate attributeName="baseFrequency" values="2;7" dur="10s" repeatCount="indefinite"></animate><animate attributeName="numOctaves" values="2;3" dur="10s" repeatCount="indefinite"></animate></feTurbulence><feColorMatrix type="matrix" values="0 0 0 -1 1 0 0 0 -1 1 0 0 0 -1 1 0 0 0 0 1"></feColorMatrix><feComponentTransfer><feFuncR type="table" tableValues="0 0 0 0 1"></feFuncR></feComponentTransfer></filter><mask id="⌚mask"><text x="${x}%" y="${y}%"></text></mask></defs><text x="${x}%" y="${y}%" style="filter: url(#⌚filter);" mask="url(#⌚mask)"></text></svg>`)
		.appendTo($(wdgt.sid));
	
		// colon 
		$("<div>").attr('id',`${wdgt.id}Colon`).appendTo($(wdgt.sid));
	};
	
	wdgt.Update = ()=> {
		const time = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
		$(wdgt.sid).find('text').text(time);
	}
	
	})();
	
	
	// 3.
	(()=>{
	
	// Schedule
	const wdgt = new $app.Widget('⏰');
	wdgt.repeat = { update: 10 };
	wdgt.dependency = ['📆'];
	
	//
	wdgt.Init = ()=> {}
	
	//
	wdgt.Update = ()=> {
		Current() || Next() || $(wdgt.sid).html('&nbsp;');;
	};
	
	function Current() {
		var now = parseInt( new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }).replace(':','') ), 
			firstMark = null,
			match = $('#🗓️ .tdCurrent').text().match(/[0-2][0-9]:[0-5][0-9]/gm);
		
		match && match.forEach((m) => { 
			var val = parseInt( m.replace(':','') );
			if ( now <= val && !firstMark) 
				firstMark = m;
		});
		
		if (firstMark) {
			$(wdgt.sid).html('<span>'+firstMark+'</span><span>⏰</span>');
			$(wdgt.sid).addClass("markIconText");
			return true;
		}
		
		$(wdgt.sid).removeClass("markIconText"); 
		
		return false;
	}
	
	function Next() {
		var days = 0, d = "", c = false;
		
		$("#🗓️ .tdDay").each((i, t)=> {
			
			if ( $(t).hasClass('tdCurrentHeb') ) {
				!$(t).hasClass('tdCurrent') && days++;
				c = $(t).text().match(Helpers.Emoji());
				!c && (c = ' ');
			}
			else if (c) {
				let m = $(t).text().match(Helpers.Emoji());
				m && (m = m.reduce((s, e)=> s + (c.includes(e) ? '' : e), ''));
				if (m && m != '') {
					if (days == 0) d = 'היום בערב '
					else if (days == 1) d = 'מחר בערב '
					else d = (days + 0) + " ימים ל "; 
					$(wdgt.sid).html(`<span>${d}</span>${m}`);
					days = 0;
					return false; // 🗒: break '$.each' (but not 'forEach')
				}
				
				days++;
			}
		});
		
		return !days;
	}
	
	})();