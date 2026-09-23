export const products = [
  {
    id: 'algodao-bolsa',
    name: 'Bolsa de algodão',
    category: 'Acessórios',
    price: 'R$ 89,00',
    score: 82,
    impact: 71,
    durability: 83,
    trust: 81,
    ingredients: ['Algodão orgânico', 'Produção local', 'Marcação ética'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    description: 'Acessório leve e versátil que combina beleza funcional com produção mais transparente.',
    source: 'Dados de avaliação sensorial e de traceabilidade pública.',
    alternatives: [
      { name: 'Bolsa reciclada', score: 88 },
      { name: 'Bolsa de lona', score: 74 },
      { name: 'Bolsa de couro', score: 63 }
    ]
  },
  {
    id: 'cafe-soluvel',
    name: 'Café solúvel',
    category: 'Bebidas',
    price: 'R$ 19,90',
    score: 61,
    impact: 54,
    durability: 68,
    trust: 65,
    ingredients: ['Arábica', 'Embalagem reciclável', 'Sem adição de açúcar'],
    image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80',
    description: 'Conveniente para uso diário, mas com menor equilíbrio quando comparado a opções com menor impacto de transporte.',
    source: 'Base de comparação de práticas de cultivo e embalagem.',
    alternatives: [
      { name: 'Café em grãos', score: 78 },
      { name: 'Café de comércio justo', score: 84 },
      { name: 'Café instantâneo premium', score: 67 }
    ]
  },
  {
    id: 'shampoo-biologico',
    name: 'Shampoo biológico',
    category: 'Cuidados pessoais',
    price: 'R$ 42,00',
    score: 85,
    impact: 79,
    durability: 88,
    trust: 86,
    ingredients: ['Óleo de coco', 'Sem sulfatos', 'Teste vegano'],
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    description: 'Fórmula com ingredientes de base vegetal e boa reputação por transparência de composição.',
    source: 'Comparação por ingredientes, certificações e durabilidade do uso.',
    alternatives: [
      { name: 'Shampoo artesanal', score: 83 },
      { name: 'Shampoo convencional', score: 58 },
      { name: 'Shampoo refill', score: 91 }
    ]
  },
  {
    id: 'sabonete-manteiga',
    name: 'Sabonete de manteiga',
    category: 'Higiene',
    price: 'R$ 24,50',
    score: 77,
    impact: 74,
    durability: 79,
    trust: 75,
    ingredients: ['Manteiga de cacau', 'Fragrância natural', 'Embalagem minimalista'],
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
    description: 'Boa opção para uso cotidiano, com bom volume e menor impacto em comparação com itens descartáveis.',
    source: 'Indicadores de composição, durabilidade e embalagem.',
    alternatives: [
      { name: 'Sabonete sólido', score: 86 },
      { name: 'Sabonete líquido', score: 68 },
      { name: 'Sabonete artesanal', score: 80 }
    ]
  },
  {
    id: 'tenis-retratil',
    name: 'Tênis retrátil',
    category: 'Calçados',
    price: 'R$ 239,00',
    score: 76,
    impact: 69,
    durability: 86,
    trust: 72,
    ingredients: ['Material reciclado', 'Sola sem PVC', 'Costura reforçada'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    description: 'Modelo com boa durabilidade, mas exige atenção ao ciclo de produção e uso prolongado.',
    source: 'Matriz de avaliação ambiental, social e de materialidade.',
    alternatives: [
      { name: 'Tênis de lona', score: 82 },
      { name: 'Tênis de couro', score: 59 },
      { name: 'Tênis recondicionado', score: 88 }
    ]
  },
  {
    id: 'caneca-ceramica',
    name: 'Caneca de cerâmica',
    category: 'Casa',
    price: 'R$ 59,00',
    score: 87,
    impact: 80,
    durability: 90,
    trust: 88,
    ingredients: ['Cerâmica local', 'Durabilidade alta', 'Pintura sem chumbo'],
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
    description: 'Boa escolha para uso frequente e menor descarte, com ótimo equilíbrio de durabilidade e impacto.',
    source: 'Indicadores de ciclo de vida e materiais de fabricação.',
    alternatives: [
      { name: 'Caneca plástica', score: 62 },
      { name: 'Caneca de vidro', score: 81 },
      { name: 'Caneca reutilizável inox', score: 75 }
    ]
  }
];

export default products;
