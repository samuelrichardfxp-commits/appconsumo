export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function calculateEquilibriumScore(product = {}) {
  const environmental = Number(product.environmental_score ?? 0);
  const social = Number(product.social_score ?? 0);
  const durability = Number(product.durability_score ?? 0);
  const costBenefit = Number(product.cost_benefit ?? 0);
  const confidence = Number(product.confidence_level ?? 0);

  const score =
    environmental * 0.4 +
    social * 0.2 +
    durability * 0.2 +
    costBenefit * 0.1 +
    confidence * 0.1;

  return Math.round(clamp(score, 0, 100));
}

export function calculateBudgetStats(monthlyBudget = 0, records = []) {
  const total = records.reduce((sum, record) => sum + Number(record.total_impact || 0), 0);
  const remaining = Math.max(monthlyBudget - total, 0);
  const percent = monthlyBudget === 0 ? 0 : Math.min(Math.round((total / monthlyBudget) * 100), 100);

  return {
    budget: Number(monthlyBudget),
    total,
    remaining,
    percent,
  };
}

export function filterConsumptionRecords(records = [], filters = {}) {
  const { month = 'all', category = 'all' } = filters;

  return records.filter((record) => {
    const matchesMonth = month === 'all' || record.date?.startsWith(month);
    const matchesCategory = category === 'all' || record.category === category;
    return matchesMonth && matchesCategory;
  });
}

export function compareProducts(productA = {}, productB = {}) {
  const scoreDelta = Math.abs(Number(productA.score || 0) - Number(productB.score || 0));
  const impactDelta = Math.abs(Number(productA.carbon_footprint || 0) - Number(productB.carbon_footprint || 0));

  const winner = Number(productB.score || 0) > Number(productA.score || 0) ? productB : productA;
  const summary = `${winner.name || 'Produto'} aparece com melhor equilíbrio e menor impacto estimado, mas a decisão depende do uso e da prioridade do usuário.`;

  return {
    scoreDelta,
    impactDelta,
    summary,
  };
}

export function buildAlternatives(selectedProduct = {}, products = []) {
  const selectedCategory = selectedProduct.category || 'Geral';

  const sameCategory = products
    .filter((product) => product.id !== selectedProduct.id && product.category === selectedCategory)
    .sort((a, b) => calculateEquilibriumScore(b) - calculateEquilibriumScore(a));

  const lowerImpact = products
    .filter((product) => product.id !== selectedProduct.id)
    .sort((a, b) => Number(a.carbon_footprint || 0) - Number(b.carbon_footprint || 0));

  const lowerPrice = products
    .filter((product) => product.id !== selectedProduct.id)
    .sort((a, b) => Number(a.price || 0) - Number(b.price || 0));

  const higherDurability = products
    .filter((product) => product.id !== selectedProduct.id)
    .sort((a, b) => Number(b.durability_score || 0) - Number(a.durability_score || 0));

  const alternatives = [
    ...sameCategory.slice(0, 2),
    ...lowerImpact.slice(0, 2),
    ...lowerPrice.slice(0, 2),
    ...higherDurability.slice(0, 2),
  ];

  const unique = alternatives.filter(
    (product, index, items) => items.findIndex((item) => item.id === product.id) === index
  );

  return unique.slice(0, 4).map((product) => ({
    ...product,
    score: calculateEquilibriumScore(product),
  }));
}

export function createInsights(records = [], products = []) {
  const totalRecords = records.length;
  const categories = records.reduce((acc, record) => {
    acc[record.category] = (acc[record.category] || 0) + Number(record.total_impact || 0);
    return acc;
  }, {});

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  const uniqueProducts = new Set(records.map((record) => record.product_id)).size;
  const alternativesFound = products.filter((product) => product.score >= 80).length;

  const lines = [
    totalRecords === 0 ? 'Ainda não há produtos registrados neste mês.' : `Você registrou ${totalRecords} itens neste período.`,
    topCategory ? `Sua categoria de maior impacto foi ${topCategory[0]}.` : 'Ainda não há categoria dominante para analisar.',
    `Você encontrou ${alternativesFound} opções com equilíbrio forte entre as alternativas demonstradas.`,
    uniqueProducts > 0 ? `Você analisou ${uniqueProducts} produtos diferentes.` : 'Comece analisando seu primeiro produto.',
  ];

  return lines;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}
