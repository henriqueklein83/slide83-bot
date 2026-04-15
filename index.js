const axios = require("axios");

const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// API correta (funciona)
const API_URL = "https://blaze.bet.br/api/singleplayer-originals/originals/slide_games/recent/1";

console.log("🚀 BOT RODANDO...");

let ultimoId = null;

async function verificar() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const jogo = response.data.records[0];

    // evita repetir
    if (jogo.id === ultimoId) return;

    ultimoId = jogo.id;

    const vela = parseFloat(jogo.crash_point);

    console.log("🎯 Nova vela:", vela);

    if (vela >= 10) {
      await enviar(`🔥 ${vela}x VEIO!`);
    }

    if (vela >= 20) {
      await enviar(`🚀 ${vela}x ALTA!`);
    }

    if (vela >= 50) {
      await enviar(`💥 ${vela}x MONSTRO!`);
    }

    if (vela >= 100) {
      await enviar(`👑 ${vela}x INSANO!`);
    }

  } catch (e) {
    console.log("❌ Erro API:", e.message);
  }
}

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

// roda a cada 5 segundos
setInterval(verificar, 5000);
