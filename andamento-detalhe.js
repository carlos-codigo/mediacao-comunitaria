/* ===========================================================
   📌 ANDAMENTO DETALHES (USUÁRIO)
   - Carrega informações do conflito selecionado
   - Protege acesso (apenas dono do conflito pode visualizar)
   - Mantém integração com Supabase
   =========================================================== */

const SUPABASE_URL  = "https://dtriltzrvdhnlxqbiced.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cmlsdHpydmRobmx4cWJpY2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDM1NzMsImV4cCI6MjA3Njk3OTU3M30.S4gwVrXBiM3wbmp_LOfaFhpbTlnnaw7fZNSgpbzDI28";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

const contentArea = document.getElementById("contentArea");
const whoami       = document.getElementById("whoami");
const welcomeLine  = document.getElementById("welcomeLine");
const sairBtn      = document.getElementById("sairBtn");

/* 🔐 Início */
init();
async function init(){
  const { data: { user } } = await db.auth.getUser();
  if(!user){ window.location.href = "index.html"; return; }

  const nome = user.user_metadata?.nome || user.email;
  whoami.textContent = `Logado como: ${nome}`;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if(!id){ return renderError("ID inválido ou não informado."); }

  welcomeLine.textContent = "Exibindo informações do conflito selecionado…";

  loadDetalhes(id, user.id);
}

/* 📝 Carrega dados do conflito */
async function loadDetalhes(id, userId){
  const { data, error } = await db.from("conflitos")
    .select("*")
    .eq("id", id)
    .eq("usuario_id", userId)
    .maybeSingle();

  if(error || !data){
    renderError("Conflito não encontrado ou não pertence à sua conta.");
    return;
  }

  renderDetalhes(data);
}

/* 🧱 Renderiza o conteúdo */
function renderDetalhes(c){
  const statusTag = statusToTag(c.status);
  const criado    = c.criado_em ? formatDate(c.criado_em) : "—";
  const atualizado= c.updated_at ? formatDate(c.updated_at) : "—";

  contentArea.innerHTML = `
    <div class="card">
      <div class="label">Título do Conflito</div>
      <div class="value">${escapeHTML(c.titulo || "(sem título)")}</div>
    </div>

    <div class="card">
      <div class="label">Descrição</div>
      <div class="value">${escapeHTML(c.descricao || "(sem descrição)")}</div>
    </div>

    <div class="card">
      <div class="label">Status Atual</div>
      <div class="value">${statusTag}</div>
      <div id="statusTimeline" style="margin-top:12px;font-size:14px;opacity:.8;"></div>
    </div>

    <div class="card">
      <div class="label">Criado em</div>
      <div class="value">${criado}</div>
    </div>

    <div class="card">
      <div class="label">Última Atualização</div>
      <div class="value">${atualizado}</div>
    </div>

    <div class="card" style="text-align:right;">
      <button class="btn" onclick="window.location.href='andamento.html'">← Voltar</button>
    </div>
  `;

  renderTimeline(c.status);
}

/* ✅ Render timeline dinâmica */
function renderTimeline(status){
  const steps = ["Em análise", "Em andamento", "Resolvido"];
  const index = steps.indexOf(status ?? "Em análise");

  const html = steps.map((step, i) => {
    const filled = i <= index ? "●" : "○";
    return `${filled} ${step}`;
  }).join("&nbsp;&nbsp;&nbsp;");

  document.getElementById("statusTimeline").innerHTML = html;
}

/* 🎨 Tags visuais do status */
function statusToTag(statusRaw){
  const s = (statusRaw || "Em análise");
  if(/resolvido/i.test(s)) return `<span class="tag ok">${escapeHTML(s)}</span>`;
  if(/andamento/i.test(s)) return `<span class="tag prog">${escapeHTML(s)}</span>`;
  return `<span class="tag wait">${escapeHTML(s)}</span>`;
}

/* ⏳ Formatador de datas */
function formatDate(dt){
  return new Date(dt).toLocaleString("pt-BR");
}

/* ❌ Erro na tela */
function renderError(msg){
  contentArea.innerHTML = `
    <div class="card" style="border:1px solid #b91c1c;">
      <div class="value" style="color:#fca5a5;">${msg}</div>
      <div style="text-align:right;margin-top:12px;">
        <button class="btn" onclick="window.location.href='andamento.html'">← Voltar</button>
      </div>
    </div>
  `;
}

/* 🔐 Logout */
sairBtn?.addEventListener("click", async()=>{
  await db.auth.signOut();
  window.location.href = "index.html";
});

/* 🛡️ Segurança */
function escapeHTML(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
