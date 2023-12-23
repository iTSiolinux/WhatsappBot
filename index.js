const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");

// setting up the client
const client = new Client({
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

client.on("qr", (qr) => {
  console.log(qr);
  //  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (message) => {
  if (message.body === "!ping") {
    message.reply("pong");
  }
});

client.initialize();
