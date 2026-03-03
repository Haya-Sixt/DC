// ==UserScript==
// @name         🖥️
// @namespace    🐵
// @run-at       document-start
// @include      http://localhost:8181/DC/index.html*

// @grant        GM_openInTab
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle

//// @grant        GM.notification
//// @grant        GM_notification
//// @grant        GM.getTabs
//// @grant        GM_getTabs
//// @grant        GM.saveTab
//// @grant        GM_saveTab
//// @grant        unsafeWindow
//// @grant        window.close
//// @grant        window.focus 
// ==/UserScript==

(()=> {
alert('via script');
console.log ("GM_info.script", GM_info.script);
console.log ("GM.setClipboard",GM.setClipboard);
console.log ("GM.notification",GM.notification);
console.log ("GM_openInTab",GM_openInTab);
console.log ("GM.getValue",GM.getValue );
console.log ("GM.setValue",GM.setValue);
console.log ("GM.getTabs",GM.getTabs);
console.log ("GM.saveTab",GM.saveTab);
//console.log ("unsafeWindow",unsafeWindow);
console.log ("window.close",window.close);
console.log ("window.focus ",window.focus);
console.log ("GM_addValueChangeListener",GM_addValueChangeListener);
console.log ("GM_addStyle",GM_addStyle);
console.log ("GM_notification",GM_notification);
//console.log ("GM_getTabs",GM_getTabs);
//console.log ("GM_saveTab",GM_saveTab);
})



// App
const ns = '🐵', $app = { 
  get _NS() { return (e = GM_info)=> `${ns}.${e.script.name}.` }
};

$app.Close = force=> {
  try {
    open(location, '_self').close();
    window.close();
  }
  finally { setInterval (()=> window.history.back(), 200) }
};

$app.$dc = { 
  NS: $app._NS (GM_info),
  get I() { return { n: GM_info.script.name, ns: ns, ni: ns, coordinator: '🤖' } }
}; 



const _GM_openInTab = GM_openInTab; 
  GM_openInTab = (h, o)=> { const e = _GM_openInTab (h, o); o?.active == false && window.focus (); return e };

GM.getTabs = async ()=>[];
GM.saveTab = async ()=>{};
GM.notification = async ()=>{};
window.unsafeWindow = window;



// 🐵
$app.$dc.uw = (()=> {

//
const uw = unsafeWindow[$app.$dc.I.ns] = {};
 
//
uw.Notification = async (b, t = $app.$dc.I.ni)=> await GM.notification({text: t == $app.$dc.I.ni ? `${$app.$dc.I.n}.${b}` : b, title: t, timeout: 3000 });
//
uw.Close = ()=> $app.Close ();
//
uw.OpenInTab = (h, o)=> GM_openInTab (h, o);
// 
uw.GetValue = async (k, v)=> (await GM.getValue (`${$app.$dc.NS}${k}`, v));
// 
uw.SetValue = async (k, v)=> (await GM.setValue (`${$app.$dc.NS}${k}`, v));
// 
uw.GetTabs = async (cb)=> { const ts = await GM.getTabs (); return typeof cb == 'function' ? await cb(ts) : ts};
// 
uw.SaveTab = async (e)=> (await GM.saveTab (e));
//
uw.AddValueChangeListener = (k, cb)=> GM_addValueChangeListener (`${$app.$dc.NS}${k}`, cb);
// 
uw.Focus = ()=> window.focus ();
// 
uw.AddStyle = e=> GM_addStyle (e); 

return uw;
})();


// 🗺️
// console.cloud.google.com/apis/credentials?project=...
sessionStorage.setItem("🗺️", "AIzaSyBNb4RWDxs____sA2qQ8sj0Xmz1M_u1bIV2CW0");


$app.$dc.uw.Ready = true;
