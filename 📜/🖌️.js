//
(()=>{

// inter system communication
const wdgt = new $app.Service ('🖌️', {
	repeat: 60,
});
/*
wdgt.Init = Orientation;

//
wdgt.Update = ()=> {
	if (!screen.orientation.type.includes('landscape')) return setTimeout (()=> wdgt.Update (), 10*1000);
	setTimeout (Rearrange, 1*1000); 
}
*/
//
function Rearrange () {
	const CmpH = (a, b)=> a.height - b.height, 
		EQ = (a, b)=> Math.abs (a-b) < 5,
		P = (v, hw)=> v * 100 / (hw ? $(`#${$app.Const.Name}`).height() : $(`#${$app.Const.Name}`).width()),
		a = [], sub = {}, col = [], row = { a: [], height: 0, left: 0, t: 'r' };
	
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
			a[i].top = a[i][wdgt.id].reduce((a, b) => Math.min(a.top, b.top));
		} else {
			// ⌚
			a[i] = { [wdgt.id]: [e, { a: sub[e.id], height: sub[e.id][0].height, width: e.width, top: sub[e.id][0].top, left: e.left, t: 'c', }], height: e.height + sub[e.id][0].height, width: e.width, left: e.left, t: 'r', };
			a[i].top = sub[e.id].reduce((a,b)=> Math.min(a, b.top), e.top);
		}
	});
	
	console.log ('A', a);
		
	// group by height. 
	a.forEach ((e, i, a)=> {
		const c = col.filter (c=> EQ (c.height, e.height))[0];
		if (!c) col.push (e)
		else c.left = Math.min (e.left, c.left);
		if (c?.a) c.a.push (e)
		else if (c) {
			c.a = [e, structuredClone (c)];
			c.t = 'c'; 
			delete c.id;
			delete c.sid;
			delete c[wdgt.id];
		}
	});
	
	col.sort (CmpH);
	
	col.forEach ((e, i, col)=> {
		row.left = Math.min (row.left, e.left);
		if (!EQ (e.height, row.height)) {
			row.a.push (e);
			row.height += e.height;
			row.width = e.width;
			if (!row.top) row.top = e.top;
		}
		else {
			row.width += e.width;
			row.a = [{a: [structuredClone(row), e], height: row.height, width: row.width, left: row.left, t: 'c'}];
		}
	});
	
	console.log ('B', row.a[0]);
	Switch (row.a[0]); 
}

function Switch (e, h = 0, w = 0) {
	const CmpL = (a, b)=> a.left - b.left, 
		CmpT = (a, b)=> a.top - b.top, 
		A = e=> e[wdgt.id] ?? e.a,
		C = e=> {
			if (!A(e)) {
				e.top = h + e.top + e.dy;
				e.left = w + e.left + e.dx;
				$(e.sid).css('top', `${e.top}%`).css('left', `${e.left}%`);
			}
			else Switch (e, h + e.dy, w + e.dx);
		},
		S = (i, ac, c, lt, f, d, wh)=> {
			const ad = [a[i], ...ac.filter (e=> e[lt] >= Math.min (a[i][lt], c[lt]) && e[lt] <= Math.max (a[i][lt], c[lt]) )];
			ad.sort (f);
			for (let i = 0; i < ad.length - 1; i++) {
				ad[i][d] += ad[i+1][wh];
				ad[i+1][d] -= ad[i][wh]; 
			}
		},
		a = A(e);
	// generate random left 
	a.forEach (e=> { e.dx = e.dy = 0 });
	for (let i = 0; i < a.length; i++) {
		a[i].switch = true;
		const ac = a.filter (e=> !e.switch);
		if (!ac.length) break;
		const c = ac [ac.length == 1 ? 0 : Math.round (Math.random (ac.length-1))];
		
		if (e.t == 'c') {
			S (i, ac, c, 'left',CmpL,'dx','width');
		}
		else {
			S (i, ac, c, 'top',CmpT,'dy','height');
		}
	}
	// set css
	a.forEach (e=> C (e));
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
