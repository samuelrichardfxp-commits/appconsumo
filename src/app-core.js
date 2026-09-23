import { products } from './data/products.js';

export class AppCore {
  constructor() {
    this.products = products;
    this.currentPage = 'landing';
    this.compareProducts = this.products.slice(0, 3);
    this.history = [
      { item: 'Caneca de cerâmica', date: 'Hoje', decision: 'Comprou', score: 87 },
      { item: 'Shampoo biológico', date: 'Há 3 dias', decision: 'Recomendado', score: 85 },
      { item: 'Bolsa de algodão', date: 'Semana passada', decision: 'Mantém', score: 82 }
    ];

    this.cacheElements();
    this.bindEvents();
    this.renderDashboard();
    this.renderSearchResults(this.products.slice(0, 4));
    this.renderDetail(this.products[0]);
    this.renderCompare();
    this.renderHistory();
    this.renderProfile();
  }

  cacheElements() {
    this.dashboardContent = document.querySelector('#dashboardContent');
    this.searchForm = document.querySelector('#searchForm');
    this.productSearch = document.querySelector('#productSearch');
    this.searchResults = document.querySelector('#searchResults');
    this.productDetail = document.querySelector('#productDetail');
    this.compareContent = document.querySelector('#compareContent');
    this.historyContent = document.querySelector('#historyContent');
    this.profileContent = document.querySelector('#profileContent');
    this.toast = document.querySelector('#toast');
    this.authModal = document.querySelector('#authModal');
    this.authForm = document.querySelector('#authForm');
    this.loginBtn = document.querySelector('#loginBtn');
    this.logoutBtn = document.querySelector('#logoutBtn');
    this.closeModalBtn = document.querySelector('.close-modal');
  }

  bindEvents() {
    document.querySelectorAll('.nav-button').forEach((button) => {
      button.addEventListener('click', () => this.showPage(button.dataset.target));
    });

    document.querySelectorAll('[data-nav]').forEach((button) => {
      button.addEventListener('click', () => this.showPage(button.dataset.nav));
    });

    this.searchForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = this.productSearch.value.trim().toLowerCase();
      const filtered = this.products.filter((product) => {
        const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
        return haystack.includes(query);
      });

      if (!query) {
        this.renderSearchResults(this.products.slice(0, 4));
        this.showToast('Mostrando sugestões populares.');
        return;
      }

      this.renderSearchResults(filtered.length ? filtered : []);
      if (filtered.length) {
        this.renderDetail(filtered[0]);
      }
      this.showToast(filtered.length ? `Encontramos ${filtered.length} resultado(s).` : 'Nenhum resultado encontrado.');
    });

    this.dashboardContent?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-product-id]');
      if (!button) return;
      const target = this.products.find((product) => product.id === button.dataset.productId);
      if (target) {
        this.renderDetail(target);
        this.showPage('analysis');
      }
    });

    this.searchResults?.addEventListener('click', (event) => {
      const card = event.target.closest('[data-view-product]');
      if (!card) return;
      const product = this.products.find((item) => item.id === card.dataset.viewProduct);
      if (product) {
        this.renderDetail(product);
        this.showPage('analysis');
      }
    });

    this.loginBtn?.addEventListener('click', () => this.openAuthModal());
    this.logoutBtn?.addEventListener('click', () => {
      this.logoutBtn.classList.add('hidden');
      this.loginBtn.classList.remove('hidden');
      this.showToast('Sessão encerrada.');
    });
    this.closeModalBtn?.addEventListener('click', () => this.closeAuthModal());
    this.authModal?.addEventListener('click', (event) => {
      if (event.target === this.authModal) this.closeAuthModal();
    });
    this.authForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(this.authForm);
      const name = (data.get('name') || 'Usuário').toString().trim();
      const email = data.get('email')?.toString().trim();
      if (!email) return;
      this.closeAuthModal();
      this.loginBtn.classList.add('hidden');
      this.logoutBtn.classList.remove('hidden');
      this.showToast(`Bem-vindo(a), ${name || 'usuário'}!`);
      this.renderProfile(name, email);
    });
  }

  showPage(target) {
    this.currentPage = target;
    document.querySelectorAll('.page').forEach((page) => {
      page.classList.toggle('active', page.id === target);
    });
    document.querySelectorAll('.nav-button').forEach((button) => {
      button.classList.toggle('active', button.dataset.target === target);
    });
  }

  openAuthModal() {
    this.authModal?.classList.remove('hidden');
    this.authModal?.setAttribute('aria-hidden', 'false');
  }

  closeAuthModal() {
    this.authModal?.classList.add('hidden');
    this.authModal?.setAttribute('aria-hidden', 'true');
  }

  renderDashboard() {
    if (!this.dashboardContent) return;
    const cards = this.products
      .map((product) => `
        <article class="stat-card">
          <div class="stat-topline">
            <span class="badge">${product.category}</span>
            <span class="price">${product.price}</span>
          </div>
          <div class="impact-block">
            <strong>${product.score}</strong>
            <span>Equilíbrio geral</span>
          </div>
          <div class="progress-track"><span style="width: ${product.score}%"></span></div>
          <div class="mini-metrics">
            <span>Impacto: ${product.impact}</span>
            <span>Durabilidade: ${product.durability}</span>
          </div>
          <ul class="insight-list">
            <li>${product.name}</li>
            <li>${product.description}</li>
          </ul>
          <button class="secondary-btn" data-product-id="${product.id}">Ver produto</button>
        </article>
      `)
      .join('');

    this.dashboardContent.innerHTML = cards;
  }

  renderSearchResults(items) {
    if (!this.searchResults) return;
    if (!items.length) {
      this.searchResults.innerHTML = `
        <div class="empty-state">
          <h3>Nenhum produto encontrado</h3>
          <p>Tente outra palavra-chave ou confira as sugestões do dashboard.</p>
        </div>
      `;
      return;
    }

    this.searchResults.innerHTML = items
      .map((product) => `
        <article class="card product-card">
          <img src="${product.image}" alt="${product.name}" />
          <div class="card-body">
            <div class="heading-row">
              <h3>${product.name}</h3>
              <span class="badge">${product.score}</span>
            </div>
            <p>${product.category}</p>
            <div class="tag-list">
              ${product.ingredients.slice(0, 2).map((ingredient) => `<span>${ingredient}</span>`).join('')}
            </div>
            <div class="heading-row">
              <span class="price">${product.price}</span>
              <button class="primary-btn" data-view-product="${product.id}">Abrir</button>
            </div>
          </div>
        </article>
      `)
      .join('');
  }

  renderDetail(product) {
    if (!this.productDetail || !product) return;
    this.productDetail.innerHTML = `
      <article class="detail-card card">
        <div class="detail-header">
          <div>
            <p class="eyebrow">Detalhes do produto</p>
            <h3>${product.name}</h3>
          </div>
          <div class="score-box">${product.score}<small>/100</small></div>
        </div>

        <div class="metric-grid">
          <div>
            <span>Impacto</span>
            <strong>${product.impact}</strong>
          </div>
          <div>
            <span>Durabilidade</span>
            <strong>${product.durability}</strong>
          </div>
          <div>
            <span>Confiança</span>
            <strong>${product.trust}</strong>
          </div>
          <div>
            <span>Preço</span>
            <strong>${product.price}</strong>
          </div>
          <div>
            <span>Categoria</span>
            <strong>${product.category}</strong>
          </div>
        </div>

        <p class="explanation">${product.description}</p>

        <div class="detail-actions">
          <button class="primary-btn" data-nav="compare">Comparar</button>
          <button class="secondary-btn" data-nav="history">Adicionar ao histórico</button>
        </div>

        <div class="data-source">
          <h4>Fontes e critérios</h4>
          <p>${product.source}</p>
          <div class="tag-list">
            ${product.ingredients.map((ingredient) => `<span>${ingredient}</span>`).join('')}
          </div>
        </div>

        <div class="alternatives-wrap">
          <h4>Alternativas mais equilibradas</h4>
          <div class="alternative-list">
            ${product.alternatives
              .map(
                (item) => `
                  <div class="alternative-item">
                    <div>
                      <strong>${item.name}</strong>
                      <small>Comparado ao produto atual</small>
                    </div>
                    <span class="badge">${item.score}</span>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      </article>
    `;

    this.productDetail.querySelectorAll('[data-nav]').forEach((button) => {
      button.addEventListener('click', () => this.showPage(button.dataset.nav));
    });
  }

  renderCompare() {
    if (!this.compareContent) return;
    const rows = this.products.slice(0, 3)
      .map(
        (product) => `
          <tr>
            <td>${product.name}</td>
            <td>${product.score}</td>
            <td>${product.impact}</td>
            <td>${product.durability}</td>
            <td>${product.trust}</td>
            <td>${product.price}</td>
          </tr>
        `
      )
      .join('');

    this.compareContent.innerHTML = `
      <div class="card compare-table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Equilíbrio</th>
              <th>Impacto</th>
              <th>Durabilidade</th>
              <th>Confiança</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  renderHistory() {
    if (!this.historyContent) return;
    this.historyContent.innerHTML = this.history
      .map(
        (entry) => `
          <div class="card history-item">
            <div>
              <strong>${entry.item}</strong>
              <small>${entry.date}</small>
            </div>
            <div class="history-meta">
              <span>${entry.decision}</span>
              <span class="badge">${entry.score}</span>
            </div>
          </div>
        `
      )
      .join('');
  }

  renderProfile(name = 'Usuário', email = 'usuario@equilibrio.app') {
    if (!this.profileContent) return;
    this.profileContent.innerHTML = `
      <div class="card profile-card" style="padding: 24px;">
        <div class="detail-header">
          <div>
            <p class="eyebrow">Perfil</p>
            <h3>${name}</h3>
          </div>
          <span class="badge">MVP ativo</span>
        </div>

        <div class="field">
          <label>Nome</label>
          <input type="text" value="${name}" />
        </div>
        <div class="field">
          <label>E-mail</label>
          <input type="email" value="${email}" />
        </div>
        <div class="field">
          <label>Meta de consumo</label>
          <input type="text" value="Priorizar itens com equilíbrio acima de 80" />
        </div>
      </div>
    `;
  }

  showToast(message) {
    if (!this.toast) return;
    this.toast.textContent = message;
    this.toast.classList.remove('hidden');
    clearTimeout(this.toast.timer);
    this.toast.timer = setTimeout(() => this.toast.classList.add('hidden'), 2200);
  }
}
