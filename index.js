const axios = require("axios");

const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// 🔥 API alternativa funcionando
const API_URL = "https://api.allorigins.win/raw?url=https://blaze.com/api/singleplayer-originals/originals/slide_games/recent/1";

let ultimoId = null;

async function rodarBot() {
  try {
    const response = await axios.get(API_URL);
    const jogo = response.data[0];

    if (!jogo) return;

    if (jogo.id === ultimoId) return;
    ultimoId = jogo.id;

    const vela = parseFloat(jogo.crash_point);
    const horario = new Date(jogo.created_at).toLocaleTimeString("pt-BR");

    console.log(`🔥 Vela: ${vela}x | ${horario}`);

    if (vela < 10) return;

    let mensagem = `🚀 SINAL DETECTADO 🚀

⏰ ${horario}
🎯 ${vela}x

🕒 Janela: 1 min antes / 1 depois`;

    await axios.get(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      params: {
        chat_id: CHAT_ID,
        text: mensagem,
      },
    });

    console.log("📩 Enviado pro Telegram");

  } catch (error) {
    console.log("❌ Erro API:", error.message);
  }
}

setInterval(rodarBot, 5000);

console.log("🚀 BOT ONLINE...");
