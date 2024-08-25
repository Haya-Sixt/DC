// Default model  : https://github.com/Picovoice/porcupine/blob/master/lib/common/porcupine_params.pv 
// Base64 (pv.js) : npx pvbase64 -i ${MODEL_FILE} -o ${OUTPUT_DIRECTORY}/${MODEL_NAME}.js
//import { modelParams } from "/DC/🔮/model.pv.js"


//importScripts ("node_modules/@picovoice/web-voice-processor/dist/iife/index.js")
importScripts ("/node_modules/@picovoice/porcupine-web/dist/iife/index.js")
  
//importScripts ("/DC/🔮/model.pv.js")
const porcupineModel = {
  publicPath: "/DC/🔮/porcupine_params.pv",
  // or
  //base64: modelParams,

  // Optional
  //customWritePath: 'custom_model',
  //forceWrite: true,
  version: 1,
}

let handle 
(async ()=> {
handle = await PorcupineWeb.PorcupineWorker.create (
	"62rt0wJ+7fSkKW1qGKh+f/0rH5BSb6moJtgTWl0kQzw8dEIygXxsRw==",
	PorcupineWeb.BuiltInKeyword.Porcupine,
	keywordDetectionCallback,
	porcupineModel,
	{ processErrorCallback: processErrorCallback } // options
)})();

/*
let handle, i_handle = setInterval (async ()=> {
	if (typeof PorcupineWeb?.PorcupineWorker == 'undefined') return;
console.log ('PorcupineWorker loaded')
	clearInterval (i_handle);
	handle = await PorcupineWeb.PorcupineWorker.create (
		'f+S3T4Ati4mWVjxmgcBQAkneZ+LSn4YCk4XxNc/k6UFuIs+UCE42jQ==',
		PorcupineWeb.BuiltInKeyword.Porcupine,
		keywordDetectionCallback,
		porcupineModel,
		{ processErrorCallback: processErrorCallback } // options
	)
}, 3000);
*/

 
function keywordDetectionCallback (keyword) {
	console.log(`Porcupine detected keyword: ${keyword.label}`, keyword);
}

function processErrorCallback(error) {
	console.log(`Porcupine detected error: ${error}`);
}

onmessage = async function (e) {
	console.log('🔮 Message received:', e.data, e);
	if (e.data == '🔮.end') {
		await handle.release();
		await handle.terminate();
	}
  //postMessage('🔮.end');
}

/*
Clean up used resources by Porcupine or PorcupineWorker:

await handle.release();

Terminate
Terminate PorcupineWorker instance:

await handle.terminate()
*/


