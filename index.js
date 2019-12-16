// const SerialPort = require("serialport");
// const Readline = require("@serialport/parser-readline");
// var port = new SerialPort("/dev/tty.usbmodem1422", {
//   baudRate: 115200,
//   autoOpen: false
// });
// const parser = new Readline();
// port.pipe(parser);

// parser.on("data", line => console.log(`> ${line}`));

var MBFirmataClient = require("./microbit-firmata/client/MBFirmataClient.js");
var mb = new MBFirmataClient();
var cpuStat = require("cpu-stat");

mb.connect().then(mb => {
  console.log("connected", mb.firmataVersion);
  //   mb.scrollString("Hello, Firmata!", 40);
  //   mb.scrollInteger(-123, 80);
  //   mb.displayPlot(0, 0, 255);
  loop();
});

async function loop() {
  const per = await getPercentage();
  displayTotal(mb, per);
  //   console.log(per);
  // mb.scrollInteger(parseInt(per), 50);
  loop();
}

function display(mb, number) {
  for (let index = 0; index < 5; index++) {
    const on = number / 20 < index ? 255 : 0;
    mb.displayPlot(index, 0, on);
  }
}

function displayTotal(mb, number) {
  let i = 0;
  for (let r = 0; r < 5; r++) {
    for (let l = 0; l < 5; l++) {
      const on = number / 4 <= i++ ? 0 : 255;
      mb.displayPlot(r, l, on);
    }
  }
}

function getPercentage() {
  return new Promise((resolve, reject) => {
    cpuStat.usagePercent(
      {
        sampleMs: 250
      },
      function(err, percent, seconds) {
        if (err) {
          reject(err);
        } else {
          resolve(percent);
        }
      }
    );
  });
}
