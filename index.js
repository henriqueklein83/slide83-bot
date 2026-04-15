const axios = require("axios");
const { makeConnection } = require("@viniciusgdr/Blaze");

const TOKEN = process.env.TOKEN;       // token do bot Telegram
const CHAT_ID = process.env.CHAT_ID;   // id do grupo
const BLAZE_TOKEN = process.env.BLAZE_TOKEN || ""; // opcional

let ultimoRoundId = null;

async function enviarTelegram(texto) {
  try {
    await axios.get(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      params: {
        chat_id: CHAT_ID,
        text: texto,
      },
    });
    console.log("📩 Enviado pro Telegram");
  } catch (err) {
    console.log("❌ Erro Telegram:", err.response?.data || err.message);
  }
}

function extrairMultiplicador(msg) {
  if (!msg) return null;

  const candidatos = [
    msg.crash_point,
    msg.point,
    msg.multiplier,
    msg.value,
    msg.crashPoint,
  ];

  for (const v of candidatos) {
    const n = parseFloat(v);
    if (!Number.isNaN(n)) return n;
  }

  return null;
}

function extrairId(msg) {
  return (
    msg?.id ??
    msg?.round_id ??
    msg?.roundId ??
    msg?.game_id ??
    msg?.gameId ??
    msg?.created_at ??
    msg?.timestamp ??
    null
  );
}

function formatarMensagem(mult, horario) {
  if (mult >= 100) {
    return `💎💎💎 100x+ INSANO!\n\n⏰ ${horario}\n🔥 ${mult}x`;
  }
  if (mult >= 50) {
    return `🚀 50x+ BATENDO!\n\n⏰ ${horario}\n🔥 ${mult}x`;
  }
  if (mult >= 20) {
    return `⚡ 20x+ ALERTA!\n\n⏰ ${horario}\n🔥 ${mult}x`;
  }
  if (mult >= 10) {
    return `🟢 10x+ VEIO!\n\n⏰ ${horario}\n🔥 ${mult}x`;
  }
  return null;
}

async function iniciar() {
  console.log("🚀 Bot websocket iniciando...");

  const socket = makeConnection({
    type: "crash",
    ...(BLAZE_TOKEN ? { token: BLAZE_TOKEN } : {}),
    cacheIgnoreRepeatedEvents: true,
  });

  socket.ev.on("crash.tick", async (msg) => {
    try {
      const roundId = extrairId(msg);
      const mult = extrairMultiplicador(msg);

      if (roundId && roundId === ultimoRoundId) return;
      if (mult == null) return;

      ultimoRoundId = roundId || `${Date.now()}-${mult}`;

      const horario = new Date().toLocaleTimeString("pt-BR");
      console.log("📡 Evento recebido:", msg);
      console.log(`🔥 Multiplicador: ${mult}x`);

      const mensagem = formatarMensagem(mult, horario);
      if (!mensagem) return;

      await enviarTelegram(mensagem);
    } catch (err) {
      console.log("❌ Erro ao tratar evento:", err.message);
    }
  });

  socket.ev.on("close", (msg) => {
    console.log("🔌 Socket fechou:", msg);
  });

  console.log("✅ WebSocket conectado");
}

iniciar().catch((err) => {
  console.log("❌ Erro fatal:", err);
});
