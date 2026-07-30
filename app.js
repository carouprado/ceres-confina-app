/* ============================================================
   CERES CONFINA — Painel de Implantação e Fechamento
   Aplicação estática (HTML + CSS + JS puro), sem backend.
   Persistência: localStorage do navegador.
   ============================================================ */

const STORAGE_KEY = "ceresConfinaData_v1";
const SUPABASE_STATE_ID = "ceres-confina";

let state = {
  project: [],
  closings: {},     // { "2026-07": [ {id, area, tarefa, responsavel, status, prazo, validadoPor, comentario} ] }
  currentMonth: null,
};

/* ---------- Persistência ---------- */

async function loadData() {
  // Primeiro prepara uma cópia local para o site nunca ficar vazio.
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      state = JSON.parse(raw);
    } catch (error) {
      console.error("Dados locais inválidos:", error);
      seedData();
    }
  } else {
    seedData();
  }
  normalizeState();
  saveData();
  // Depois busca a versão compartilhada.
  try {
    if (!window.ceresSupabase) {
      throw new Error("Cliente do Supabase não foi carregado.");
    }
    const { data, error } = await window.ceresSupabase
      .from("app_state")
      .select("data")
      .eq("id", SUPABASE_STATE_ID)
      .maybeSingle();
    if (error) throw error;
    if (data && data.data) {
      state = data.data;
      normalizeState();
      saveData();
    }
  } catch (error) {
    console.error("Não foi possível carregar os dados compartilhados:", error);
    showConnectionError();
  }

}
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeState() {
  if (!state || typeof state !== "object") {
    state = {
      project: [],
      closings: {},
      currentMonth: null,
    };
  }
  if (!Array.isArray(state.project)) {
    state.project = [];
  }
  if (!state.closings || typeof state.closings !== "object") {
    state.closings = {};
  }
  if (!state.currentMonth) {
    state.currentMonth = currentMonthKey();
  }
  if (!state.closings[state.currentMonth]) {
    createMonth(state.currentMonth, false);
  }
}
function renderAll() {
  renderDashboard();
  renderProject();
  renderClosing();
}
function showConnectionError() {
  setSaveStatus(
    "projectSaveStatus",
    "Sem conexão",
    "error"
  );
  setSaveStatus(
    "closingSaveStatus",
    "Sem conexão",
    "error"
  );
}
async function saveSharedData(buttonId, statusId) {
  const button = document.getElementById(buttonId);
  if (!window.ceresSupabase) {
    setSaveStatus(statusId, "Supabase indisponível", "error");
    return;
  }
  button.disabled = true;
  setSaveStatus(statusId, "Salvando...", "");
  // Mantém uma cópia de segurança no navegador.
  saveData();
  try {
    const { error } = await window.ceresSupabase
      .from("app_state")
      .upsert(
        {
          id: SUPABASE_STATE_ID,
          data: state,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );
    if (error) throw error;
    setSaveStatus(statusId, "Salvo", "success");
  } catch (error) {
    console.error("Erro ao salvar no Supabase:", error);
    setSaveStatus(statusId, "Erro ao salvar", "error");
  } finally {
    button.disabled = false;
  }
}
function setSaveStatus(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = message;
  element.classList.remove("success", "error");
  if (type) {
    element.classList.add(type);
  }
  if (type === "success") {
    window.setTimeout(() => {
      if (element.textContent === message) {
        element.textContent = "";
        element.classList.remove("success");
      }
    }, 3000);
  }
}
function markPendingChanges() {
  setSaveStatus(
    "projectSaveStatus",
    "Alterações pendentes",
    ""
  );
  setSaveStatus(
    "closingSaveStatus",
    "Alterações pendentes",
    ""
  );
}

function seedData() {
  state.project = SEED_PROJECT_TASKS.map((t, idx) => ({ id: "p" + (idx + 1), ...t }));
  const monthKey = currentMonthKey();
  state.closings = {};
  state.closings[monthKey] = CLOSING_TEMPLATE.map((t, idx) => ({ id: monthKey + "-" + (idx + 1), prazo: "", ...t }));
  state.currentMonth = monthKey;
}

function currentMonthKey(d = new Date()) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}

function monthLabel(key) {
  const [y, m] = key.split("-");
  const nomes = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  return nomes[parseInt(m, 10) - 1] + " / " + y;
}

function createMonth(monthKey, doSave = true) {
  if (state.closings[monthKey]) return;
  state.closings[monthKey] = CLOSING_TEMPLATE.map((t, idx) => ({ id: monthKey + "-" + (idx + 1), prazo: "", ...t }));
  if (doSave) saveData();
}

/* ---------- Utilidades de UI ---------- */

function badgeClassProject(status) {
  return { "Não iniciado": "badge-gray", "Em andamento": "badge-blue", "Bloqueado": "badge-red", "Concluído": "badge-green" }[status] || "badge-gray";
}
function badgeClassClosing(status) {
  return { "Pendente": "badge-gray", "Em andamento": "badge-blue", "Em validação": "badge-amber", "Aprovado": "badge-green" }[status] || "badge-gray";
}
function badge(text, cls) {
  return `<span class="badge ${cls}">${text}</span>`;
}
function isOverdueClosing(item) {
  if (!item.prazo || item.status === "Aprovado") return false;
  return new Date(item.prazo) < new Date(new Date().toDateString());
}
function isOverdueProject(item) {
  if (!item.previsto || item.status === "Concluído") return false;
  return new Date(item.previsto) < new Date(new Date().toDateString());
}
function uid(prefix) {
  return prefix + Date.now() + Math.floor(Math.random() * 1000);
}
function esc(str) {
  return (str || "").toString().replace(/[&<>"']/g, s => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[s]));
}

/* ---------- Abas ---------- */

function showTab(name) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("active", p.id === "tab-" + name));
  if (name === "dashboard") renderDashboard();
  if (name === "projeto") renderProject();
  if (name === "fechamento") renderClosing();
  if (name === "raci") renderRaci();
}

/* ---------- DASHBOARD ---------- */

function renderDashboard() {
  const total = state.project.length;
  const concluidas = state.project.filter(t => t.status === "Concluído").length;
  const bloqueadas = state.project.filter(t => t.status === "Bloqueado").length;
  const pct = total ? Math.round((concluidas / total) * 100) : 0;

  const monthKey = state.currentMonth;
  const items = state.closings[monthKey] || [];
  const aprovados = items.filter(i => i.status === "Aprovado").length;
  const pctClosing = items.length ? Math.round((aprovados / items.length) * 100) : 0;

  document.getElementById("dashboardCards").innerHTML = `
    <div class="stat-card"><div class="stat-value">${pct}%</div><div class="stat-label">Progresso do Projeto</div></div>
    <div class="stat-card"><div class="stat-value">${concluidas}/${total}</div><div class="stat-label">Tarefas Concluídas</div></div>
    <div class="stat-card" style="border-color: var(--vermelho)"><div class="stat-value">${bloqueadas}</div><div class="stat-label">Tarefas Bloqueadas</div></div>
    <div class="stat-card"><div class="stat-value">${pctClosing}%</div><div class="stat-label">Fechamento ${monthLabel(monthKey)}</div></div>
  `;

  const modulos = ["Financeiro", "Contábil", "Fiscal", "Geral"];
  document.getElementById("dashboardProjectBars").innerHTML = modulos.map(m => {
    const tasks = state.project.filter(t => t.modulo === m);
    const done = tasks.filter(t => t.status === "Concluído").length;
    const p = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    return `<div class="bar-row">
      <div class="bar-label"><span>${m}</span><span>${done}/${tasks.length} (${p}%)</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div>
    </div>`;
  }).join("");

  const areas = ["Financeiro", "Contábil", "Fiscal"];
  document.getElementById("dashboardClosingBars").innerHTML = areas.map(a => {
    const areaItems = items.filter(i => i.area === a);
    const done = areaItems.filter(i => i.status === "Aprovado").length;
    const p = areaItems.length ? Math.round((done / areaItems.length) * 100) : 0;
    return `<div class="bar-row">
      <div class="bar-label"><span>${a}</span><span>${done}/${areaItems.length} (${p}%)</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div>
    </div>`;
  }).join("");

  const overdueProject = state.project.filter(isOverdueProject);
  const overdueClosing = items.filter(isOverdueClosing);
  const overdueAll = [
    ...overdueProject.map(t => `Projeto — ${t.tarefa} (previsto ${t.previsto}, resp. ${esc(t.responsavel)})`),
    ...overdueClosing.map(i => `Fechamento — ${i.tarefa} (prazo ${i.prazo}, resp. ${esc(i.responsavel)})`),
  ];
  document.getElementById("dashboardOverdue").innerHTML = overdueAll.length
    ? overdueAll.map(txt => `<div class="overdue-item">⚠ ${txt}</div>`).join("")
    : `<div class="overdue-empty">Nenhuma pendência em atraso.</div>`;
}

/* ---------- PROJETO ---------- */

function populateProjectFilters() {
  const fases = [...new Set(state.project.map(t => t.fase))];
  const responsaveis = [...new Set(state.project.map(t => t.responsavel))];
  document.getElementById("filterFase").innerHTML = `<option value="">Todas as fases</option>` + fases.map(f => `<option value="${esc(f)}">${esc(f)}</option>`).join("");
  document.getElementById("filterResponsavel").innerHTML = `<option value="">Todos os responsáveis</option>` + responsaveis.map(r => `<option value="${esc(r)}">${esc(r)}</option>`).join("");
  document.getElementById("faseOptions").innerHTML = fases.map(f => `<option value="${esc(f)}">`).join("");
}

function renderProject() {
  populateProjectFilters();
  const fase = document.getElementById("filterFase").value;
  const modulo = document.getElementById("filterModulo").value;
  const responsavel = document.getElementById("filterResponsavel").value;
  const status = document.getElementById("filterStatus").value;

  const rows = state.project.filter(t =>
    (!fase || t.fase === fase) &&
    (!modulo || t.modulo === modulo) &&
    (!responsavel || t.responsavel === responsavel) &&
    (!status || t.status === status)
  );

  const tbody = document.querySelector("#projectTable tbody");
  tbody.innerHTML = rows.map(t => `
    <tr>
      <td>${esc(t.fase)}</td>
      <td>${esc(t.modulo)}</td>
      <td>${esc(t.tarefa)}</td>
      <td>${esc(t.responsavel)}</td>
      <td>${badge(t.status, badgeClassProject(t.status))} ${isOverdueProject(t) ? badge("Atrasado", "badge-red") : ""}</td>
      <td>${esc(t.previsto)}</td>
      <td>${esc(t.real)}</td>
      <td>${esc(t.obs)}</td>
      <td class="actions-cell"><button class="link-btn" onclick="openTaskDialog('${t.id}')">editar</button></td>
    </tr>
  `).join("") || `<tr><td colspan="9" class="overdue-empty">Nenhuma tarefa encontrada para os filtros aplicados.</td></tr>`;
}

function openTaskDialog(id) {
  const dlg = document.getElementById("taskDialog");
  const task = state.project.find(t => t.id === id);
  document.getElementById("taskDialogTitle").textContent = task ? "Editar Tarefa" : "Nova Tarefa";
  document.getElementById("taskId").value = task ? task.id : "";
  document.getElementById("taskFase").value = task ? task.fase : "";
  document.getElementById("taskModulo").value = task ? task.modulo : "Financeiro";
  document.getElementById("taskDescricao").value = task ? task.tarefa : "";
  document.getElementById("taskResponsavel").value = task ? task.responsavel : "";
  document.getElementById("taskStatus").value = task ? task.status : "Não iniciado";
  document.getElementById("taskPrevisto").value = task ? task.previsto : "";
  document.getElementById("taskReal").value = task ? task.real : "";
  document.getElementById("taskObs").value = task ? task.obs : "";
  document.getElementById("taskDelete").style.display = task ? "inline-block" : "none";
  dlg.showModal();
}

function saveTask() {
  const id = document.getElementById("taskId").value || uid("p");
  const data = {
    id,
    fase: document.getElementById("taskFase").value,
    modulo: document.getElementById("taskModulo").value,
    tarefa: document.getElementById("taskDescricao").value,
    responsavel: document.getElementById("taskResponsavel").value,
    status: document.getElementById("taskStatus").value,
    previsto: document.getElementById("taskPrevisto").value,
    real: document.getElementById("taskReal").value,
    obs: document.getElementById("taskObs").value,
  };
  const idx = state.project.findIndex(t => t.id === id);
  if (idx >= 0) state.project[idx] = data; else state.project.push(data);
  saveData();
  document.getElementById("taskDialog").close();
  renderProject();
  renderDashboard();
  markPendingChanges();
}

function deleteTask() {
  const id = document.getElementById("taskId").value;
  state.project = state.project.filter(t => t.id !== id);
  saveData();
  document.getElementById("taskDialog").close();
  renderProject();
  renderDashboard();
  markPendingChanges();
}

function exportProjectCSV() {
  const header = ["Fase","Módulo","Tarefa","Responsável","Status","Previsto","Realizado","Observações"];
  const lines = [header.join(";")].concat(state.project.map(t =>
    [t.fase, t.modulo, t.tarefa, t.responsavel, t.status, t.previsto, t.real, t.obs].map(v => `"${(v||"").toString().replace(/"/g,'""')}"`).join(";")
  ));
  downloadCSV(lines.join("\n"), "ceres-confina-projeto-implantacao.csv");
}

/* ---------- FECHAMENTO ---------- */

function populateMonthSelector() {
  const sel = document.getElementById("monthSelector");
  const months = Object.keys(state.closings).sort();
  sel.innerHTML = months.map(m => `<option value="${m}" ${m === state.currentMonth ? "selected" : ""}>${monthLabel(m)}</option>`).join("");
}

function renderClosing() {
  populateMonthSelector();
  const monthKey = state.currentMonth;
  const items = state.closings[monthKey] || [];
  const areaFilter = document.getElementById("filterArea").value;
  const statusFilter = document.getElementById("filterClosingStatus").value;

  const areas = ["Financeiro", "Contábil", "Fiscal"];
  const container = document.getElementById("closingGroups");
  container.innerHTML = areas.map(area => {
    const areaItems = items.filter(i => i.area === area && (!areaFilter || area === areaFilter) && (!statusFilter || i.status === statusFilter));
    if (!areaItems.length && areaFilter && areaFilter !== area) return "";
    return `
      <div class="closing-group">
        <h4>${area}</h4>
        <table class="data-table">
          <thead><tr><th>Tarefa</th><th>Responsável</th><th>Status</th><th>Prazo</th><th>Validado por</th><th>Comentário</th><th></th></tr></thead>
          <tbody>
            ${areaItems.map(i => `
              <tr>
                <td>${esc(i.tarefa)}</td>
                <td>${esc(i.responsavel)}</td>
                <td>${badge(i.status, badgeClassClosing(i.status))} ${isOverdueClosing(i) ? badge("Atrasado","badge-red") : ""}</td>
                <td>${esc(i.prazo)}</td>
                <td>${esc(i.validadoPor)}</td>
                <td>${esc(i.comentario)}</td>
                <td class="actions-cell"><button class="link-btn" onclick="openClosingDialog('${i.id}')">editar</button></td>
              </tr>
            `).join("") || `<tr><td colspan="7" class="overdue-empty">Nenhum item.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
  }).join("");
}

function openClosingDialog(id) {
  const dlg = document.getElementById("closingDialog");
  const monthKey = state.currentMonth;
  const item = (state.closings[monthKey] || []).find(i => i.id === id);
  document.getElementById("closingDialogTitle").textContent = item ? "Editar Item" : "Novo Item de Fechamento";
  document.getElementById("closingId").value = item ? item.id : "";
  document.getElementById("closingArea").value = item ? item.area : "Financeiro";
  document.getElementById("closingDescricao").value = item ? item.tarefa : "";
  document.getElementById("closingResponsavel").value = item ? item.responsavel : "";
  document.getElementById("closingStatus").value = item ? item.status : "Pendente";
  document.getElementById("closingPrazo").value = item ? item.prazo : "";
  document.getElementById("closingValidadoPor").value = item ? item.validadoPor : "";
  document.getElementById("closingComentario").value = item ? item.comentario : "";
  document.getElementById("closingDelete").style.display = item ? "inline-block" : "none";
  dlg.showModal();
}

function saveClosingItem() {
  const monthKey = state.currentMonth;
  const id = document.getElementById("closingId").value || uid(monthKey + "-");
  const data = {
    id,
    area: document.getElementById("closingArea").value,
    tarefa: document.getElementById("closingDescricao").value,
    responsavel: document.getElementById("closingResponsavel").value,
    status: document.getElementById("closingStatus").value,
    prazo: document.getElementById("closingPrazo").value,
    validadoPor: document.getElementById("closingValidadoPor").value,
    comentario: document.getElementById("closingComentario").value,
  };
  const list = state.closings[monthKey] || (state.closings[monthKey] = []);
  const idx = list.findIndex(i => i.id === id);
  if (idx >= 0) list[idx] = data; else list.push(data);
  saveData();
  document.getElementById("closingDialog").close();
  renderClosing();
  renderDashboard();
}

function deleteClosingItem() {
  const monthKey = state.currentMonth;
  const id = document.getElementById("closingId").value;
  state.closings[monthKey] = (state.closings[monthKey] || []).filter(i => i.id !== id);
  saveData();
  document.getElementById("closingDialog").close();
  renderClosing();
  renderDashboard();
  markPendingChanges();
}

function exportClosingCSV() {
  const monthKey = state.currentMonth;
  const items = state.closings[monthKey] || [];
  const header = ["Área","Tarefa","Responsável","Status","Prazo","Validado por","Comentário"];
  const lines = [header.join(";")].concat(items.map(i =>
    [i.area, i.tarefa, i.responsavel, i.status, i.prazo, i.validadoPor, i.comentario].map(v => `"${(v||"").toString().replace(/"/g,'""')}"`).join(";")
  ));
  downloadCSV(lines.join("\n"), `ceres-confina-fechamento-${monthKey}.csv`);
}

function downloadCSV(content, filename) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------- RACI ---------- */

function renderRaci() {
  document.querySelector("#raciTable tbody").innerHTML = RACI_MATRIX.map(r => `
    <tr>
      <td>${esc(r.atividade)}</td>
      <td>${esc(r.r)}</td>
      <td>${esc(r.a)}</td>
      <td>${esc(r.c)}</td>
      <td>${esc(r.i)}</td>
    </tr>
  `).join("");
  if (window.mermaid) {
    mermaid.initialize({ startOnLoad: false, theme: "neutral" });
    mermaid.run({ querySelector: ".mermaid" });
  }
}

/* ---------- Inicialização ---------- */

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });

  // Projeto
  document.getElementById("btnSaveProject").addEventListener("click", () => {
  saveSharedData("btnSaveProject", "projectSaveStatus");
});
  document.getElementById("btnNewTask").addEventListener("click", () => openTaskDialog(null));
  document.getElementById("btnExportProject").addEventListener("click", exportProjectCSV);
  document.getElementById("taskCancel").addEventListener("click", () => document.getElementById("taskDialog").close());
  document.getElementById("taskDelete").addEventListener("click", deleteTask);
  document.getElementById("taskForm").addEventListener("submit", (e) => { e.preventDefault(); saveTask(); });
  ["filterFase","filterModulo","filterResponsavel","filterStatus"].forEach(id =>
    document.getElementById(id).addEventListener("change", renderProject)
  );

  // Fechamento
  document.getElementById("monthSelector").addEventListener("change", (e) => {
    state.currentMonth = e.target.value; saveData(); renderClosing(); renderDashboard();
  });
  document.getElementById("btnSaveClosing").addEventListener("click", () => {
  saveSharedData("btnSaveClosing", "closingSaveStatus");
});
  document.getElementById("btnNewMonth").addEventListener("click", () => {
    const input = prompt("Informe o novo mês no formato AAAA-MM (ex: 2026-08):", currentMonthKey());
    if (!input) return;
    if (!/^\d{4}-\d{2}$/.test(input)) { alert("Formato inválido. Use AAAA-MM."); return; }
    createMonth(input);
    state.currentMonth = input;
    saveData();
    renderClosing();
    renderAll();
  });
  document.getElementById("btnNewClosingItem").addEventListener("click", () => openClosingDialog(null));
  document.getElementById("btnExportClosing").addEventListener("click", exportClosingCSV);
  document.getElementById("btnPrintClosing").addEventListener("click", () => window.print());
  document.getElementById("closingCancel").addEventListener("click", () => document.getElementById("closingDialog").close());
  document.getElementById("closingDelete").addEventListener("click", deleteClosingItem);
  document.getElementById("closingForm").addEventListener("submit", (e) => { e.preventDefault(); saveClosingItem(); });
  ["filterArea","filterClosingStatus"].forEach(id =>
    document.getElementById(id).addEventListener("change", renderClosing)
  );

  renderAll();
});
