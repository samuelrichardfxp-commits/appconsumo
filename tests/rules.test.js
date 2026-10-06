import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateEquilibriumScore,
  calculateBudgetStats,
  filterConsumptionRecords,
  compareProducts,
} from '../src/rules.js';

test('calcula score de equilíbrio seguindo a fórmula do MVP', () => {
  const product = {
    environmental_score: 72,
    social_score: 70,
    durability_score: 82,
    cost_benefit: 68,
    confidence_level: 82,
  };

  assert.equal(calculateEquilibriumScore(product), 74);
});

test('calcula orçamento mensal com valor restante e percentual', () => {
  const result = calculateBudgetStats(300, [
    { total_impact: 184 },
    { total_impact: 42 },
  ]);

  assert.equal(result.total, 226);
  assert.equal(result.remaining, 74);
  assert.equal(result.percent, 75);
});

test('filtra histórico por mês e categoria', () => {
  const records = [
    { date: '2026-10-05', category: 'Moda', total_impact: 48 },
    { date: '2026-09-20', category: 'Tecnologia', total_impact: 120 },
    { date: '2026-10-12', category: 'Moda', total_impact: 60 },
  ];

  const filtered = filterConsumptionRecords(records, { month: '2026-10', category: 'Moda' });

  assert.equal(filtered.length, 2);
  assert.equal(filtered[0].total_impact, 48);
});

test('compara produtos por equilíbrio e impacto sem declarar vencedor absoluto', () => {
  const result = compareProducts(
    { name: 'Produto A', score: 71, carbon_footprint: 28 },
    { name: 'Produto B', score: 84, carbon_footprint: 15 }
  );

  assert.equal(result.scoreDelta, 13);
  assert.equal(result.impactDelta, 13);
  assert.match(result.summary, /Produto B/);
});
