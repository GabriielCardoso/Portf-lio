# Portfólio

Site de portfólio de página única, feito só com **HTML, CSS e JavaScript** (sem build, sem dependências).
Seções com navegação por âncora: `#home`, `#about`, `#skills`, `#projects`, `#experience` e `#contact`.

## Ver no computador

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Ou simplesmente abra o `index.html` no navegador.

## Estrutura

```
index.html              ← todo o conteúdo (textos, projetos, experiência…)
assets/css/style.css    ← visual (cores no topo do arquivo)
assets/js/main.js       ← interações (tema, menu, filtro, abas, digitação…)
assets/img/avatar.svg   ← foto de perfil provisória
assets/img/favicon.svg  ← ícone da aba
```

## Como colocar suas informações

Tudo o que é texto está em `index.html`. Procure por **"Seu Nome"**, `seu@email.com` e `seu-usuario`
(use a busca do editor, Ctrl+F) e troque pelos seus dados. Os blocos, na ordem da página:

| Seção | O que editar |
|---|---|
| **Header / título** | Nome do logo (`seunome.dev`), `<title>` e as `<meta>` no `<head>` |
| **Home** | Nome, frases do efeito de digitação (`data-roles` no `#typed`), descrição, links das redes sociais, chips flutuantes (React, Node.js, TypeScript) |
| **Sobre** | Texto, lista de dados e os 4 números (`data-count="3"`) |
| **Habilidades** | Um `<article class="skill-card">` por categoria. A barra usa `--lvl:90%` |
| **Projetos** | Um `<article class="project">` por projeto. Copie, cole e altere |
| **Experiência** | Uma `<li class="timeline__item">` por cargo (aba "Experiência") ou curso (aba "Formação") |
| **Contato** | E-mail, localização, links e o `data-email` do formulário |

### Foto de perfil

Coloque sua foto em `assets/img/` (por exemplo `foto.jpg`, quadrada) e troque o `src` da imagem em `index.html`:

```html
<img class="photo__img" src="assets/img/foto.jpg" alt="Foto de Seu Nome" ...>
```

### Imagem dos projetos

Cada projeto usa um fundo em degradê. Para usar um print do projeto, adicione uma `<img>` dentro de `.project__thumb`:

```html
<div class="project__thumb" style="--h1:262;--h2:190">
  <img src="assets/img/projeto-um.png" alt="Tela do Projeto Um" loading="lazy">
</div>
```

### Categorias do filtro de projetos

Em cada projeto, `data-category="frontend backend"` define em quais filtros ele aparece
(valores: `frontend`, `backend`, `mobile`). Para criar um filtro novo, adicione um botão
`<button class="filter" data-filter="novo">` e use `novo` nos projetos.

### Cores e tema

No início de `assets/css/style.css` ficam as variáveis de cor (`--accent`, `--accent-2`, `--bg`…),
uma versão para o tema escuro (padrão) e outra para o claro (`:root[data-theme="light"]`).
O botão no canto superior direito alterna o tema e a escolha fica salva no navegador.

### Formulário de contato

Como o site é estático, o formulário abre o app de e-mail do visitante já preenchido (`mailto:`).
Se quiser receber as mensagens direto na caixa de entrada, dá para ligá-lo a um serviço como
Formspree ou Web3Forms, trocando o envio em `assets/js/main.js`.

## Publicar de graça

**GitHub Pages:** no repositório, vá em *Settings → Pages*, escolha *Deploy from a branch*,
selecione a branch principal e a pasta `/ (root)`. O site fica em
`https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Também funciona em Netlify, Vercel e Cloudflare Pages: basta apontar para esta pasta, sem comando de build.
