const searchInput = document.getElementById("searchInput")
const cardGallery = document.getElementById("cardGallery")
const loadingIndicator = document.getElementById("loadingIndicator")
const resultsInfo = document.getElementById("resultsInfo")
const loadMoreBtn = document.getElementById("loadMoreBtn")
const loadMoreContainer = document.getElementById("loadMoreContainer")

// Cache para evitar requisições desnecessárias
const cache = new Map()

// Controle de paginação
let currentCards = []
let displayedCards = 0
const cardsPerPage = 12

// Debounce para otimizar as buscas
let searchTimeout

// Função para mostrar/esconder loading
function toggleLoading(show) {
  loadingIndicator.style.display = show ? "block" : "none"
}

// Função para mostrar informações dos resultados
function updateResultsInfo(total, displayed) {
  if (total > 0) {
    resultsInfo.textContent = `Mostrando ${displayed} de ${total} cartas`
    resultsInfo.style.display = "block"
  } else {
    resultsInfo.style.display = "none"
  }
}

// Função para criar elemento de carta otimizado
function createCardElement(card) {
  const cardElement = document.createElement("div")
  cardElement.classList.add("card")

  // Usa imagem pequena para exibição (mais leve)
  const smallImageUrl = card.card_images[0]?.image_url_small || card.card_images[0]?.image_url || ""
  // Mantém URL da imagem em alta qualidade para download
  const highQualityUrl = card.card_images[0]?.image_url || smallImageUrl

  const img = document.createElement("img")
  img.dataset.src = smallImageUrl // Lazy loading
  img.alt = card.name
  img.classList.add("card-image", "lazy")

  // Placeholder enquanto carrega
  img.src =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI5MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcnJlZ2FuZG8uLi48L3RleHQ+PC9zdmc+"

  const cardInfo = document.createElement("div")
  cardInfo.classList.add("card-info")

  const cardName = document.createElement("p")
  cardName.classList.add("card-name")
  cardName.textContent = card.name

  const downloadBtn = document.createElement("button")
  downloadBtn.classList.add("download-btn")
  downloadBtn.innerHTML = "⬇️ Download HD"
  downloadBtn.title = "Baixar imagem em alta qualidade"

  // Evento de download corrigido
  downloadBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    downloadImage(highQualityUrl, card.name, downloadBtn)
  })

  cardInfo.appendChild(cardName)
  cardInfo.appendChild(downloadBtn)
  cardElement.appendChild(img)
  cardElement.appendChild(cardInfo)

  return cardElement
}

// Lazy loading das imagens
function setupLazyLoading() {
  const lazyImages = document.querySelectorAll("img.lazy")

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    lazyImages.forEach((img) => imageObserver.observe(img))
  } else {
    // Fallback para navegadores sem IntersectionObserver
    lazyImages.forEach((img) => {
      img.src = img.dataset.src
      img.classList.remove("lazy")
    })
  }
}

// Função para exibir cartas com paginação
function displayCards(startIndex = 0) {
  const endIndex = Math.min(startIndex + cardsPerPage, currentCards.length)

  for (let i = startIndex; i < endIndex; i++) {
    const cardElement = createCardElement(currentCards[i])
    cardGallery.appendChild(cardElement)
  }

  displayedCards = endIndex
  updateResultsInfo(currentCards.length, displayedCards)

  // Controla botão "Carregar mais"
  if (displayedCards >= currentCards.length) {
    loadMoreContainer.style.display = "none"
  } else {
    loadMoreContainer.style.display = "block"
  }

  // Configura lazy loading para as novas imagens
  setTimeout(setupLazyLoading, 100)
}

// Função para buscar cartas otimizada
async function searchCards(query) {
  if (!query.trim()) {
    cardGallery.innerHTML = '<p class="no-results">Digite o nome de uma carta acima.</p>'
    resultsInfo.style.display = "none"
    loadMoreContainer.style.display = "none"
    return
  }

  // Verifica cache primeiro
  const cacheKey = query.toLowerCase().trim()
  if (cache.has(cacheKey)) {
    currentCards = cache.get(cacheKey)
    cardGallery.innerHTML = ""
    displayedCards = 0
    displayCards()
    return
  }

  toggleLoading(true)

  try {
    const res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(query)}`)
    const data = await res.json()

    toggleLoading(false)

    if (!data.data || data.data.length === 0) {
      cardGallery.innerHTML = '<p class="no-results">Nenhuma carta encontrada.</p>'
      resultsInfo.style.display = "none"
      loadMoreContainer.style.display = "none"
      return
    }

    // Armazena no cache
    cache.set(cacheKey, data.data)
    currentCards = data.data

    // Limpa galeria e reseta contador
    cardGallery.innerHTML = ""
    displayedCards = 0

    // Exibe primeira página
    displayCards()
  } catch (error) {
    console.error("Erro ao buscar cartas:", error)
    toggleLoading(false)
    cardGallery.innerHTML = '<p class="error">Erro ao carregar cartas. Tente novamente.</p>'
    resultsInfo.style.display = "none"
    loadMoreContainer.style.display = "none"
  }
}

// Função para baixar a imagem corrigida
async function downloadImage(url, name, buttonElement) {
  try {
    // Mostra feedback visual
    const originalText = buttonElement.innerHTML
    buttonElement.innerHTML = "⏳ Baixando..."
    buttonElement.disabled = true

    // Cria um proxy para evitar problemas de CORS
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`

    // Tenta primeiro a URL original, depois o proxy se necessário
    let response
    try {
      response = await fetch(url, { mode: "no-cors" })
      // Se no-cors, usa uma abordagem diferente
      if (response.type === "opaque") {
        throw new Error("CORS issue, using proxy")
      }
    } catch (corsError) {
      // Usa método alternativo para download direto
      const link = document.createElement("a")
      link.href = url
      link.download = `${name.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")}.jpg`
      link.target = "_blank"
      link.rel = "noopener noreferrer"

      // Adiciona temporariamente ao DOM e clica
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Restaura botão
      buttonElement.innerHTML = "✅ Baixado!"
      buttonElement.disabled = false

      setTimeout(() => {
        buttonElement.innerHTML = originalText
      }, 2000)

      return
    }

    const blob = await response.blob()
    const extMatch = url
      .split(".")
      .pop()
      .match(/[^?#]+/)
    const ext = extMatch ? extMatch[0] : "jpg"

    const downloadUrl = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = `${name.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")}.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(downloadUrl)

    // Restaura botão
    buttonElement.innerHTML = "✅ Baixado!"
    buttonElement.disabled = false

    setTimeout(() => {
      buttonElement.innerHTML = originalText
    }, 2000)
  } catch (error) {
    console.error("Erro ao baixar imagem:", error)
    buttonElement.innerHTML = "❌ Erro"
    buttonElement.disabled = false
    setTimeout(() => {
      buttonElement.innerHTML = "⬇️ Download HD"
    }, 2000)
  }
}

// Evento de busca com debounce
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    const query = searchInput.value
    searchCards(query)
  }, 500) // Aguarda 500ms após parar de digitar
})

// Evento do botão "Carregar mais"
loadMoreBtn.addEventListener("click", () => {
  displayCards(displayedCards)
})

// Limpa cache periodicamente para evitar uso excessivo de memória
setInterval(() => {
  if (cache.size > 50) {
    cache.clear()
  }
}, 300000) // A cada 5 minutos

// Funcionalidade do tema escuro
const themeToggle = document.getElementById("themeToggle")
const themeIcon = document.querySelector(".theme-icon")

// Verifica tema salvo ou preferência do sistema
function getInitialTheme() {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    return savedTheme
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

// Aplica o tema
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme)
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙"
  localStorage.setItem("theme", theme)
}

// Alterna tema
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"
  applyTheme(newTheme)
}

// Inicializa tema
applyTheme(getInitialTheme())

// Event listener para o botão de tema
themeToggle.addEventListener("click", toggleTheme)

// Escuta mudanças na preferência do sistema
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    applyTheme(e.matches ? "dark" : "light")
  }
})
