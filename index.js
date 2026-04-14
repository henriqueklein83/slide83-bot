const axios = require("axios");

// 🔑 Variáveis do Railway
const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// 🌐 API correta da Blaze
const API_URL = "https://blaze.com/api/singleplayer-originals/originals/slide_games/recent/1";

// 🧠 Controle pra não repetir vela
let ultimoId = null;

// 🚀 Função principal
async function pegarResultado() {
  try {
    const response = await axios.get(API_URL);

    const jogo = response.data[0];

    if (!jogo) return;

    // Evita repetir mesma vela
    if (jogo.id === ultimoId) return;

    ultimoId = jogo.id;

    const vela = parseFloat(jogo.crash_point);
    const horario = new Date(jogo.created_at).toLocaleTimeString("pt-BR");

    console.log(`🔥 Nova vela: ${vela}x | ${horario}`);

    // 📩 Mensagem padrão
    let mensagem = `🎰 NOVA VELA\n\n⏰ ${horario}\n💎 ${vela}x`;

    // 🚨 ALERTAS INTELIGENTES
    if (vela >= 100) {
      mensagem = `💎💎💎 100x+ INSANO!\n\n⏰ ${horario}\n🔥 ${vela}x`;
    } else if (vela >= 50) {
      mensagem = `🚀 50x+ BATENDO!\n\n⏰ ${horario}\n🔥 ${vela}x`;
    } else if (vela >= 20) {
      mensagem = `⚡ 20x+ ALERTA!\n\n⏰ ${horario}\n🔥 ${vela}x`;
    } else if (vela >= 10) {
      mensagem = `🟢 10x+ VEIO!\n\n⏰ ${horario}\n🔥 ${vela}x`;
    }

    // 📲 Enviar pro Telegram
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: mensagem,
    });

    console.log("📩 Enviado pro Telegram");

  } catch (error) {
    console.log("❌ Erro API:", error.message);
  }
}

// ⏱️ Loop automático (a cada 5 segundos)
setInterval(pegarResultado, 5000);

console.log("🚀 BOT RODANDO...");
