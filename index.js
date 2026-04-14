const axios = require("axios");

// 🔑 SUAS VARIÁVEIS (já estão no Railway)
const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// 🌐 API da Blaze
const API_URL = "https://blaze.bet.br/api/singleplayer-originals/originals/slide_games/recent/1";

// 🚀 Função pra pegar resultado
async function pegarResultado() {
  try {
    const response = await axios.get(API_URL);
    const jogo = response.data[0];

    const vela = parseFloat(jogo.crash_point);
    const hora = new Date(jogo.created_at).toLocaleTimeString("pt-BR");

    console.log(`Vela: ${vela} | Hora: ${hora}`);

    return { vela, hora };

  } catch (error) {
    console.log("Erro API:", error.message);
  }
}

// 📤 Enviar mensagem Telegram
async function enviarMensagem(msg) {
  try {
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: msg
    });
  } catch (error) {
    console.log("Erro Telegram:", error.message);
  }
}

// 🧠 Loop principal
let ultimoId = null;

async function rodar() {
  const resultado = await pegarResultado();

  if (!resultado) return;

  const { vela, hora } = resultado;

  // 💥 evitar repetir mesmo resultado
  if (hora === ultimoId) return;

  ultimoId = hora;

  let mensagem = `🎰 NOVA VELA\n\n⏰ ${hora}\n💎 ${vela}x`;

  // 🔥 destaque automático
  if (vela >= 10) {
    mensagem += "\n🔥 POSSÍVEL OPORTUNIDADE";
  }

  await enviarMensagem(mensagem);
}

// ⏱ roda a cada 5 segundos
setInterval(rodar, 5000);

console.log("🚀 BOT RODANDO...");
