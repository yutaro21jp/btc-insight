import { loadPublishedPosts } from '../lib/posts'

const posts = loadPublishedPosts()
console.log(`記事の検証が完了しました。公開対象: ${posts.length}件`)
