import test from 'node:test';
import assert from 'node:assert/strict';
import { classify, TYPES, ANSWER_MAP, INTERPRETATIONS } from '../classification.js';

const fixtures = {
  explorer:[0,7,4,2,2,7,2], curator:[1,6,7,6,3,4,1],
  maker:[3,0,0,3,6,0,6], analyst:[2,5,6,3,5,2,4],
  connector:[4,2,5,4,7,5,5], storyteller:[4,1,7,4,3,6,5],
  planner:[5,3,2,0,4,3,0], grower:[2,7,6,5,5,0,3]
};

test('all eight coherent response patterns reach their intended type', () => {
  for (const [expected, answers] of Object.entries(fixtures)) {
    const result = classify(answers);
    assert.equal(result.primary, expected);
    assert.notEqual(result.primary, result.secondary);
    assert.equal(result.title, TYPES[expected].title);
    assert.equal(result.activity, TYPES[expected].activity);
    assert.equal(result.scores[expected], 100);
  }
});

test('each of the 53 choices contributes to scoring and changes visible interpretation', () => {
  assert.deepEqual(ANSWER_MAP.map(row=>row.length), [6,8,8,7,8,8,8]);
  const baseline = Array(7).fill(0);
  const result = classify(baseline);
  ANSWER_MAP.forEach((row, q) => {
    assert.equal(new Set(INTERPRETATIONS[q]).size, row.length);
    row.forEach(([primary, secondary], option) => {
      assert.ok(TYPES[primary] && TYPES[secondary]);
      assert.notEqual(primary, secondary);
      const answers = [...baseline]; answers[q] = option;
      const changed = classify(answers);
      assert.equal(changed.evidence[q], INTERPRETATIONS[q][option]);
      if (option !== 0) {
        assert.ok(changed.raw[primary] >= 3);
        assert.ok(changed.raw[secondary] >= 1);
        assert.equal(Object.values(changed.raw).reduce((sum, value) => sum + value, 0), 28);
        assert.notEqual(changed.signature, result.signature);
        assert.notEqual([...changed.strengthText,...changed.motiveText,...changed.directionText,...changed.tags].join('|'),
          [...result.strengthText,...result.motiveText,...result.directionText,...result.tags].join('|'));
      }
    });
  });
});

test('classification is deterministic, bounded and does not change answers across 10,000 patterns', () => {
  let seed = 42;
  const seen = new Set();
  for (let n=0;n<10000;n++) {
    const answers=ANSWER_MAP.map(row=>{
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      return Math.floor(seed / 2**32 * row.length);
    });
    const before = [...answers];
    const result = classify(answers);
    assert.deepEqual(classify(answers), result);
    assert.deepEqual(answers, before);
    for (const score of Object.values(result.scores)) assert.ok(score>=0 && score<=100);
    seen.add(result.primary);
    if (Object.values(result.raw).every(value=>value===0)) assert.fail('no scored answers');
  }
  assert.equal(seen.size, 8);
});

test('incomplete, sparse and out-of-range answers cannot produce a result', () => {
  for(const invalid of [null,[],Array(7),Array(7).fill(null),[-1,0,0,0,0,0,0],[6,0,0,0,0,0,0],[0,0,0,7,0,0,0],[0,0,0,0,0,0,.5]]) {
    assert.throws(()=>classify(invalid), TypeError);
  }
});
