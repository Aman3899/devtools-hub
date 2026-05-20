import { test } from 'node:test';
import assert from 'node:assert';
import { cn } from './utils.ts';

test('cn merges Tailwind classes correctly', () => {
  // Test basic class concatenation
  assert.strictEqual(cn('text-red-500', 'bg-blue-500'), 'text-red-500 bg-blue-500');

  // Test Tailwind class overriding (twMerge)
  const result = cn('px-2 py-1', 'bg-red-500', 'px-4');
  assert.strictEqual(result.includes('px-4'), true);
  assert.strictEqual(result.includes('px-2'), false); // px-4 should override px-2
});
