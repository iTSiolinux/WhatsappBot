const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");

// Getting some needed functions
function getRandomInt(min, max) {
  return Math.round(Math.random() * max) + min;
}

// Read JSON function
function readJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}: ${error.message}`);
    return null;
  }
}

// Write JSON function
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`JSON file ${filePath} updated successfully.`);
  } catch (error) {
    console.error(`Error writing JSON file ${filePath}: ${error.message}`);
  }
}

// Setting up the client
const client = new Client({
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

client.on("qr", (qr) => {
  console.log(qr);
  // qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (message) => {
  if (message.body === "!help") {
    message.reply(
      "commands:\n`!dice` roll a dice!\n`!bal` to get your balance",
    );
  }

  if (message.body === "!dice") {
    const result = getRandomInt(0, 1) ? "heads" : "tails";
    message.reply(`you rolled a dice and you got: '${result}'`);

    // Example of using writeJSON
    if (result) {
      const userData = readJSON("data.json") || {};
      const userPhoneNumber = message.from;
      userData[userPhoneNumber] = userData[userPhoneNumber] || { balance: 0 };
      userData[userPhoneNumber].balance++; // Increment balance by 1
      writeJSON("data.json", userData);
    }
  }

  if (message.body === "!bal") {
    const userData = readJSON("data.json") || {};
    const userPhoneNumber = message.from;
    const userBalance = userData[userPhoneNumber]?.balance || 0;
    message.reply(`your balance is: ${userBalance}`);
  }
});

client.initialize();
