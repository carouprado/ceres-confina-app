/* ============================================================
   CERES CONFINA — Dados-base (seed)
   Este arquivo só é usado na PRIMEIRA execução do app, para
   popular o localStorage. Depois disso, tudo que for editado
   pela interface fica salvo no navegador do usuário.
   ============================================================ */

const SEED_PROJECT_TASKS = [
  // Fase 1 - Planejamento
  { fase: "1. Planejamento e Levantamento", modulo: "Geral", tarefa: "Definir escopo, cronograma e responsáveis do projeto de implantação", responsavel: "Gerente de Projeto", status: "Em andamento", previsto: "", real: "", obs: "" },
  { fase: "1. Planejamento e Levantamento", modulo: "Geral", tarefa: "Definir usuários e perfis de acesso ao sistema", responsavel: "TI / Consultoria de Implantação", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "1. Planejamento e Levantamento", modulo: "Financeiro", tarefa: "Levantar estrutura atual de contas a pagar e a receber", responsavel: "Analista Financeiro", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "1. Planejamento e Levantamento", modulo: "Contábil", tarefa: "Levantar plano de contas e estrutura do imobilizado", responsavel: "Contador", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "1. Planejamento e Levantamento", modulo: "Fiscal", tarefa: "Levantar regras fiscais e tributárias aplicáveis ao confinamento", responsavel: "Analista Fiscal", status: "Não iniciado", previsto: "", real: "", obs: "" },

  // Fase 2 - Configuração
  { fase: "2. Parametrização e Configuração", modulo: "Financeiro", tarefa: "Parametrizar fluxo de títulos a vencer (pagamento e recebimento)", responsavel: "Analista Financeiro", status: "Não iniciado", previsto: "", real: "", obs: "Fluxo será validado pela contabilidade" },
  { fase: "2. Parametrização e Configuração", modulo: "Financeiro", tarefa: "Definir regra de validação dos lançamentos financeiros pela contabilidade", responsavel: "Contador", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "2. Parametrização e Configuração", modulo: "Contábil", tarefa: "Configurar módulo de imobilizado (cadastro de bens, taxas de depreciação)", responsavel: "Contador", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "2. Parametrização e Configuração", modulo: "Contábil", tarefa: "Parametrizar rotina de conferência de contas de ativo, passivo, despesa e resultado", responsavel: "Contador", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "2. Parametrização e Configuração", modulo: "Contábil", tarefa: "Definir processo de lançamento manual das CPRF (Cédula de Produto Rural Financeira)", responsavel: "Contador", status: "Não iniciado", previsto: "", real: "", obs: "Específico da operação de funding de confinamento" },
  { fase: "2. Parametrização e Configuração", modulo: "Fiscal", tarefa: "Parametrizar entrada de notas fiscais (insumos e serviços)", responsavel: "Analista Fiscal", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "2. Parametrização e Configuração", modulo: "Fiscal", tarefa: "Parametrizar emissão de notas fiscais de saída", responsavel: "Analista Fiscal", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "2. Parametrização e Configuração", modulo: "Fiscal", tarefa: "Configurar controle de estoque", responsavel: "Analista Fiscal", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "2. Parametrização e Configuração", modulo: "Fiscal", tarefa: "Parametrizar apuração de impostos (ICMS, PIS, COFINS)", responsavel: "Analista Fiscal", status: "Não iniciado", previsto: "", real: "", obs: "" },

  // Fase 3 - Migração
  { fase: "3. Migração de Dados", modulo: "Financeiro", tarefa: "Migrar saldos de contas a pagar e a receber em aberto", responsavel: "Analista Financeiro", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "3. Migração de Dados", modulo: "Contábil", tarefa: "Migrar saldos contábeis de abertura (balancete de transição)", responsavel: "Contador", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "3. Migração de Dados", modulo: "Fiscal", tarefa: "Migrar saldo de estoque e cadastro de produtos/insumos", responsavel: "Analista Fiscal", status: "Não iniciado", previsto: "", real: "", obs: "" },

  // Fase 4 - Testes
  { fase: "4. Testes e Homologação", modulo: "Financeiro", tarefa: "Testar fluxo completo de pagamento e recebimento de títulos", responsavel: "Analista Financeiro", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "4. Testes e Homologação", modulo: "Contábil", tarefa: "Homologar relatórios contábeis (balancete e DRE)", responsavel: "Contador", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "4. Testes e Homologação", modulo: "Fiscal", tarefa: "Testar geração de obrigações acessórias (SPED Fiscal / Contribuições)", responsavel: "Analista Fiscal", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "4. Testes e Homologação", modulo: "Geral", tarefa: "Homologação integrada entre Financeiro, Contábil e Fiscal", responsavel: "Gerente de Projeto", status: "Não iniciado", previsto: "", real: "", obs: "" },

  // Fase 5 - Treinamento
  { fase: "5. Treinamento", modulo: "Geral", tarefa: "Treinar equipe Financeiro, Contábil e Fiscal no novo sistema", responsavel: "Consultoria de Implantação", status: "Não iniciado", previsto: "", real: "", obs: "" },

  // Fase 6 - Go-live
  { fase: "6. Go-live", modulo: "Geral", tarefa: "Definir data de corte e plano de virada", responsavel: "Gerente de Projeto", status: "Não iniciado", previsto: "", real: "", obs: "" },
  { fase: "6. Go-live", modulo: "Geral", tarefa: "Checklist final de Go-live aprovado pela Diretoria", responsavel: "Controller / Gerente", status: "Não iniciado", previsto: "", real: "", obs: "" },

  // Fase 7 - Pós Go-live
  { fase: "7. Suporte Pós Go-live (Hypercare)", modulo: "Geral", tarefa: "Acompanhamento assistido 30/60/90 dias após virada", responsavel: "Consultoria de Implantação", status: "Não iniciado", previsto: "", real: "", obs: "" },
];

const CLOSING_TEMPLATE = [
  // Financeiro
  { area: "Financeiro", tarefa: "Conciliação bancária de todas as contas", responsavel: "Analista Financeiro", status: "Pendente", validadoPor: "Contabilidade", comentario: "" },
  { area: "Financeiro", tarefa: "Conferência de títulos a pagar vencidos e a vencer", responsavel: "Analista Financeiro", status: "Pendente", validadoPor: "Contabilidade", comentario: "" },
  { area: "Financeiro", tarefa: "Conferência de títulos a receber vencidos e a vencer", responsavel: "Analista Financeiro", status: "Pendente", validadoPor: "Contabilidade", comentario: "" },
  { area: "Financeiro", tarefa: "Validação dos lançamentos financeiros do mês", responsavel: "Contador", status: "Pendente", validadoPor: "Contabilidade", comentario: "" },

  // Contábil
  { area: "Contábil", tarefa: "Lançamento de depreciação/amortização do imobilizado", responsavel: "Contador", status: "Pendente", validadoPor: "Controller", comentario: "" },
  { area: "Contábil", tarefa: "Conferência das contas de ativo", responsavel: "Contador", status: "Pendente", validadoPor: "Controller", comentario: "" },
  { area: "Contábil", tarefa: "Conferência das contas de passivo", responsavel: "Contador", status: "Pendente", validadoPor: "Controller", comentario: "" },
  { area: "Contábil", tarefa: "Conferência das contas de despesa", responsavel: "Contador", status: "Pendente", validadoPor: "Controller", comentario: "" },
  { area: "Contábil", tarefa: "Conferência das contas de resultado", responsavel: "Contador", status: "Pendente", validadoPor: "Controller", comentario: "" },
  { area: "Contábil", tarefa: "Lançamento manual das CPRF do mês", responsavel: "Contador", status: "Pendente", validadoPor: "Controller", comentario: "" },
  { area: "Contábil", tarefa: "Fechamento do balancete mensal", responsavel: "Contador", status: "Pendente", validadoPor: "Controller", comentario: "" },

  // Fiscal
  { area: "Fiscal", tarefa: "Conferência das notas de entrada do mês", responsavel: "Analista Fiscal", status: "Pendente", validadoPor: "Contabilidade", comentario: "" },
  { area: "Fiscal", tarefa: "Conferência das notas de saída emitidas no mês", responsavel: "Analista Fiscal", status: "Pendente", validadoPor: "Contabilidade", comentario: "" },
  { area: "Fiscal", tarefa: "Conferência do controle de estoque (inventário)", responsavel: "Analista Fiscal", status: "Pendente", validadoPor: "Contabilidade", comentario: "" },
  { area: "Fiscal", tarefa: "Apuração de ICMS", responsavel: "Analista Fiscal", status: "Pendente", validadoPor: "Controller", comentario: "" },
  { area: "Fiscal", tarefa: "Apuração de PIS/COFINS", responsavel: "Analista Fiscal", status: "Pendente", validadoPor: "Controller", comentario: "" },
  { area: "Fiscal", tarefa: "Geração e entrega das obrigações acessórias (SPED Fiscal / Contribuições)", responsavel: "Analista Fiscal", status: "Pendente", validadoPor: "Controller", comentario: "" },
  { area: "Fiscal", tarefa: "Validação final do fechamento fiscal", responsavel: "Controller", status: "Pendente", validadoPor: "Diretoria", comentario: "" },
];

const RACI_MATRIX = [
  { atividade: "Lançamento de títulos a pagar e a receber", r: "Analista Financeiro", a: "Gerente", c: "Contador", i: "Diretoria" },
  { atividade: "Validação dos lançamentos financeiros", r: "Contador", a: "Gerente", c: "Analista Financeiro", i: "-" },
  { atividade: "Lançamento do imobilizado e depreciação", r: "Contador", a: "Gerente", c: "-", i: "-" },
  { atividade: "Conferência de contas (ativo, passivo, despesa, resultado)", r: "Contador", a: "Gerente", c: "Analista Financeiro / Fiscal", i: "-" },
  { atividade: "Lançamento manual de CPRF", r: "Contador", a: "Gerente", c: "Analista Financeiro", i: "-" },
  { atividade: "Entrada de notas fiscais", r: "Analista Fiscal", a: "Gerente", c: "Analista Financeiro", i: "Contador" },
  { atividade: "Emissão de notas fiscais de saída", r: "Analista Fiscal", a: "Gerente", c: "-", i: "Contador" },
  { atividade: "Controle de estoque", r: "Analista Fiscal", a: "Gerente", c: "-", i: "Contador" },
  { atividade: "Apuração de impostos", r: "Analista Fiscal", a: "Gerente", c: "Contador", i: "Diretoria" },
  { atividade: "Fechamento mensal (consolidação)", r: "Gerente", a: "Diretoria", c: "Contador / Fiscal / Financeiro", i: "-" },
  { atividade: "Parametrização e configuração do sistema (projeto)", r: "Consultoria de Implantação", a: "Gerente de Projeto", c: "Financeiro / Contábil / Fiscal", i: "Diretoria" },
  { atividade: "Testes e homologação", r: "Consultoria de Implantação + área responsável", a: "Gerente de Projeto", c: "Gerente", i: "Diretoria" },
  { atividade: "Go-live", r: "Gerente de Projeto", a: "Diretoria", c: "Todas as áreas", i: "-" },
];
