//
(()=>{

// screen saver
const wdgt = new $app.Service ('🖌️', {
	dependency: { var: ['🌃',] },
	repeat: 60,
});

//
wdgt.Init = ()=> {
	ShowHide ();
	
    (wdgt.data = new MutationObserver (ms=> {
    	ms.forEach (m=> {
    		if (isNaN (rearrange) || m.type != 'childList' || !m.removedNodes.length) return;
			rearrange = 0;
			wdgt.Update ();
		})})
	).observe ($(`#${$app.Const.Name}`)[0], { childList: true });
}

//
wdgt.Update = ()=> {
	if (!isNaN (rearrange) && rearrange !== 0 && Date.now () - rearrange < 30*60*1000) return;
	if ($app.Vars['🌃'] =='true') {
		if (!isNaN (rearrange)) rearrange = 0;
		return;
	}
	if (!screen.orientation.type.includes('landscape')) return setTimeout (()=> wdgt.Update (), 10*1000);
	clearTimeout (i_rearrange);
	i_rearrange = setTimeout (Rearrange, (rearrange === 0 ? 5 : 60)*1000);
}


// 
wdgt.Rearrange = Rearrange // for debugging 
//
let rearrange, i_rearrange, rearrange_thread;
function Rearrange () {
	const CmpH = (a, b)=> a.height - b.height, 
		EQ = (a, b)=> Math.abs (a-b) < 5,
		NF = v=> Number (parseFloat (v).toFixed (2)),
		P = (v, hw)=> NF (v * 100 / (hw ? $(`#${$app.Const.Col.W}`).height() : $(`#${$app.Const.Col.W}`).width())),
		a = [], sub = {}, col = [];
	
	if (!isNaN (rearrange_thread) && Date.now () - rearrange_thread < 5*1000) return setTimeout (()=> {
			rearrange = 0; 
			wdgt.Update ();
		}, 5*1000);
	rearrange_thread = Date.now ();
		
	// create array 'sub' of sub widgets,
	// and array 'a' of only main widgets
	for (const [k, w] of Object.entries($app.Widgets)) {
		const e = $(w.sid)[0], 
		br = e.getBoundingClientRect();
			
		if (!Participant (w, e, true)) continue;
		
		const o = { id: w.id, sid: w.sid, height: P(br.height,1), width: P(br.width), top: P(br.top,1), left: P(br.left)}; 
		if (w['🖌️']) (sub[w['🖌️']] = (sub[w['🖌️']] ?? [])).push (o)
		else a.push (o);
	}
	
	// replace main widgets that have sub, 
	// with a complex array (main + sub)
	a.forEach ((e, i, a)=> {
		if (!sub[e.id]) return;
		if (sub[e.id].every(e2=> EQ (e2.width, e.width))) {
			// 🪵
			a[i] = { [wdgt.id]: [e].concat(sub[e.id]), height: e.height + sub[e.id].reduce((a,e2)=>e2.height+a,0), width: e.width, left: e.left, t: 'r', };
			a[i].top = a[i][wdgt.id].reduce((a, e) => Math.min(a, e.top), 9999);
		} else {
			// ⌚
			a[i] = { [wdgt.id]: [e, { a: sub[e.id], height: sub[e.id][0].height, width: e.width, top: sub[e.id][0].top, left: e.left, t: 'c', }], height: e.height + sub[e.id][0].height, width: e.width, left: e.left, t: 'r', };
			a[i].top = sub[e.id].reduce((a, e)=> Math.min(a, e.top), e.top);
		}
	});
//console.log (a)
	// group by height. 
	a.forEach ((e, i, a)=> {
		const cx = col.findIndex (c=> EQ (c.height, e.height));
		if (cx == -1) return col.push (e);
		if (!col[cx]?.a) col[cx] = { a: [col[cx]], width: col[cx].width, height: col[cx].height, top: col[cx].top, left: col[cx].left, t: 'c', };
		col[cx].left = Math.min (e.left, col[cx].left);
		col[cx].width += e.width;
		col[cx].a.push (e);
	});
	
	col.sort (CmpH);
	// create hierarchy 
	let row = { a: [], height: 0, left: 9999, top: 9999, t: 'r' }; 
	col.forEach ((e, i, col)=> {
		if (!EQ (e.height, row.height)) {
			row.a.push (e);
			row.height += e.height;
			row.width = e.width;
			row.left = Math.min (row.left, e.left);
			row.top = Math.min (row.top, e.top);
		}
		else {
			const c = {
				a: [row, e,],
				height: row.height, 
				width: row.width + e.width, 
				left: Math.min (row.left, e.left), 
				top: row.top,
				t: 'c',
			}
			row = structuredClone (c);
			row.a = [c];
			row.t = 'r';
		}
	});
	
	const css = { start: '<style> @media (min-device-width: 730px) {', end: '}</style>', E: e=> `${e.sid} { top:${e.top}%; left:${e.left}%; }`, a: [], };
//console.log (row.a[0])
	Switch (css, row.a[0]);
    
	$(wdgt.sid).html (`${css.start}${css.a.reduce ((a, e)=> `${a}${css.E (e)}`, '')}${css.end}`);
	rearrange = Date.now ();
	rearrange_thread = 0;
}

//
function Participant (w, e, rearrange = false) {
	const S = p=> e.computedStyleMap().get (p).toString().includes ('%'), 
		br = e.getBoundingClientRect(), sm = e.computedStyleMap();
	if ((w instanceof $app.Service)
			|| (!S ('width') && !S ('top'))
			|| (rearrange && e.parentNode.id !=$app.Const.Col.W)
			|| (!rearrange && Number(sm.get ('z-index').toString()) > 100)) {
		return false;
	}
	return true;
}

//
function Switch (css, e, h = 0, w = 0) {
	const NF = v=> Number (parseFloat (v).toFixed (2)),
		CmpL = (a, b)=> a.left - b.left, 
		CmpT = (a, b)=> a.top - b.top,
		A = e=> e[wdgt.id] ?? e.a,
		CSS = e=> {
			//e.h = h; e.w = w
			e.top = NF (h + e.top + (e.dy ?? 0));
			e.left = NF (w + e.left + (e.dx ?? 0));
			//window ['🐵'].AddStyle (`@media (min-device-width: 730px) { ${e.sid} { top:${e.top}%; left:${e.left}%; __zoom:0.5; __height:${e.height-1}%; __width:${e.width-1}%; } }`);
			css.a.push (e);
		},
		a = A(e);
	
	// leaf - set css
	if (!a) return CSS (e); 
	
	// randomize the columns/rows
	const ar = Array(a.length).fill().map ((_, i) => i).sort(() => Math. random() - 0.5);
	a.sort (e.t == 'c' ? CmpL : CmpT);
	let cw = 0, ch = 0;
	for (let i = 0; i < ar.length; i++) {
		let dx = 0, dy = 0; 
		for (let j = 0; j < ar[i]; j++) {
			dx += a[j].width;
			dy += a[j].height;
		}
		if (e.t == 'c') {
			a[ar[i]].dx = -dx + cw;
			cw += a[ar[i]].width;
		}
		else {
			a[ar[i]].dy = -dy + ch;
			ch += a[ar[i]].height;
		}
		a[ar[i]].h = h
		a[ar[i]].w = w
	}
	a.forEach (e=> A(e) && Switch (css, e, h + (e.dy ?? 0), w + (e.dx ?? 0)));
	
	// set css
	a.forEach (e=> !A(e) && CSS (e));
} 

//
function ShowHide () {
	for (const [k, w] of Object.entries($app.Widgets)) {
		if (w instanceof $app.Service) continue;
		const e = $(w.sid);
		if (Participant (w, e[0])) e.removeClass (wdgt.id)
		else e.addClass (wdgt.id);
	}
}

//
window.addEventListener('orientationchange', ()=> setTimeout(ShowHide, 250));

})(); 
