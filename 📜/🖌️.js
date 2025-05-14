//
(()=>{

// screen saver
const wdgt = new $app.Service ('🖌️', {
	repeat: 60,
});

wdgt.Init = Orientation;

//
wdgt.Update = ()=> {
	if (!screen.orientation.type.includes('landscape')) return setTimeout (()=> wdgt.Update (), 10*1000);
	setTimeout (Rearrange, 3*1000); 
}

//
function Rearrange () {
	const CmpH = (a, b)=> a.height - b.height, 
		EQ = (a, b)=> Math.abs (a-b) < 5,
		P = (v, hw)=> v * 100 / (hw ? $(`#${$app.Const.Name}`).height() : $(`#${$app.Const.Name}`).width()),
		a = [], sub = {}, col = [];
	
	// create array 'sub' of sub widgets,
	// and array 'a' of only main widgets
	for (const [k, w] of Object.entries($app.Widgets)) {
		const BR = p=> br[p] ? br[p] : document.body[`client${p.at(0).toUpperCase()}${p.slice(1)}`] * Number (e.computedStyleMap ().get(p).toString ().replace ('%', '')) / 100,
			e = $(w.sid)[0], br = e.getBoundingClientRect();
			
		if ((w instanceof $app.Service)
				|| e.computedStyleMap().get ('display').toString() == 'none'
				|| !br.height 
				|| Number(e.computedStyleMap().get ('z-index').toString()) > 100) {
			continue;
		}
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
	
	console.log ('A', a);
		
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
	
	console.log ('B', row.a[0]);
	Switch (row.a[0]); 
}

function Switch (e, h = 0, w = 0) {
	const CmpL = (a, b)=> a.left - b.left, 
		CmpT = (a, b)=> a.top - b.top,
		A = e=> e[wdgt.id] ?? e.a,
		CSS = e=> {
			e.h = h
			e.w = w
			//console.log (e.id, )
		
			e.top = h + e.top + (e.dy ?? 0);
			e.left = w + e.left + (e.dx ?? 0);
			//$(e.sid).css('top', `${e.top}%`).css('left', `${e.left}%`);
			window ['🐵'].AddStyle (`@media (min-device-width: 730px) { ${e.sid} { top:${e.top}%; left:${e.left}%; __zoom:0.5; __height:${e.height-1}%; __width:${e.width-1}%; } }`);
		}/*,
		MoveToEnd = (i, ac, c, lt, f, d, wh)=> {
			const ad = [a[i], ...ac.filter (e=> e[lt] >= Math.min (a[i][lt], c[lt]) && e[lt] <= Math.max (a[i][lt], c[lt]) )];
			ad.sort (f);
			for (let i = 0; i < ad.length - 1; i++) {
				ad[0][d] += ad[i+1][wh];
				ad[i+1][d] -= ad[0][wh];
			}
		}*/,
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
	a.forEach (e=> A(e) && Switch (e, h + (e.dy ?? 0), w + (e.dx ?? 0)));
	
		/*
	a.forEach (e=> { e.dx = e.dy = 0 });
	for (let i = 0; i < a.length; i++) {
		a[i].switch = true;
		const ac = a.filter (e=> !e.switch);
		if (ac.length) {
			const c = ac [ac.length == 1 ? 0 : Math.round (Math.random (ac.length-1))];
			
			if (e.t == 'c') {
				MoveToEnd (i, ac, c, 'left',CmpL,'dx','width');
			}
			else {
				MoveToEnd (i, ac, c, 'top',CmpT,'dy','height');
			}
		}
		A(a[i]) && Switch (a[i], h + a[i].dy, w + a[i].dx);
	}
	*/
	
	// set css
	a.forEach (e=> !A(e) && CSS (e));
}

//
function Orientation () {
	const S = p=> e[0].computedStyleMap().get (p).toString().includes ('%');
	let e;
	for (const [k, w] of Object.entries($app.Widgets)) {
		e = $(w.sid);
		if (S ('width') || S ('top')) e.show ()
		else e.hide ();
	}
}

//
window.addEventListener('orientationchange', ()=> setTimeout(Orientation, 250));

})(); 
