// 
(()=> {

// פיקוד העורף
const wdgt = new $app.Widget('🪖');
wdgt.dependency = ['🗺️'];
wdgt.repeat = { init: 10 };

//
// CORS wdgt.url = ()=> `https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=0`;

//
wdgt.Update = ()=> {
	$(wdgt.sid).html('');
	
	const a = [], hyphen = ' -', sj = 'י', dj = sj.repeat (2),
		DS = (v) => v.replaceAll (dj, sj), // קריית, מעיין, ריחאנייה
		// normalize 'y'. e.g: ' מודיעין-מכבים-רעות  '
		F = (f, ds)=> {
			for (let e in y) { // y.find/filter... fail in such big array.
				if (ds) e = DS (ds = e);
				if (!f (e)) continue;
				// for efficiency
				if (ds) {
					y [e] = y [ds];
					delete y [ds];
					console.log (`${wdgt.id}: DS (y [${e}]) updated  (for efficiency)`);
				}
				return y [e];
			}
		},
		Y = (d, strict, ds) => {
			let n = y[d];
			if (!n) n = F ((e)=> e.includes(`(${d})`), ds);
			if (!n) n = F ((e)=> e.startsWith(`${d}-`), ds);
			if (!n) n = F ((e)=> e.includes(`-${d}-`), ds);
			if (!n) n = F ((e)=> e.endsWith(`-${d}`), ds);
			if (!n && !strict) n = F ((e)=> e.includes(`${d.replaceAll('-', ' ')}`), ds); // e.g: 'בת-ים'
			return n;
		},
		// normalize 'd'. 
		// remove words. e.g: מטווח ניר עוז
		// 'ds' is for removal of double letter
		N = (d, ds) => {
			let i = 0, ix; 
			napa = '';
			if (ds) d = d.replaceAll (dj, sj); // קריית, מעיין, ריחאנייה 
			while ( !( napa = Y ( d.slice (i), (i && d.slice (i).indexOf (' ') == -1), ds ) ) ) // be strict (Y) after slicing ( e.g. תל חי ≈ חי ≠ עמיחי) 
				if ( (ix = d.slice (i).indexOf (' ')) == -1) break
				else i += ix + 1; // ' '
			return napa;
		}; 
			
	let napa, nonapa = '';
	for (const e of wdgt.data) {
		// 1 hours expired
		const startedAt = parseInt(new Date(e.alertDate).getTime () / 1000);
		if ( (parseInt (new Date().getTime() / 1000) - startedAt) / (60 * 60) > 1) continue;
		
		// find 'alerted cat' in 'a'
		const c = e.category_desc.trim ()
			.replace ("ירי רקטות וטילים", '🚀')
			.replace ("חדירת מחבלים",'🚷')
			.replace ("חדירת כלי טיס עוין", '🛸')
			.replace ("אזהרה", '⚠️');
		
		// find 'alerted city' in 'y' 
		e.data.split (', ').forEach ((d)=> { // e.g: "שדרות, איבים, ניר עם"
			// normalize 'd'. e.g: ' תל אביב - מזרח ' (but not 'בת-ים')
			d = d.replace ('אזור תעשייה ','')
				.replace ('הדרומי ','')
				.replace ('צפוני ','')
				.replace ('מטווח ','')
				.replace ('תל חי','כפר גלעדי'); 
			if (d.includes(hyphen)) d = d.replace (d.slice(d.indexOf(hyphen)), ''); // 'אשדוד -יא,יב,טו,יז,מרינה,סיט' 
			
			// again  normalize 'd'
			!N (d) && N (d, 1);
			
			// find 'found alerted napa' in 'n'
			if (napa) napa = $app.Widgets['🗺️'].napot [napa]
			else return (nonapa += `, ${d}`);
			
			// adding 'found napa' to 'found alerted cat in a'
			const ac = a.find (({cat})=> c == cat);
			if (ac?.napot?.find (({n})=> napa.n == n)) return;
			if (!ac) a.push ({ cat: c, napot: [napa], startedAt: startedAt })
			else ac.napot.push (napa);
		});
	}
	
	//
	$app.Widgets['🔔'].Clear (wdgt.id);
	for (const k in a) $app.Widgets['🔔'].Info (a[k].cat, a[k].napot.reduce((a,e)=> `${a ? `${a}, ` : ''}${e.n}`, ''), a[k].startedAt, 6 * 60 * 60, wdgt.id);
	if (nonapa) $app.Widgets['🔔'].Alert (wdgt.id, `<span style='font-size:small'>no napa found<br>${nonapa.slice(1)}</span>`, 3);
	// 
	 
	const w = $app.Widgets['🗺️'];
	if (!a.length) return w.Remove (wdgt.id);
	!w?.data?.[wdgt.id] && w.Add (wdgt.id);
	w.data [wdgt.id].Napot (a);
};

//
// converter location » napa
//

//
let y = []; 
y['חברון']=77;
y['קצר א-סר']=62;
y['כמאנה']=24;
y['סנסנה']=77;
y['אעצם (שבט)']=62;
y['אבירים']=24;
y['אבו עבדון (שבט)']=62;
y['אבו עמאר (שבט)']=62;
y['אבו עמרה (שבט)']=62;
y['אבו גוש']=11;
y['אבו גווייעד (שבט)']=62;
y['אבו קורינאת (שבט)']=62;
y['אבו קרינאת (יישוב)']=62;
y['אבו רובייעה (שבט)']=62;
y['אבו רוקייק (שבט)']=62;
y['אבו סנאן']=24;
y['אבו סריחאן (שבט)']=62;
y['אבו תלול']=62;
y['אדמית']=24;
y['עדנים']=42;
y['אדרת']=11;
y['אדירים']=23;
y['עדי']=24;
y['אדורה']=77;
y['אפיניש (שבט)']=62;
y['אפק']=24;
y['אפיק']=29;
y['אפיקים']=22;
y['עפולה']=23;
y['עגור']=11;
y['אחווה']=61;
y['אחיעזר']=43;
y['אחיהוד']=24;
y['אחיסמך']=43;
y['אחיטוב']=41;
y['אחוזם']=61;
y['אחוזת ברק']=23;
y['עכו']=24;
y['אל סייד']=62;
y['אל-עריאן']=32;
y['אל-עזי']=61;
y['עלי זהב']=73;
y['אלפי מנשה']=73;
y['אלון הגליל']=23;
y['אלון שבות']=76;
y['אלוני אבא']=23;
y['אלוני הבשן']=29;
y['אלוני יצחק']=32;
y['אלונים']=23;
y['עלמה']=21;
y['אלמגור']=22;
y['אלמוג']=75;
y['עלמון']=74;
y['עלומים']=62;
y['אלומה']=61;
y['אלומות']=22;
y['אמציה']=61;
y['עמיר']=21;
y['אמירים']=21;
y['עמיעד']=21;
y['עמיעוז']=62;
y['עמיחי']=74;
y['עמינדב']=11;
y['עמיקם']=32;
y['אמנון']=22;
y['עמקה']=24;
y['עמוקה']=21;
y['אניעם']=29;
y['ערערה']=32;
y['ערערה-בנגב']=62;
y['ערד']=62;
y['עראמשה']=24;
y['ארבל']=22;
y['ארגמן']=75;
y['אריאל']=73;
y['ערב אל נעים']=24;
y['עראבה']=24;
y['ארסוף']=41;
y['ערוגות']=61;
y['אסד (שבט)']=62;
y['אספר']=77;
y['עשרת']=44;
y['אשלים']=62;
y['אשדוד']=61;
y['אשדות יעקב (איחוד)']=22;
y['אשדות יעקב (מאוחד)']=22;
y['אשרת']=24;
y['אשקלון']=61;
y['עטאוונה (שבט)']=62;
y['עטרת']=74;
y['עתלית']=32;
y['אטרש (שבט)']=62;
y['עצמון שגב']=24;
y['עבדון']=24;
y['אבנת']=75;
y['אביאל']=32;
y['אביעזר']=11;
y['אביגדור']=61;
y['אביחיל']=41;
y['אביטל']=23;
y['אביבים']=21;
y['אבני איתן']=29;
y['אבני חפץ']=73;
y['אבשלום']=62;
y['אבטליון']=24;
y['עיינות']=44;
y['איילת השחר']=21;
y['עזריה']=43;
y['אזור']=53;
y['עזריאל']=41;
y['עזריקם']=61;
y['בחן']=41;
y['בלפוריה']=23;
y['באקה אל-גרביה']=32;
y['בר גיורא']=11;
y['בר יוחאי']=21;
y['ברעם']=21;
y['ברק']=23;
y['ברקת']=42;
y['ברקן']=73;
y['ברקאי']=32;
y['בסמה']=32;
y['בסמת טבעון']=23;
y['בת עין']=76;
y['בת הדר']=61;
y['בת חפר']=41;
y['בת חן']=41;
y['בת שלמה']=32;
y['בת ים']=53;
y['בצרה']=41;
y['באר מילכה']=62;
y['באר אורה']=62;
y['באר שבע']=62;
y['באר טוביה']=61;
y['באר יעקב']=43;
y['בארי']=62;
y['בארות יצחק']=42;
y['בארותיים']=41;
y['באר גנים']=62;
y['בית גן']=24;
y['בן עמי']=24;
y['בן שמן (מושב)']=43;
y['בן שמן (כפר נוער)']=43;
y['בן זכאי']=44;
y['בניה']=44;
y['בני עטרות']=42;
y['בני עיש']=44;
y['בני ברק']=52;
y['בני דרום']=44;
y['בני דרור']=41;
y['בני נצרים']=62;
y['בני ראם']=44;
y['בני יהודה']=29;
y['בני ציון']=41;
y['בקעות']=75;
y['בקוע']=11;
y['ברכה']=72;
y['ברכיה']=61;
y['ברור חיל']=61;
y['ברוש']=62;
y['בית אלפא']=23;
y['בית עריף']=43;
y['בית אריה']=74;
y['בית ברל']=42;
y['בית דגן']=43;
y['בית אל']=74;
y['בית אלעזרי']=44;
y['בית עזרא']=61;
y['בית גמליאל']=44;
y['בית גוברין']=61;
y['בית הערבה']=75;
y['בית העמק']=24;
y['בית הגדי']=62;
y['בית הלוי']=41;
y['בית חנן']=44;
y['בית חנניה']=32;
y['בית השיטה']=23;
y['בית חשמונאי']=43;
y['בית חירות']=41;
y['בית הלל']=21;
y['בית חלקיה']=44;
y['בית חורון']=74;
y['בית לחם הגלילית']=23;
y['בית מאיר']=11;
y['בית נחמיה']=43;
y['בית נקופה']=11;
y['בית ניר']=61;
y['בית אורן']=32;
y['בית עובד']=44;
y['בית קמה']=62;
y['בית קשת']=22;
y['בית רבן']=44;
y['בית רימון']=23;
y['בית שאן']=23;
y['בית שערים']=23;
y['בית שמש']=11;
y['בית שקמה']=61;
y['בית עוזיאל']=43;
y['בית ינאי']=41;
y['בית יהושע']=41;
y['בית יצחק-שער חפר']=41;
y['בית יוסף']=23;
y['בית זית']=11;
y['בית זיד']=23;
y['בית זרע']=22;
y['בית צבי']=32;
y['ביתר עילית']=76;
y['בצת']=24;
y['בענה']=24;
y['בנימינה-גבעת עדה']=32;
y['ביר אל-מכסור']=24;
y['ביר הדאג']=62;
y['ביריה']=21;
y['ביתן אהרן']=41;
y['בטחה']=62;
y['ביצרון']=61;
y['בני דקלים']=61;
y['ברוכין']=73;
y['בועיינה-נוגידאת']=25;
y['בוקעאתא']=29;
y['בורגתה']=41;
y['בוסתן הגליל']=24;
y['דבוריה']=23;
y['דפנה']=21;
y['דחי']=23;
y['דאלית אל-כרמל']=31;
y['דליה']=23;
y['דלתון']=21;
y['דן']=21;
y['דברת']=23;
y['דגניה א']=22;
y['דגניה ב']=22;
y['דייר אל-אסד']=24;
y['דייר חנא']=24;
y['דייר ראפאת']=11;
y['דמיידה']=24;
y['דקל']=62;
y['דריגאת']=62;
y['דבורה']=23;
y['דימונה']=62;
y['דישון']=21;
y['דולב']=74;
y['דור']=32;
y['דורות']=61;
y['דובב']=21;
y['דביר']=62;
y['אפרת']=76;
y['עיילבון']=22;
y['עין אל-אסד']=24;
y['עין חוד']=32;
y['עין מאהל']=25;
y['עין נקובא']=11;
y['עין קנייא']=29;
y['עין ראפה']=11;
y['אלעד']=42;
y['אלעזר']=76;
y['אל-רום']=29;
y['אילת']=62;
y['עלי']=72;
y['אלי-עד']=29;
y['אליאב']=61;
y['אליפז']=62;
y['אליפלט']=21;
y['אלישמע']=42;
y['אילון']=24;
y['אלון מורה']=72;
y['אילות']=62;
y['אלקנה']=73;
y['אלקוש']=24;
y['אליכין']=41;
y['אליקים']=23;
y['אלישיב']=41;
y['אמונים']=61;
y['עין איילה']=32;
y['עין דור']=23;
y['עין גדי']=62;
y['עין גב']=22;
y['עין הבשור']=62;
y['עין העמק']=23;
y['עין החורש']=41;
y['עין המפרץ']=24;
y['עין הנציב']=23;
y['עין חרוד (איחוד)']=23;
y['עין חרוד (מאוחד)']=23;
y['עין השלושה']=62;
y['עין השופט']=23;
y['עין חצבה']=62;
y['עין הוד']=32;
y['עין עירון']=32;
y['עין כרם-ביס חקלאי']=11;
y['עין כרמל']=32;
y['עין שריד']=41;
y['עין שמר']=32;
y['עין תמר']=62;
y['עין ורד']=41;
y['עין יעקב']=24;
y['עין יהב']=62;
y['עין זיוון']=29;
y['עין צורים']=61;
y['עינת']=42;
y['ענב']=73;
y['ארז']=61;
y['אשבול']=62;
y['אשל הנשיא']=62;
y['אשחר']=24;
y['אשכולות']=77;
y['אשתאול']=11;
y['איתן']=61;
y['איתנים']=11;
y['אתגר']=24;
y['אבן מנחם']=24;
y['אבן ספיר']=11;
y['אבן שמואל']=61;
y['אבן יהודה']=41;
y['גלעד (אבן יצחק)']=23;
y['עברון']=24;
y['אייל']=42;
y['עזר']=61;
y['עזוז']=62;
y['פסוטה']=24;
y['פוריידיס']=32;
y['געש']=41;
y['געתון']=24;
y['גדיש']=23;
y['גדות']=21;
y['גלאון']=61;
y['גן הדרום']=44;
y['גן השומרון']=32;
y['גן חיים']=42;
y['גן נר']=23;
y['גן שלמה']=44;
y['גן שמואל']=32;
y['גן שורק']=44;
y['גן יבנה']=44;
y['גן יאשיה']=41;
y['גני עם']=42;
y['גני הדר']=43;
y['גני מודיעין']=74;
y['גני טל']=44;
y['גני תקווה']=42;
y['גני יוחנן']=44;
y['גנות']=43;
y['גנות הדר']=41;
y['גת רימון']=42;
y['גת (קיבוץ)']=61;
y['גזית']=23;
y['גיאה']=61;
y['גאליה']=44;
y['גאולי תימן']=41;
y['גאולים']=41;
y['גדרה']=44;
y['גפן']=11;
y['גליל ים']=51;
y['גרופית']=62;
y['גשר']=22;
y['גשר הזיו']=24;
y['גשור']=29;
y['גבע']=23;
y['גבע כרמל']=32;
y['גבע בנימין']=74;
y['גבעות בר']=62;
y['גברעם']=61;
y['גבת']=23;
y['גבים']=61;
y['גבולות']=62;
y['גזר']=43;
y['עגר']=29;
y['גיבתון']=44;
y['גדעונה']=23;
y['גילת']=62;
y['גלגל']=75;
y['גילון']=24;
y['גמזו']=43;
y['גינתון']=43;
y['גיניגר']=23;
y['גינוסר']=22;
y['גיתה']=24;
y['גיתית']=75;
y['גבעת אבני']=22;
y['גבעת ברנר']=44;
y['גבעת אלה']=23;
y['גבעת השלושה']=42;
y['גבעת חיים (איחוד)']=41;
y['גבעת חיים (מאוחד)']=41;
y['גבעת חן']=42;
y['גבעת כח']=42;
y['גבעת נילי']=32;
y['גבעת עוז']=23;
y['גבעת שפירא']=41;
y['גבעת שמש']=11;
y['גבעת שמואל']=42;
y['גבעת יערים']=11;
y['גבעת ישעיהו']=11;
y['גבעת יואב']=29;
y['גבעת זאב']=74;
y['גבעתיים']=52;
y['גבעתי']=61;
y['גבעולים']=62;
y['גבעון החדשה']=74;
y['גבעות עדן']=11;
y['גיזו']=11;
y['גונן']=21;
y['גורן']=24;
y['גורנות הגליל']=24;
y['הבונים']=32;
y['חד-נס']=29;
y['הדר עם']=41;
y['חדרה']=32;
y['חדיד']=43;
y['חפץ חיים']=44;
y['חגי']=77;
y['חגור']=42;
y['הגושרים']=21;
y['החותרים']=32;
y['חיפה']=31;
y['חלוץ']=24;
y['המעפיל']=41;
y['חמדיה']=23;
y['חמאם']=22;
y['חמרה']=75;
y['חניתה']=24;
y['חנתון']=23;
y['חניאל']=41;
y['העוגן']=41;
y['האון']=22;
y['הר אדר']=74;
y['הר עמשא']=62;
y['הר גילה']=76;
y['הראל']=11;
y['הררית']=24;
y['חרשים']=24;
y['הרדוף']=23;
y['חריש']=32;
y['חרוצים']=41;
y['חשמונאים']=74;
y['הסוללים']=23;
y['חספין']=29;
y['חבצלת השרון']=41;
y['הוואשלה (שבט)']=62;
y['היוגב']=23;
y['חצב']=61;
y['חצרים']=62;
y['חצבה']=62;
y['חזון']=22;
y['חצור הגלילית']=21;
y['חצור-אשדוד']=61;
y['הזורעים']=22;
y['הזורע']=23;
y['חפצי-בה']=23;
y['חלץ']=61;
y['חמד']=43;
y['חרב לאת']=41;
y['חרמש']=71;
y['חירות']=41;
y['הרצליה']=51;
y['חבר']=23;
y['חיבת ציון']=41;
y['הילה']=24;
y['חיננית']=71;
y['הוד השרון']=42;
y['הודיות']=22;
y['הודיה']=61;
y['חופית']=41;
y['חגלה']=41;
y['חולית']=62;
y['חולון']=53;
y['חורשים']=42;
y['חוסן']=24;
y['הושעיה']=23;
y['חוגייראת (דהרה)']=24;
y['חולתה']=21;
y['חולדה']=43;
y['חוקוק']=22;
y['חורה']=62;
y['חורפיש']=24;
y['חוסנייה']=24;
y['הוזייל (שבט)']=62;
y['אעבלין']=24;
y['איבים']=61;
y['אבטין']=31;
y['עידן']=62;
y['אכסאל']=23;
y['אילניה']=22;
y['עילוט']=25;
y['עמנואל']=73;
y['עיר אובות']=62;
y['אירוס']=44;
y['עספיא']=31;
y['איתמר']=72;
y['גת']=32;
y['גלגוליה']=42;
y['ירושלים']=11;
y['גש (גוש חלב)']=21;
y['גסר א-זרקא']=32;
y['גדיידה-מכר']=24;
y['גולס']=24;
y['גנאביב (שבט)']=62;
y['כעביה-טבאש-חגאגרה']=25;
y['כברי']=24;
y['כאבול']=24;
y['כדיתה']=21;
y['כדורי']=22;
y['כפר ברא']=42;
y['כפר כמא']=22;
y['כפר כנא']=25;
y['כפר מנדא']=24;
y['כפר מצר']=25;
y['כפר קרע']=32;
y['כפר קאסם']=42;
y['כפר יאסיף']=24;
y['כחל']=21;
y['כלנית']=22;
y['כמון']=24;
y['כנף']=29;
y['כנות']=61;
y['כאוכב אבו אל-היגא']=24;
y['כרי דשא']=22;
y['כרכום']=22;
y['כרמי קטיף']=61;
y['כרמי יוסף']=43;
y['כרמי צור']=77;
y['כרמל']=77;
y['כרמיאל']=24;
y['כרמיה']=61;
y['כפר אדומים']=74;
y['כפר אחים']=61;
y['כפר אביב']=44;
y['כפר עבודה']=41;
y['כפר עזה']=61;
y['כפר ברוך']=23;
y['כפר ביאליק']=31;
y['כפר בילו']=44;
y['כפר בן נון']=43;
y['כפר בלום']=21;
y['כפר דניאל']=43;
y['כפר עציון']=76;
y['כפר גלים']=31;
y['כפר גדעון']=23;
y['כפר גלעדי']=21;
y['כפר גליקסון']=32;
y['כפר חבד']=43;
y['כפר החורש']=23;
y['כפר המכבי']=31;
y['כפר הנגיד']=44;
y['כפר חנניה']=21;
y['כפר הנשיא']=21;
y['כפר הנוער הדתי']=31;
y['כפר האורנים']=74;
y['כפר הריף']=61;
y['כפר הראה']=41;
y['כפר חרוב']=29;
y['כפר חסידים א']=31;
y['כפר חסידים ב']=31;
y['כפר חיים']=41;
y['כפר הס']=41;
y['כפר חיטים']=22;
y['כפר חושן']=21;
y['כפר קיש']=22;
y['כפר מלל']=42;
y['כפר מסריק']=24;
y['כפר מימון']=62;
y['כפר מנחם']=61;
y['כפר מונש']=41;
y['כפר מרדכי']=44;
y['כפר נטר']=41;
y['כפר פינס']=32;
y['כפר ראש הנקרה']=24;
y['כפר רוזנואלד (זרעית)']=24;
y['כפר רופין']=23;
y['כפר רות']=43;
y['כפר סבא']=42;
y['כפר שמאי']=21;
y['כפר שמריהו']=51;
y['כפר שמואל']=43;
y['כפר סילבר']=61;
y['כפר סירקין']=42;
y['כפר סאלד']=21;
y['כפר תפוח']=73;
y['כפר תבור']=22;
y['כפר טרומן']=43;
y['כפר אוריה']=11;
y['כפר ויתקין']=41;
y['כפר ורבורג']=61;
y['כפר ורדים']=24;
y['כפר יעבץ']=41;
y['כפר יחזקאל']=23;
y['כפר יהושע']=23;
y['כפר יונה']=41;
y['כפר זיתים']=22;
y['כפר זוהרים']=11;
y['כליל']=24;
y['כמהין']=62;
y['כרמים']=62;
y['כרם בן שמן']=43;
y['כרם בן זמרה']=21;
y['כרם ביבנה (ישיבה)']=44;
y['כרם מהרל']=32;
y['כרם שלום']=62;
y['כסלון']=11;
y['חואלד (שבט)']=25;
y['חואלד']=31;
y['כנרת (מושבה)']=22;
y['כנרת (קבוצה)']=22;
y['כישור']=24;
y['כסרא-סמיע']=24;
y['כיסופים']=62;
y['כחלה']=62;
y['כוכב השחר']=74;
y['כוכב מיכאל']=61;
y['כוכב יעקב']=74;
y['כוכב יאיר']=42;
y['כורזים']=21;
y['כסיפה']=62;
y['להב']=62;
y['להבות הבשן']=21;
y['להבות חביבה']=32;
y['לכיש']=61;
y['לפיד']=43;
y['לפידות']=24;
y['לקיה']=62;
y['לביא']=22;
y['לבון']=24;
y['להבים']=62;
y['שריגים (לי-און)']=11;
y['לימן']=24;
y['לבנים']=22;
y['לוד']=43;
y['לוחמי הגיטאות']=24;
y['לוטן']=62;
y['לוטם']=24;
y['לוזית']=11;
y['מעגן']=22;
y['מעגן מיכאל']=32;
y['מעלה אדומים']=76;
y['מעלה עמוס']=76;
y['מעלה אפרים']=75;
y['מעלה גמלא']=29;
y['מעלה גלבוע']=23;
y['מעלה החמישה']=11;
y['מעלה עירון']=32;
y['מעלה לבונה']=74;
y['מעלה מכמש']=74;
y['מעלות-תרשיחא']=24;
y['מענית']=32;
y['מעש']=42;
y['מעברות']=41;
y['מעגלים']=62;
y['מעון']=77;
y['מאור']=32;
y['מעוז חיים']=23;
y['מעין ברוך']=21;
y['מעין צבי']=32;
y['מבועים']=62;
y['מגן']=62;
y['מגן שאול']=23;
y['מגל']=32;
y['מגשימים']=42;
y['מחניים']=21;
y['צוקים']=62;
y['מחנה הילה']=44;
y['מחנה מרים']=61;
y['מחנה טלי']=62;
y['מחנה תל נוף']=44;
y['מחנה יפה']=62;
y['מחנה יתיר']=62;
y['מחנה יהודית']=23;
y['מחנה יוכבד']=62;
y['מחסיה']=11;
y['מגד אל-כרום']=24;
y['מגדל שמס']=29;
y['מכחול']=62;
y['מלכיה']=21;
y['מנוף']=24;
y['מנות']=24;
y['מנשית זבדה']=25;
y['מרגליות']=21;
y['מסעדה']=29;
y['מסעודין אל-עזאזמה']=62;
y['משאבי שדה']=62;
y['משען']=61;
y['משכיות']=75;
y['מסלול']=62;
y['מסד']=22;
y['מסדה']=22;
y['משואה']=75;
y['משואות יצחק']=61;
y['מטע']=11;
y['מתן']=42;
y['מתת']=24;
y['מתתיהו']=74;
y['מבקיעים']=61;
y['מזכרת בתיה']=44;
y['מצליח']=43;
y['מזור']=42;
y['מזרעה']=24;
y['מצובה']=24;
y['מי עמי']=32;
y['מאיר שפיה']=32;
y['מעונה']=24;
y['מפלסים']=61;
y['מגדים']=32;
y['מגידו']=23;
y['מחולה']=75;
y['מייסר']=32;
y['מכורה']=75;
y['מלאה']=23;
y['מלילות']=62;
y['מנחמיה']=22;
y['מנרה']=21;
y['מנוחה']=61;
y['מירב']=23;
y['מרחב עם']=62;
y['מרחביה (מושב)']=23;
y['מרחביה (קיבוץ)']=23;
y['מרכז שפירא']=61;
y['מרום גולן']=29;
y['מירון']=21;
y['מישר']=44;
y['משהד']=25;
y['מסילת ציון']=11;
y['מסילות']=23;
y['מיטל']=23;
y['מיתר']=62;
y['מיטב']=23;
y['מטולה']=21;
y['מבשרת ציון']=11;
y['מבוא ביתר']=11;
y['מבוא דותן']=71;
y['מבוא חמה']=29;
y['מבוא חורון']=74;
y['מבוא מודיעים']=43;
y['מבואות ים']=41;
y['מבואות יריחו']=75;
y['מצדות יהודה']=77;
y['מיצר']=29;
y['מצר']=32;
y['מעיליא']=24;
y['מדרך עוז']=23;
y['מדרשת בן גוריון']=62;
y['מדרשת רופין']=41;
y['מגדל']=22;
y['מגדל העמק']=23;
y['מגדל עוז']=76;
y['מגדלים']=72;
y['מכמנים']=24;
y['מכמורת']=41;
y['מקווה ישראל']=53;
y['משגב עם']=21;
y['משגב דב']=44;
y['משמר איילון']=43;
y['משמר דוד']=43;
y['משמר העמק']=23;
y['משמר הנגב']=62;
y['משמר השרון']=41;
y['משמר השבעה']=43;
y['משמר הירדן']=21;
y['משמרות']=32;
y['משמרת']=41;
y['מצפה אילן']=32;
y['מבטחים']=62;
y['מצפה']=22;
y['מצפה אביב']=24;
y['מצפה נטופה']=23;
y['מצפה רמון']=62;
y['מצפה שלם']=75;
y['מצפה יריחו']=75;
y['מזרע']=23;
y['מודיעין עילית']=74;
y['מודיעין-מכבים-רעות']=43;
y['מולדת']=23;
y['מורן']=24;
y['מורשת']=24;
y['מוצא עילית']=11;
y['מגאר']=22;
y['מוקייבלה']=23;
y['נעלה']=74;
y['נען']=43;
y['נערן']=75;
y['נאעורה']=23;
y['נעמה']=75;
y['אשבל']=24;
y['חמדת']=75;
y['נחל עוז']=61;
y['שיטים']=62;
y['נחלה']=61;
y['נהלל']=23;
y['נחליאל']=74;
y['נחם']=11;
y['נהריה']=24;
y['נחף']=24;
y['נחשולים']=32;
y['נחשון']=11;
y['נחשונים']=42;
y['נצאצרה (שבט)']=62;
y['נטף']=11;
y['נטור']=29;
y['נווה']=62;
y['נצרת']=25;
y['נאות גולן']=29;
y['נאות הכיכר']=62;
y['נאות מרדכי']=21;
y['נעורים']=41;
y['נגבה']=61;
y['נגוהות']=77;
y['נחלים']=42;
y['נהורה']=61;
y['נחושה']=11;
y['ניין']=23;
y['נס עמים']=24;
y['נס הרים']=11;
y['נס ציונה']=44;
y['נשר']=31;
y['נטע']=61;
y['נטעים']=44;
y['נתניה']=41;
y['נתיב העשרה']=61;
y['נתיב הגדוד']=75;
y['נתיב הלה']=11;
y['נתיב השיירה']=24;
y['נתיבות']=62;
y['נטועה']=24;
y['נבטים']=62;
y['נוה צוף']=74;
y['נווה אטיב']=29;
y['נווה אבות']=32;
y['נווה דניאל']=76;
y['נווה איתן']=23;
y['נווה חריף']=62;
y['נווה אילן']=11;
y['נווה מיכאל']=11;
y['נווה מבטח']=61;
y['נווה שלום']=11;
y['נווה אור']=23;
y['נווה ים']=32;
y['נווה ימין']=42;
y['נווה ירק']=42;
y['נווה זיו']=24;
y['נווה זוהר']=62;
y['נצר חזני']=44;
y['נצר סרני']=43;
y['נילי']=74;
y['נמרוד']=29;
y['ניר עם']=61;
y['ניר עקיבא']=62;
y['ניר בנים']=61;
y['ניר דוד (תל עמל)']=23;
y['ניר אליהו']=42;
y['ניר עציון']=32;
y['ניר גלים']=44;
y['ניר חן']=61;
y['ניר משה']=62;
y['ניר עוז']=62;
y['ניר יפה']=23;
y['ניר ישראל']=61;
y['ניר יצחק']=62;
y['ניר צבי']=43;
y['נירים']=62;
y['נירית']=42;
y['ניצן']=61;
y['ניצן ב']=61;
y['ניצנה (קהילת חינוך)']=62;
y['ניצני עוז']=41;
y['ניצני סיני']=62;
y['ניצנים']=61;
y['נועם']=61;
y['נוף איילון']=43;
y['נוף הגליל']=25;
y['נופך']=42;
y['נופים']=73;
y['נופית']=31;
y['נוגה']=61;
y['נוקדים']=76;
y['נורדיה']=41;
y['נוב']=29;
y['נורית']=23;
y['אודם']=29;
y['אופקים']=62;
y['עופר']=32;
y['עופרה']=74;
y['אוהד']=62;
y['עולש']=41;
y['אומן']=23;
y['עומר']=62;
y['אומץ']=41;
y['אור עקיבא']=32;
y['אור הגנוז']=21;
y['אור הנר']=61;
y['אור יהודה']=52;
y['אורה']=11;
y['אורנים']=31;
y['אורנית']=73;
y['אורות']=61;
y['אורטל']=29;
y['עתניאל']=77;
y['עוצם']=61;
y['פעמי תשז']=62;
y['פלמחים']=44;
y['פארן']=62;
y['פרדס חנה-כרכור']=32;
y['פרדסיה']=41;
y['פרוד']=21;
y['פטיש']=62;
y['פדיה']=43;
y['פדואל']=73;
y['פדויים']=62;
y['פלך']=24;
y['פני חבר']=77;
y['פקיעין (בוקייעה)']=24;
y['פקיעין חדשה']=24;
y['פרזון']=23;
y['פרי גן']=62;
y['פסגות']=74;
y['פתח תקווה']=42;
y['פתחיה']=43;
y['פצאל']=75;
y['פורת']=41;
y['פוריה עילית']=22;
y['פוריה - כפר עבודה']=22;
y['פוריה - נווה עובד']=22;
y['קבועה (שבט)']=62;
y['קדרים']=22;
y['קדימה-צורן']=41;
y['קלנסווה']=41;
y['קליה']=75;
y['קרני שומרון']=73;
y['קוואעין (שבט)']=62;
y['קציר']=32;
y['קצרין']=29;
y['קדר']=76;
y['קדמה']=61;
y['קדומים']=73;
y['קלע']=29;
y['קלחים']=62;
y['קיסריה']=32;
y['קשת']=29;
y['קטורה']=62;
y['קבוצת יבנה']=44;
y['קדמת צבי']=29;
y['קדרון']=44;
y['קרית ענבים']=11;
y['קרית ארבע']=77;
y['קרית אתא']=31;
y['קרית ביאליק']=31;
y['קרית עקרון']=44;
y['קרית גת']=61;
y['קרית מלאכי']=61;
y['קרית מוצקין']=31;
y['קרית נטפים']=73;
y['קרית אונו']=52;
y['קרית שלמה']=41;
y['קרית שמונה']=21;
y['קרית טבעון']=31;
y['קרית ים']=31;
y['קרית יערים']=11;
y['קרית יערים(מוסד)']=11;
y['קוממיות']=61;
y['קורנית']=24;
y['קודייראת א-צאנע(שבט)']=62;
y['רעננה']=42;
y['רהט']=62;
y['רם-און']=23;
y['רמת דוד']=23;
y['רמת גן']=52;
y['רמת הכובש']=42;
y['רמת השרון']=51;
y['רמת השופט']=23;
y['רמת מגשימים']=29;
y['רמת רחל']=11;
y['רמת רזיאל']=11;
y['רמת ישי']=23;
y['רמת יוחנן']=31;
y['רמת צבי']=23;
y['ראמה']=24;
y['רמלה']=43;
y['רמות']=29;
y['רמות השבים']=42;
y['רמות מאיר']=43;
y['רמות מנשה']=23;
y['רמות נפתלי']=21;
y['רנן']=62;
y['רקפת']=24;
y['ראס אל-עין']=24;
y['ראס עלי']=31;
y['רביד']=22;
y['רעים']=62;
y['רגבים']=32;
y['רגבה']=24;
y['ריחן']=71;
y['רחלים']=72;
y['רחוב']=23;
y['רחובות']=44;
y['ריחאניה']=21;
y['ריינה']=25;
y['רכסים']=31;
y['רשפים']=23;
y['רתמים']=62;
y['רבדים']=61;
y['רבבה']=72;
y['רביבים']=62;
y['רווחה']=61;
y['רוויה']=23;
y['רימונים']=74;
y['רינתיה']=42;
y['ראשון לציון']=44;
y['רשפון']=41;
y['רועי']=75;
y['ראש העין']=42;
y['ראש פינה']=21;
y['ראש צורים']=76;
y['רותם']=75;
y['רוח מדבר']=62;
y['רוחמה']=61;
y['רומת הייב']=25;
y['רומאנה']=25;
y['סעד']=62;
y['סער']=24;
y['סעוה']=62;
y['סאגור']=24;
y['סחנין']=24;
y['סלעית']=73;
y['סלמה']=24;
y['סמר']=62;
y['צנדלה']=23;
y['ספיר']=62;
y['שריד']=23;
y['סאסא']=21;
y['סביון']=42;
y['סואעד (כמאנה) (שבט)']=24;
y['סואעד (חמרייה)']=24;
y['סייד (שבט)']=62;
y['שדי אברהם']=62;
y['שדה בוקר']=62;
y['שדה דוד']=61;
y['שדה אליעזר']=21;
y['שדה אליהו']=23;
y['שדי חמד']=42;
y['שדה אילן']=22;
y['שדה משה']=61;
y['שדה נחום']=23;
y['שדה נחמיה']=21;
y['שדה ניצן']=62;
y['שדי תרומות']=23;
y['שדה עוזיהו']=61;
y['שדה ורבורג']=42;
y['שדה יעקב']=23;
y['שדה יצחק']=32;
y['שדה יואב']=61;
y['שדה צבי']=62;
y['שדרות']=61;
y['שדות מיכה']=11;
y['שדות ים']=32;
y['שגב-שלום']=62;
y['סגולה']=61;
y['שניר']=21;
y['שעב']=24;
y['שעל']=29;
y['שעלבים']=43;
y['שער אפרים']=41;
y['שער העמקים']=31;
y['שער הגולן']=22;
y['שער מנשה']=32;
y['שער שומרון']=73;
y['שדמות דבורה']=22;
y['שדמות מחולה']=75;
y['שפיר']=61;
y['שחר']=61;
y['שחרות']=62;
y['שלווה במדבר']=62;
y['שלווה']=61;
y['שמרת']=24;
y['שמיר']=21;
y['שני']=62;
y['שקד']=71;
y['שרונה']=22;
y['שרשרת']=62;
y['שבי דרום']=62;
y['שבי שומרון']=72;
y['שבי ציון']=24;
y['שאר ישוב']=21;
y['שדמה']=44;
y['שפרעם']=24;
y['שפיים']=41;
y['שפר']=21;
y['שייח דנון']=24;
y['שכניה']=24;
y['שלומי']=24;
y['שלוחות']=23;
y['שקף']=61;
y['שתולה']=24;
y['שתולים']=61;
y['שיזף']=62;
y['שזור']=24;
y['שיבולים']=62;
y['שבלי - אום אל-גנם']=23;
y['שילת']=43;
y['שילה']=74;
y['שמעה']=77;
y['שמשית']=23;
y['נאות סמדר']=62;
y['שלומית']=62;
y['שואבה']=11;
y['שוהם']=43;
y['שומרה']=24;
y['שומריה']=62;
y['שוקדה']=62;
y['שורשים']=24;
y['שורש']=11;
y['שושנת העמקים']=41;
y['צוקי ים']=41;
y['שובל']=62;
y['שובה']=62;
y['סתריה']=43;
y['סופה']=62;
y['סולם']=23;
y['סוסיה']=77;
y['תעוז']=11;
y['טל שחר']=11;
y['טל-אל']=24;
y['תלמי בילו']=62;
y['תלמי אלעזר']=32;
y['תלמי אליהו']=62;
y['תלמי יפה']=61;
y['תלמי יחיאל']=61;
y['תלמי יוסף']=62;
y['טלמון']=74;
y['טמרה']=24;
y['טמרה (יזרעאל)']=23;
y['תראבין א-צאנע(ישוב)']=62;
y['תראבין א-צאנע (שבט)']=62;
y['תרום']=11;
y['טייבה']=41;
y['טייבה (בעמק)']=23;
y['תאשור']=62;
y['טפחות']=22;
y['תל עדשים']=23;
y['תל אביב - יפו']=51;
y['תל מונד']=41;
y['תל קציר']=22;
y['תל שבע']=62;
y['תל תאומים']=23;
y['תל ציון']=74;
y['תל יצחק']=41;
y['תל יוסף']=23;
y['טללים']=62;
y['תלמים']=61;
y['תלם']=77;
y['טנא']=77;
y['תנובות']=41;
y['תקוע']=76;
y['תקומה']=62;
y['טבריה']=22;
y['תדהר']=62;
y['תפרח']=62;
y['תימורים']=61;
y['תמרת']=23;
y['טירת כרמל']=31;
y['טירת יהודה']=42;
y['טירת צבי']=23;
y['טירה']=41;
y['תירוש']=11;
y['תומר']=75;
y['רמת טראמפ']=29;
y['טובא-זנגריה']=21;
y['טורעאן']=25;
y['תושיה']=62;
y['תובל']=24;
y['אודים']=41;
y['אום אל-פחם']=32;
y['אום אל-קוטוף']=32;
y['אום בטין']=62;
y['עוקבי (בנו עוקבה)']=62;
y['אורים']=62;
y['אושה']=31;
y['עוזה']=61;
y['עוזייר']=25;
y['ורדון']=61;
y['ורד יריחו']=75;
y['יעד']=24;
y['יערה']=24;
y['יעל']=23;
y['יד בנימין']=44;
y['יד חנה']=41;
y['יד השמונה']=11;
y['יד מרדכי']=61;
y['יד נתן']=61;
y['יד רמבם']=43;
y['יפיע']=25;
y['יפית']=75;
y['יגל']=43;
y['יגור']=31;
y['יהל']=62;
y['יכיני']=61;
y['יאנוח-גת']=24;
y['ינוב']=41;
y['יקיר']=73;
y['יקום']=41;
y['ירדנה']=23;
y['ירחיב']=42;
y['ירקונה']=42;
y['יסעור']=24;
y['ישרש']=43;
y['יתד']=62;
y['יבנה']=44;
y['יבנאל']=22;
y['יציץ']=43;
y['יעף']=41;
y['ידידה']=11;
y['כפר ידידיה']=41;
y['יחיעם']=24;
y['יהוד-מונוסון']=42;
y['ירוחם']=62;
y['ישע']=62;
y['יסודות']=44;
y['יסוד המעלה']=21;
y['יבול']=62;
y['יפעת']=23;
y['יפתח']=21;
y['ינון']=61;
y['יראון']=21;
y['ירכא']=24;
y['ישעי']=11;
y['ייטב']=75;
y['יצהר']=72;
y['יזרעאל']=23;
y['יודפת']=24;
y['יונתן']=29;
y['יקנעם עילית']=23;
y['יקנעם (מושבה)']=23;
y['יושיביה']=62;
y['יטבתה']=62;
y['יובל']=21;
y['יובלים']=24;
y['זבארגה (שבט)']=62;
y['צפרירים']=11;
y['צפריה']=43;
y['זנוח']=11;
y['זרזיר']=23;
y['זבדיאל']=61;
y['צאלים']=62;
y['צפת']=21;
y['זכריה']=11;
y['צלפון']=11;
y['זמר']=41;
y['זרחיה']=61;
y['זרועה']=62;
y['צרופה']=32;
y['זיתן']=43;
y['זכרון יעקב']=32;
y['זמרת']=62;
y['ציפורי']=23;
y['זיקים']=61;
y['צבעון']=21;
y['צופר']=62;
y['צופית']=42;
y['צופיה']=44;
y['זוהר']=61;
y['צוחר']=62;
y['צרעה']=11;
y['צובה']=11;
y['צופים']=73;
y['צור הדסה']=11;
y['צור משה']=41;
y['צור נתן']=42;
y['צור יצחק']=42;
y['צוריאל']=24;
y['צורית']=24;
y['צביה']=24;

})(); 
