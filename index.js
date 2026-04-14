const axios = require("axios");

const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// TESTE IMEDIATO AO LIGAR
async function enviarTeste() {
  try {
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: "🚀 TESTE FUNCIONANDO! BOT ONLINE 🔥"
    });

    console.log("Mensagem enviada!");
  } catch (erro) {
    console.log("Erro:", erro.response?.data || erro.message);
  }
}

enviarTeste();

// manter online
setInterval(() => {
  console.log("Rodando...");
}, 10000);
