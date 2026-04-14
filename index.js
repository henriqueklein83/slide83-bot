const axios = require("axios");

// 🔑 Variáveis do Railway
const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// 🌐 API Blaze (funcionando)
const API_URL = "https://blaze.com/api/singleplayer-originals/originals/slide_games/recent/1";

// 🧠 Controle pra não repetir
let ultimoId = null;

// 🚀 Função principal
async function rodarBot() {
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

    // 🚨 FILTRO PROFISSIONAL (só vela forte)
    if (vela < 10) return;

    let mensagem = "";

    // 🎯 ALERTAS POR NÍVEL
    if (vela >= 100) {
      mensagem = `💎💎💎 100x+ INSANO!

⏰ ${horario}
🔥 ${vela}x

🚀 POSSÍVEL CICLO FORTE`;
    } else if (vela >= 50) {
      mensagem = `🚀 50x+ BATENDO!

⏰ ${horario}
🔥 ${vela}x

⚡ FICA ATENTO`;
    } else if (vela >= 20) {
      mensagem = `⚡ 20x+ ALERTA!

⏰ ${horario}
🔥 ${vela}x

🧠 POSSÍVEL ENTRADA`;
    } else {
      mensagem = `🟢 10x+ VEIO!

⏰ ${horario}
🔥 ${vela}x

📊 OBSERVAÇÃO DE PADRÃO`;
    }

    // 📲 ENVIO TELEGRAM (versão estável)
    await axios.get(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      params: {
        chat_id: CHAT_ID,
        text: mensagem,
      },
    });

    console.log("📩 Enviado pro Telegram");

  } catch (error) {
    console.log("❌ Erro:", error.message);
  }
}

// ⏱️ Loop automático
setInterval(rodarBot, 5000);

console.log("🚀 BOT ONLINE E MONITORANDO...");
