
// throw WebAssembly parsing error

// 🔮
const Bumblebee = require(`${c_nmp}bumblebee-hotword-node`);

const bumblebee = new Bumblebee();

bumblebee.addHotword('bumblebee');

bumblebee.on('hotword', function (hotword) {
	console.log('Hotword Detected:', hotword);
});

bumblebee.start();
