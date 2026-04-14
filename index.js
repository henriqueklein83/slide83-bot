const axios = require("axios");

const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const API_URL = "https://blaze.com/api/singleplayer-originals/originals/slide_games/recent/1";

let ultimoId = null;

async function rodarBot() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://blaze.com/"
      }
    });

    const jogo = response.data[0];

    if (!jogo) return;

    if (jogo.id === ultimoId) return;
    ultimoId = jogo.id;

    const vela = parseFloat(jogo.crash_point);
    const horario = new Date(jogo.created_at).toLocaleTimeString("pt-BR");

    console.log(`🔥 Vela: ${vela}x | ${horario}`);

    // 🔥 TESTE: manda qualquer vela (tiramos filtro temporário)
    let mensagem = `🎰 VELA AO VIVO

⏰ ${horario}
💎 ${vela}x`;

    await axios.get(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      params: {
        chat_id: CHAT_ID,
        text: mensagem,
      },
    });

    console.log("📩 Enviado");

  } catch (error) {
    console.log("❌ ERRO REAL:", error.message);
  }
}

setInterval(rodarBot, 5000);

console.log("🚀 BOT RODANDO...");
