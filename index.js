const axios = require("axios");

const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

let ultimoID = null;

async function enviarMensagem(msg) {
  await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: msg
  });
}

async function pegarDados() {
  try {
    const res = await axios.get("https://blaze.bet.br/api/singleplayer-originals/originals/slide_games/recent/10");

    const dados = res.data;

    let novos = dados.filter(d => d.id !== ultimoID);

    if (novos.length > 0) {
      ultimoID = dados[0].id;

      let mensagem = "";

      novos.reverse().forEach((item) => {
        const vela = parseFloat(item.slide_point);
        const hora = new Date(item.created_at).toLocaleTimeString("pt-BR");

        if (vela >= 20) {
          mensagem += `🔥 ${hora} - ${vela}x\n`;
        } else if (vela >= 10) {
          mensagem += `⚡ ${hora} - ${vela}x\n`;
        }
      });

      if (mensagem !== "") {
        mensagem = "🚀 SINAIS SLIDE 🚀\n\n" + mensagem;
        await enviarMensagem(mensagem);
      }
    }

  } catch (err) {
    console.log("Erro:", err.message);
  }
}

setInterval(pegarDados, 10000);
