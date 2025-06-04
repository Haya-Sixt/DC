// ==UserScript==
// @name         🖥️
// @namespace    🐵
// @version      1
// @description  🔮,👁️‍🗨️,📒
// @run-at       document-start
// @match        http://localhost:8181/DC/index.html*
// @match        https://trigger.macrodroid.com/%7B%F0%9F%8F%A1%7D/*
// @match        https://keep.google.com/u/1/?%F0%9F%90%B5
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getTabs
// @grant        GM_saveTab
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus 
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// ==/UserScript==


// App
const $app = (()=> { try { return document.querySelector('html')[GM_info.script.namespace] ?? Object.create (top.document.querySelector('html')[GM_info.script.namespace]) } catch { return {  get NS() { return (e = GM_info)=> { with (e.script) { return `${namespace}.${name}.` } } }  } } })();
if (!$app.Close) { $app.Close = force=> {
  if ( $app.I.tb && document.querySelector (`#${$app.I.tb}_Back`) ) return window.dispatchEvent (new Event(`${$app.I.tb}_Back_DblC`));
  try { // 🗒: 🥝 - all three methods will only replace into 'New Tab'. 
    open(location, '_self').close();
    window.close();
  }
  finally { setInterval (()=> window.history.back(), 200) }
} }
if (typeof $app.isDroid == "undefined") Object.defineProperty ($app, 'isDroid', { get () { return navigator.maxTouchPoints == 5 || window.orientation != undefined } });
$app.$dc = { 
  NS: $app.NS (GM_info),
  get I() { return { n: GM_info.script.name, ns: GM_info.script.namespace, ni: GM_info.script.namespace, coordinator: '🤖' } }
}; 


//
const O = (o, pn, srch)=> location.origin.includes(o) && (!pn || location.pathname.toLowerCase() == `/${pn}`.replace ('//', '/')) && (!srch || location.search.match (srch)); 

// 🐵 🐛 
$app.isDroid && (()=>{ const og_GM_openInTab = GM_openInTab; GM_openInTab = (h, o)=> { const e = og_GM_openInTab (h, o); o?.active == false && window.focus (); return e } })();



// 🐵
$app.$dc.uw = (()=> {

//
let uw; 
if (!(uw = unsafeWindow[$app.$dc.I.ns])) uw = unsafeWindow[$app.$dc.I.ns] = {};
 
//
uw.Notification = (b, t = $app.$dc.I.ni)=> GM_notification(t == $app.$dc.I.ni ? `${$app.$dc.I.n}.${b}` : b, t);
//
uw.Close = ()=> $app.Close ();
//
uw.OpenInTab = (h, o)=> GM_openInTab (h, o);
// 
uw.GetValue = (k, v)=> GM_getValue (`${$app.$dc.NS}${k}`, v);
// 
uw.SetValue = (k, v)=> GM_setValue (`${$app.$dc.NS}${k}`, v);
// 
uw.GetTabs = cb=> GM_getTabs (cb);
// 
uw.SaveTab = e=> GM_saveTab (e);
//
uw.AddValueChangeListener = (k, cb)=> GM_addValueChangeListener (`${$app.$dc.NS}${k}`, cb);
// 
uw.Focus = ()=> window.focus ();
// 
uw.AddStyle = e=> GM_addStyle (e); 

return uw;
})();



// 🍏
if (O('localhost', '/dc/index.html')) return (()=> { 

$app.$dc.uw.Ready = true;

// 🗺️
// console.cloud.google.com/apis/credentials?project=...
sessionStorage.setItem("🗺️", "AIzaSyBNb4RWDxssA2qQ8sj0Xmz1M_u1bIV2CW0");

})();



// 🏡
if (O('trigger.macrodroid.com')) return (()=> {
  location.replace (location.href.replace (encodeURI('{🏡}'), 'bfc42e8b-1e90-4835-870c-d5a6a1aa11cc'));
})();



// 📒 
if (O('keep.google.com')) return (()=> {

//
function Load () {
  i_init = setInterval(Init, 1000);
}

let i_init
async function Init () {
  const refresh = document.querySelector ('div[aria-label="Refresh"]');
  if (!refresh || refresh.previousSibling.style.display!='none') return;

  Notes ();
}

//
let notes;
function Notes () {
  const q = 'div.notes-container div[style*="height"] div[aria-label="Select archived note"]',
    a = document.querySelectorAll (q);

  if (!a.length) return;
  clearInterval(i_init);

  notes = Array.from (a);

  Note (notes.pop());
}

//
let i_note;
function Note (n) {
  if (n) {
    n.parentNode.click();
    i_note = setInterval (Note, 1000);
  }

  //
  const q = 'div[style*="left:"][style*="top:"] div[role="textbox"]', 
    a = document.querySelectorAll(q);

  if (!a.length) return;
  clearInterval (i_note);

  let title = "", body = "";
  for (let r of a) {
    r = r.textContent;
    if (title == "") title = r
    else {
      if (r.includes(' Completed items')) break;
      if (body != "") body += "<br>";
      body += r;
    }
  }

  rs != "" ? rs += "," : rs = "[";
  rs += JSON.stringify ([title,body]);
  n = notes.pop();
  if (n) Note (n)
  else Done ();
}

let rs = '';
function Done () {
  rs += "]";
  GM_setClipboard (rs);
  dispatchEvent (new Event(`${$app.I.tb}_Back_DblC`));
}

//
setTimeout (()=> $app.Close (), 10*60*1000); // 🦺
addEventListener($app.E.rsc, Load); // 'interactive' doesn't work (and also 'DOMContentLoaded') 

})();





// @match        https://web.whatsapp.com/?%F0%9F%90%B5
// @match        https://copilot.microsoft.com/?%F0%9F%90%B5
 
// 🔮
// 🗒 include urls (web.whatsapp.com, copilot.microsoft.com) in "Always active window" extension: 1. In its own config  2. In the Extentions -> -> Site access.
// if (O('copilot.microsoft.com')) return (()=> {

// const c_name = '🔮', 
//   M = (m = "bot")=> document.querySelector("cib-serp")?.shadowRoot?.querySelector("cib-conversation")?.shadowRoot?.querySelector("cib-chat-turn")?.shadowRoot?.querySelector(`cib-message-group[source="${m}"]`)?.shadowRoot,
//   R = (a, q = c_name) => $app.$dc.uw.SetValue (`${c_name}.💬`, JSON.stringify ({q: escape (q), a: escape (a)}));
 
// //
// async function Load () {
//   Mic ();
//   Focus ();
// }

// //
// function Mic (steps = 20) {
//   const e = document.querySelector("cib-serp")?.shadowRoot?.querySelector("#cib-action-bar-main")?.shadowRoot?.querySelector('button[aria-label="Use microphone"]');
//   if (--steps < 0) return Failed ();
//   if (!e) return setTimeout (Mic, 1000, steps);
//   e.click ();
//   setTimeout (Respond, 3000);
// }

// //
// function Failed (er) {
//   try { R (`❌ ${er}`) }
//   finally { try { $app.Close () } catch { focus.remove () } }
// }

// function Respond (steps = 20) {
//   const e = document.querySelector("#b_sydConvCont > cib-serp")?.shadowRoot?.querySelector("#cib-action-bar-main")?.shadowRoot?.querySelector("div > cib-typing-indicator");
//   if (--steps < 0) return Failed ();
//   if (!e || '0' == $app.Css ('opacity', e)) return setTimeout (Respond, 1000, steps);
//   setTimeout (Done, 3000); 
// }

// //
// function Done (steps = 20, l) {
//   const mlength = 300, // 🗒 arbitrary  
//     a = Array.from (M ()?.querySelectorAll("cib-message") ?? [])?.reduce ((iv, e)=> { return `${e?.shadowRoot?.textContent?.replace ('Sent by Copilot:', '')?.replace ('יוצר תשובות עבורך…','')?.replace ('האם יש לך שאלות נוספות בנושא?', '')?.trim ()?.slice (0, mlength) }${iv}` }, '');
//   if (--steps >= 0 && (!a || a.length != l)) return setTimeout (Done, 1000, steps, a?.length);
//   $app.$dc.uw.SetValue (`${c_name}.🎤`, Date.now ()); 
//   if (!a) return Failed ();
//   setTimeout (()=> $app.Close (), 30*1000);
//   GM_notification (`${$app.$dc.NS}${c_name}.Done`, $app.$dc.I.ni);
//   const q = M ("user")?.querySelector("cib-message")?.shadowRoot?.querySelector("cib-shared > div > div")?.textContent?.trim ()?.slice (0, mlength);
//   R (a, q);
//   Speaker ();
// }

// //
// function Speaker () {
//   const e = M ()?.querySelector("cib-message")?.shadowRoot?.querySelector("div > cib-message-actions")?.shadowRoot?.querySelector("div > cib-read-aloud")?.shadowRoot?.querySelector("button");
//   e?.click ();
// }

// //
// let focus;
// function Focus () {
//   focus = document.createElement ('div');
//   with (focus) {
//     style.position = "absolute";
//     style.top = "-100vh";
//     textContent = `${$app.$dc.I.n}.${$app.$dc.I.coordinator}`;
//   }
//   document.body.appendChild (focus);
//   window.focus (); 
// }

// //
// $app.$dc.uw.AddValueChangeListener (c_name, Failed);
// setTimeout (Failed, 2*60*1000, "🦺");
// document.addEventListener ("readystatechange", ()=> event.target.readyState == "complete" && Load ()); // 🗒: 'rsc' event isn't on iframe

// })();




// 👁️‍🗨️
// 🗒 See 🗒 about "Always active window" extension.
// if (O('web.whatsapp.com')) return (()=> {

// //
// async function Load () {
//   const c_name = '👁️‍🗨️', chat = `#side span[title="קהילת בית הכנסת חורש רמות"]`, 
//     message = '#main div[role="row"] div[aria-label="Open picture"] > div > div > img[alt*="זמני התפילות"]', 
//     download = '#app div[role="button"][title="Download"]';

//   Click (chat)
//     .then (()=> Click (message))
//     .then (()=> Click (download))
//     .then (()=> $app.$dc.uw.SetValue (c_name, new Date().getDate ()) ) 
//     .catch (reason=> {
//       if (reason.cause) reason = "Had previously handled catch";
//       GM_notification (`cause: ${reason}`, `${$app.$dc.NS}${c_name} ⚠`);
//     })
//     .finally (Close);
// }


// //
// async function Click (sel, steps = 10) {
//   const C = e=> ['mousedown', 'click', 'mouseup'].forEach (t => e.dispatchEvent (new MouseEvent (t, {view: unsafeWindow, bubbles: true, cancelable: true, buttons: 1}))), 
//     Repeat = (steps)=> setTimeout (Resolve, 3000),
//     Resolve = ()=> {
//       console.log (sel, steps);
//         let ok;
//         if (!steps) return reject (`couldn't find ${sel}`);
//         try { ok = Array.from ( document.querySelectorAll (sel) ).findLast(e=>1) } catch (er) { console.error(sel, er) }
//         if (!ok) return Repeat (--steps);
//         C (ok); 
//         resolve (); 
//       }; 
//   let resolve, reject;
//   return new Promise ((i_resolve, i_reject)=> Resolve (resolve = i_resolve, reject = i_reject)); 
// }

// //
// function Close () {
//   $app.Close ()
// }

// //
// function Failed () {
//   Close ()
// }

// //
// $app.$dc.uw.AddValueChangeListener (c_name, Failed);
// setTimeout (Failed , 20*60*1000); // 🦺
// document.addEventListener ("readystatechange", ()=> event.target.readyState == "complete" && Load ()); // 🗒: 'rsc' event isn't on iframe

// })();
