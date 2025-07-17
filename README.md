
# Yu-Gi-Oh! Card Gallery 🃏  
*Uma aplicação web para buscar e exibir cartas de Yu-Gi-Oh! usando a [API do YGOProDeck](https://db.ygoprodeck.com/api/glossary/).*

---

## 📌 Visão Geral

Esta é uma galeria interativa de cartas de Yu-Gi-Oh!, desenvolvida com HTML, CSS e JavaScript puro, utilizando a API pública do YGOProDeck para obter dados em tempo real sobre as cartas. A interface responsiva permite navegar pelas cartas facilmente, com suporte a tema claro/escuro e carregamento progressivo de resultados.

---

<img width="1224" height="932" alt="imagem_2025-07-17_161457064" src="https://github.com/user-attachments/assets/bf0a6d06-0a53-46ae-a7ec-6dd39a4c9994" />

---


## 🔧 Funcionalidades

✔️ **Busca de Cartas**  
Pesquise por nome ou parte do nome das cartas através de um campo de busca intuitivo.

✔️ **Exibição em Grade Responsiva**  
As cartas são mostradas em uma grade adaptável, exibindo nome, tipo, atributos e imagem.

✔️ **Carregar Mais Cartas**  
Ao pressionar o botão "Carregar Mais Cartas", novos resultados são buscados e adicionados à página.

✔️ **Tema Claro/Escuro**  
Altere entre modo claro e escuro com um único clique, melhorando a experiência do usuário.

✔️ **Indicador de Carregamento**  
Um spinner visual aparece enquanto os dados são carregados, informando o usuário sobre o processo.

✔️ **Tratamento de Erros**  
Mensagens amigáveis são exibidas caso ocorram falhas na conexão ou resposta inválida da API.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica da página.
- **CSS3**: Estilização moderna e responsiva.
- **JavaScript (ES6+)**: Lógica da aplicação e chamadas à API via Fetch.
- **YGOProDeck API**: Fonte dos dados das cartas.

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/yugioh-card-gallery.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd yugioh-card-gallery
   ```

3. **Abra o arquivo `index.html` no navegador:**  
   Você pode abrir diretamente no navegador ou usar um servidor local como Live Server no VS Code.

---

## ⚠️ Considerações Importantes

### Chave de API
> A API do YGOProDeck **não requer chave de acesso**, mas fique atento às taxas limites e termos de uso.

### Limitações da API
- Evite requisições excessivas para não ultrapassar o limite da API.
- Em caso de bloqueio temporário, implemente um sistema de espera ou notificação ao usuário.

### Imagens
As imagens das cartas são carregadas diretamente da URL retornada pela API. Caso haja mudança no formato da resposta, ajuste o código JS conforme necessário.

---

## 🤝 Contribuições

Contribuições são sempre bem-vindas! Se você quiser adicionar recursos como filtros avançados, ordenação de cartas, favoritos ou até mesmo integrar com frameworks (React, Vue, etc), fique à vontade!

---

> Desenvolvido com ❤️ por Fernando  
GitHub: [@Alegria-LTDA](https://github.com/Alegria-LTDA)
