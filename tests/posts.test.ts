import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { loadPublishedPosts } from '../lib/posts'
import { serializeJsonLd } from '../lib/site'

function withPosts(files: Record<string, string>, check: (directory: string) => void) {
  const directory = mkdtempSync(path.join(tmpdir(), 'btc-insight-posts-'))
  try {
    for (const [name, body] of Object.entries(files))
      writeFileSync(path.join(directory, name), body)
    check(directory)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

function article(metadata = '') {
  return `---\ntitle: テスト記事\ndate: "2026-11-06"\ndescription: 記事の説明\n${metadata}\n---\n\n## 見出し\n\n記事本文です。\n`
}

test('zero articles and unrelated files produce an empty published list', () => {
  withPosts({ '.gitkeep': '', 'notes.txt': 'not an article' }, (dir) =>
    assert.deepEqual(loadPublishedPosts(dir), [])
  )
})

test('drafts are opt-in for publication and never returned by slug/list data', () => {
  withPosts(
    {
      'default-draft.md': article(),
      'explicit-draft.md': article('draft: true'),
      'published.md': article('draft: false'),
    },
    (dir) => {
      assert.deepEqual(
        loadPublishedPosts(dir).map((post) => post.slug),
        ['published']
      )
    }
  )
})

test('sorts deterministically and normalizes quoted/unquoted YAML dates', () => {
  withPosts(
    {
      'old.md': article('draft: false').replace('"2026-11-06"', '2026-01-01'),
      'z-new.md': article('draft: false'),
      'a-new.md': article('draft: false'),
    },
    (dir) =>
      assert.deepEqual(
        loadPublishedPosts(dir).map((post) => [post.slug, post.date]),
        [
          ['a-new', '2026-11-06'],
          ['z-new', '2026-11-06'],
          ['old', '2026-01-01'],
        ]
      )
  )
})

test('Japanese taxonomy labels and local authors resolve without CMS references', () => {
  withPosts(
    {
      'test.md': article(
        'draft: false\nauthor: yutaro\ncategories:\n  - name: 基礎知識\n    slug: basics\ntags:\n  - name: Lightning Network\n    slug: lightning-network\n  - name: Bitcoin\n    slug: bitcoin'
      ),
    },
    (dir) => {
      const [post] = loadPublishedPosts(dir)
      assert.equal(post.author?.slug, 'yutaro')
      assert.deepEqual(post.categories, [{ name: '基礎知識', slug: 'basics' }])
      assert.deepEqual(post.tags, [
        { name: 'Lightning Network', slug: 'lightning-network' },
        { name: 'Bitcoin', slug: 'bitcoin' },
      ])
    }
  )
})

test('invalid metadata fails with the file name, even for a draft', () => {
  for (const metadata of [
    'draft: "false"',
    'author: unknown',
    'unexpected: true',
    'image: javascript:alert(1)',
    'updated: "2025-01-01"',
  ]) {
    withPosts({ 'broken.md': article(metadata) }, (dir) =>
      assert.throws(() => loadPublishedPosts(dir), /broken\.md/)
    )
  }
  withPosts({ 'broken.md': article().replace('2026-11-06', '2026-02-30') }, (dir) =>
    assert.throws(() => loadPublishedPosts(dir), /broken\.md/)
  )
})

test('invalid slugs, empty bodies and conflicting taxonomy URLs fail the build', () => {
  withPosts({ 'Bad Name.md': article() }, (dir) =>
    assert.throws(() => loadPublishedPosts(dir), /ファイル名/)
  )
  withPosts({ 'empty.md': article().split('---\n\n')[0] + '---\n' }, (dir) =>
    assert.throws(() => loadPublishedPosts(dir), /本文が空/)
  )
  withPosts(
    {
      'one.md': article('tags:\n  - name: Bitcoin\n    slug: bitcoin'),
      'two.md': article('tags:\n  - name: bitcoin\n    slug: bitcoin'),
    },
    (dir) => assert.throws(() => loadPublishedPosts(dir), /URLが重複/)
  )
})

test('JSON-LD preserves text while escaping closing script tags', () => {
  const value = { title: '</script><script>alert(1)</script>' }
  const json = serializeJsonLd(value)
  assert.ok(!json.includes('<'))
  assert.deepEqual(JSON.parse(json), value)
})
