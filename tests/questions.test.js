import test from 'node:test';
import assert from 'node:assert/strict';

import { PHASES, QUESTIONS } from '../src/data/questions.js';

test('mantém 20 perguntas, quatro em cada fase e quatro alternativas válidas', () => {
  assert.equal(QUESTIONS.length, 20);
  assert.equal(PHASES.length, 5);

  for (const phase of PHASES) {
    assert.equal(QUESTIONS.filter((question) => question.phase === phase.id).length, 4);
  }

  for (const question of QUESTIONS) {
    assert.equal(question.options.length, 4);
    assert.ok(question.answer >= 0 && question.answer < question.options.length);
    assert.ok(question.explanation.length > 0);
  }
});