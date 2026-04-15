const axios = require("axios");
const { BlazeClient } = require("@viniciusgdr/Blaze");

const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// conectar websocket
const blaze = new BlazeClient({
  autoConnect: true
});

console.log("🚀 Bot iniciando...");

// função enviar telegram
async function enviar(msg) {
  try {
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: msg
    });
    console.log("📩 Enviado:", msg);
  } catch (e) {
    console.log("❌ Erro Telegram:", e.message);
  }
}

// evento tempo real
blaze.on("crash", async (data) => {
  const valor = parseFloat(data.crashPoint);

  console.log("🎯 Vela:", valor);

  if (valor >= 10) {
    await enviar(`🔥 ${valor}x VEIO!`);
  }

  if (valor >= 20) {
    await enviar(`🚀 ${valor}x ALTA!`);
  }

  if (valor >= 50) {
    await enviar(`💥 ${valor}x MONSTRO!`);
  }

  if (valor >= 100) {
    await enviar(`👑 ${valor}x INSANO!`);
  }
});
