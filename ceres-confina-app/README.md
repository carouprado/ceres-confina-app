# Ceres Confina — Painel de Implantação e Fechamento

Aplicação web (HTML + CSS + JavaScript puro, sem dependências de build) para
acompanhar:

1. **Projeto de Implantação do Sistema** — tarefas por fase, módulo
   (Financeiro / Contábil / Fiscal / Geral), responsável, status e datas.
2. **Fechamento Mensal Contábil e Fiscal** — checklist recorrente por mês,
   separado por área, com status, prazo e quem valida cada item.
3. **Matriz de Responsabilidades (RACI)** e o fluxo de responsabilidades do
   fechamento mensal (diagrama).

## Como rodar localmente no VS Code

1. Abra a pasta `ceres-confina-app` no VS Code.
2. Instale a extensão **Live Server** (ou qualquer servidor estático).
3. Clique com o botão direito em `index.html` → **Open with Live Server**.
   - Não abra o arquivo direto por `file://`: o navegador bloqueia alguns
     recursos nesse modo. Sempre use um servidor local (Live Server, ou
     `npx serve`, ou `python -m http.server`).

Não há build, não há `npm install`, não há backend — é só HTML/CSS/JS.

## Como publicar na web (hospedagem gratuita, sem servidor)

Qualquer uma destas opções funciona arrastando a pasta:

- **Netlify Drop**: acesse https://app.netlify.com/drop e arraste a pasta
  `ceres-confina-app` inteira. Em segundos você recebe uma URL pública.
- **Vercel**: `npx vercel` dentro da pasta (ou importe o repositório Git pelo
  painel da Vercel).
- **GitHub Pages**: suba a pasta para um repositório no GitHub, ative
  "GitHub Pages" nas configurações do repositório apontando para a branch
  principal.

Como é um app 100% estático, qualquer um dos três publica sem nenhuma
configuração extra.

## Onde ficam os dados

Os dados (tarefas do projeto, checklist de fechamento por mês) ficam salvos
no **localStorage do navegador** de quem está usando o app. Isso significa:

- É rápido, gratuito e não precisa de banco de dados para começar a usar.
- Os dados **não são compartilhados automaticamente entre pessoas ou
  dispositivos diferentes** — cada navegador tem sua própria cópia.
- Use os botões **"Exportar CSV"** para gerar relatórios e compartilhar com
  a diretoria, e guarde uma cópia periódica se quiser um histórico fora do
  navegador.

### Evolução natural (quando o time crescer)

Quando mais de uma pessoa precisar editar os mesmos dados ao mesmo tempo (ex:
Financeiro, Contábil e Fiscal atualizando o mesmo fechamento em paralelo), o
próximo passo técnico é trocar o `localStorage` por um banco compartilhado —
por exemplo Firebase Firestore ou Supabase — mantendo a mesma interface. A
estrutura de dados em `data.js` já foi desenhada de forma simples (arrays de
objetos) exatamente para facilitar essa migração futura sem redesenhar o app.

## Estrutura de arquivos

```
ceres-confina-app/
├── index.html      # estrutura da página e dos formulários
├── styles.css       # identidade visual (cores da marca)
├── data.js          # dados iniciais: tarefas do projeto, checklist padrão
│                     de fechamento e matriz RACI
├── app.js           # toda a lógica: renderização, filtros, CRUD, export CSV
└── README.md
```

## Sobre a logo

A imagem da logo enviada na conversa não chegou como um arquivo anexável a
este pacote — por isso o cabeçalho usa um selo placeholder ("CERES /
CONFINA") no mesmo estilo circular. Para usar a logo real:

1. Salve o arquivo da logo como `logo.png` dentro da pasta `ceres-confina-app`.
2. No `index.html`, troque o bloco:
   ```html
   <div class="logo-badge" title="Ceres Confina">
     <span class="logo-top">CERES</span>
     <span class="logo-bottom">CONFINA</span>
   </div>
   ```
   por:
   ```html
   <img src="logo.png" alt="Ceres Confina" class="logo-img" />
   ```
3. No `styles.css`, adicione:
   ```css
   .logo-img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; }
   ```

## Módulos e responsabilidades (resumo)

| Módulo | Escopo | Responsável principal | Quem valida |
|---|---|---|---|
| Financeiro | Contas a pagar/receber, fluxo de títulos a vencer | Analista Financeiro | Contabilidade |
| Contábil | Imobilizado, conferência de ativo/passivo/despesa/resultado, lançamento manual de CPRF | Contador | Controller |
| Fiscal | Entrada/saída de notas, controle de estoque, apuração de impostos | Analista Fiscal | Controller |

A matriz RACI completa e o fluxograma de responsabilidades estão dentro do
próprio app, na aba **Responsabilidades**.
