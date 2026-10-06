import { products } from './data/products.js';
import { calculateEquilibriumScore, formatCurrency } from './rules.js';

export class App {
  constructor() {
    this.products = products.map((product) => ({
      ...product,
      price: Number(product.price || 0),
      score: calculateEquilibriumScore(product),
    }));

    this.selectedCategory = 'all';
    this.selectedProductId = this.products[0].id;
    this.votes = this.loadVotes();

    this.cacheElements();
    this.bindEvents();
    this.renderAll();
  }

  cacheElements() {
    this.pageNodes = document.querySelectorAll('.page');
    this.navButtons = document.querySelectorAll('[data-nav]');
    this.pollCards = document.getElementById('pollCards');
    this.resultsPanel = document.getElementById('resultsPanel');
    this.productDetail = document.getElementById('productDetail');
    this.featuredProduct = document.getElementById('featuredProduct');
    this.categoryFilters = document.getElementById('categoryFilters');
    this.toast = document.getElementById('toast');
  }

  bindEvents() {
    this.navButtons.forEach((button) => {
      button.addEventListener('click', () => this.showPage(button.dataset.nav));
    });

    document.addEventListener('click', (event) => {
      const voteButton = event.target.closest('[data-vote-id]');
      if (voteButton) {
        this.handleVote(voteButton.dataset.voteId);
        return;
      }

      const detailButton = event.target.closest('[data-detail-id]');
      if (detailButton) {
        this.selectedProductId = detailButton.dataset.detailId;
        this.renderDetail();
        this.showPage('detalhes');
        return;
      }

      const categoryButton = event.target.closest('[data-category]');
      if (categoryButton) {
        this.selectedCategory = categoryButton.dataset.category;
        this.renderCategoryFilters();
        this.renderPoll();
      }
    });
  }

  loadVotes() {
    try {
      return JSON.parse(localStorage.getItem('equilibrio-votes') || '{}');
    } catch {
      return {};
    }
  }

  saveVotes() {
    localStorage.setItem('equilibrio-votes', JSON.stringify(this.votes));
  }

  handleVote(productId) {
    this.votes[productId] = (this.votes[productId] || 0) + 1;
    this.saveVotes();
    this.renderAll();
    this.showToast('Voto registrado com sucesso.');
  }

  showPage(pageId) {
    this.pageNodes.forEach((page) => page.classList.toggle('active', page.id === pageId));
    this.navButtons.forEach((button) => button.classList.toggle('active', button.dataset.nav === pageId));
  }

  renderAll() {
    this.renderFeaturedProduct();
    this.renderCategoryFilters();
    this.renderPoll();
    this.renderResults();
    this.renderDetail();
  }

  getVisibleProducts() {
    return this.selectedCategory === 'all'
      ? this.products
      : this.products.filter((product) => product.category === this.selectedCategory);
  }

  renderFeaturedProduct() {
    const featured = [...this.products].sort((a, b) => b.score - a.score)[0];

    this.featuredProduct.innerHTML = `
      <article class="featured-card card">
        <img src="${featured.image_url}" alt="${featured.name}" />
        <div class="featured-body">
          <span class="pill">Produto destacado</span>
          <h3>${featured.name}</h3>
          <p>${featured.pollLabel}</p>
          <div class="score-line">
            <strong>${featured.score}</strong>
            <span>equilíbrio</span>
          </div>
        </div>
      </article>
    `;
  }

  renderCategoryFilters() {
    const categories = ['all', ...new Set(this.products.map((product) => product.category))];

    this.categoryFilters.innerHTML = categories
      .map((category) => {
        const label = category === 'all' ? 'Todas' : category;
        return `
          <button class="filter-btn ${this.selectedCategory === category ? 'active' : ''}" data-category="${category}">
            ${label}
          </button>
        `;
      })
      .join('');
  }

  renderPoll() {
    const items = this.getVisibleProducts();

    this.pollCards.innerHTML = items
      .map((product) => {
        const voteCount = this.votes[product.id] || 0;
        return `
          <article class="product-card card">
            <img src="${product.image_url}" alt="${product.name}" />
            <div class="card-body">
              <div class="card-head">
                <span class="pill">${product.category}</span>
                <span class="score-badge">${product.score}</span>
              </div>

              <h3>${product.name}</h3>
              <p>${product.description}</p>

              <div class="meta-list">
                <span>Preço: ${formatCurrency(product.price)}</span>
                <span>CO₂e: ${product.carbon_footprint} kg</span>
              </div>

              <div class="tag-list">
                <span>${product.pollLabel}</span>
              </div>

              <div class="card-foot">
                <button class="primary-btn" data-vote-id="${product.id}">Votar</button>
                <button class="secondary-btn" data-detail-id="${product.id}">Detalhes</button>
              </div>

              <div class="vote-meta">
                <span>${voteCount} voto(s)</span>
              </div>
            </div>
          </article>
        `;
      })
      .join('');
  }

  renderResults() {
    const totalVotes = this.products.reduce((sum, product) => sum + (this.votes[product.id] || 0), 0) || 1;
    const ordered = [...this.products].sort((a, b) => (this.votes[b.id] || 0) - (this.votes[a.id] || 0));

    this.resultsPanel.innerHTML = ordered
      .map((product) => {
        const votes = this.votes[product.id] || 0;
        const percent = Math.round((votes / totalVotes) * 100);

        return `
          <article class="ranking-item card">
            <div class="result-head">
              <div>
                <span class="pill">${product.category}</span>
                <strong>${product.name}</strong>
              </div>
              <span class="vote-total">${votes} votos</span>
            </div>

            <div class="bar-track"><span style="width: ${percent}%"></span></div>

            <div class="result-foot">
              <span>${percent}%</span>
              <span>score ${product.score}</span>
            </div>
          </article>
        `;
      })
      .join('');
  }

  renderDetail() {
    const product = this.products.find((item) => item.id === this.selectedProductId) || this.products[0];

    this.productDetail.innerHTML = `
      <article class="detail-card card">
        <div class="detail-header">
          <div>
            <p class="eyebrow">Variação</p>
            <h2>${product.name}</h2>
            <p>${product.brand} · ${product.category}</p>
          </div>
          <div class="score-box">${product.score}<small>/100</small></div>
        </div>

        <div class="metrics-row">
          <div><span>Ambiental</span><strong>${product.environmental_score}</strong></div>
          <div><span>Social</span><strong>${product.social_score}</strong></div>
          <div><span>Durabilidade</span><strong>${product.durability_score}</strong></div>
          <div><span>Preço</span><strong>${formatCurrency(product.price)}</strong></div>
          <div><span>Confiança</span><strong>${product.confidence_level}</strong></div>
        </div>

        <div class="impact-grid">
          <div><span>CO₂e</span><strong>${product.carbon_footprint} kg</strong></div>
          <div><span>Água</span><strong>${product.water_footprint} L</strong></div>
          <div><span>Resíduos</span><strong>${product.waste_score} g</strong></div>
        </div>

        <p class="muted-copy">${product.description}</p>

        <div class="detail-actions">
          <button class="primary-btn" data-vote-id="${product.id}">Votar nesta opção</button>
          <button class="secondary-btn" data-nav="poll">Voltar para a enquete</button>
        </div>
      </article>
    `;
  }

  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.remove('hidden');
    clearTimeout(this.toast.timeoutId);
    this.toast.timeoutId = setTimeout(() => this.toast.classList.add('hidden'), 2200);
  }
}
