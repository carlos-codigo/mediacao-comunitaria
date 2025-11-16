import { createClient } from "https://esm.sh/@supabase/supabase-js";

// 🔗 Conexão com Supabase
const supabase = createClient(
  "https://dtriltzrvdhnlxqbiced.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cmlsdHpydmRobmx4cWJpY2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDM1NzMsImV4cCI6MjA3Njk3OTU3M30.S4gwVrXBiM3wbmp_LOfaFhpbTlnnaw7fZNSgpbzDI28"
);

// 🔹 Elementos de interface do chat
const mensagensDiv = document.getElementById("mensagens");
const input = document.getElementById("textoMensagem");
const btn = document.getElementById("enviarMensagem");
const cabecalho = document.getElementById("nomeConflito");

// 🔹 Recuperar dados locais
const usuario = JSON.parse(localStorage.getItem("usuario"));
const conflitoId = localStorage.getItem("conflitoAtual");

// -----------------------------
// ⚙️ Funções principais
// -----------------------------

// Carregar mensagens antigas do conflito
async function carregarMensagens() {
  if (!mensagensDiv || !conflitoId) return;

  const { data, error } = await supabase
    .from("mensagens")
    .select("*")
    .eq("conflito_id", conflitoId)
    .order("criado_em", { ascending: true });

  if (error) {
    mensagensDiv.innerHTML = "<p>❌ Erro ao carregar mensagens.</p>";
    console.error(error);
    return;
  }

  mensagensDiv.innerHTML = "";
  data.forEach(addMensagem);
  mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
}

// Adicionar mensagem visualmente
function addMensagem(msg) {
  const bolha = document.createElement("div");
  bolha.className = msg.eh_admin ? "msg admin" : "msg user";
  bolha.innerHTML = `
    <p>${msg.texto}</p>
    <span>${new Date(msg.criado_em).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
  `;
  mensagensDiv.appendChild(bolha);
}

// Enviar nova mensagem
if (btn) {
  btn.addEventListener("click", async () => {
    const texto = input.value.trim();
    if (!texto || !conflitoId || !usuario) return;

    const { error } = await supabase
      .from("mensagens")
      .insert([
        {
          conflito_id: conflitoId,
          remetente_id: usuario.id,
          texto,
          eh_admin: usuario.is_admin === true,
        },
      ]);

    if (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem!");
    } else {
      input.value = "";
    }
  });
}

// Atualizar chat em tempo real
supabase
  .channel("chat_realtime")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "mensagens" },
    (payload) => {
      if (payload.new.conflito_id === conflitoId) {
        addMensagem(payload.new);
        mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
      }
    }
  )
  .subscribe();

// Iniciar carregamento ao abrir a página
carregarMensagens();

// Exibir nome do conflito se disponível
if (cabecalho && localStorage.getItem("conflitoNome")) {
  cabecalho.textContent = localStorage.getItem("conflitoNome");
}
