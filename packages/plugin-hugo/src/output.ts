import { OutputPlugin } from '@mark-magic/core'
import path from 'pathe'
import * as local from '@mark-magic/plugin-local'

interface HugoPostMeta {
  title: string
  slug: string
  tags: string[]
  date: string
  author?: string
  draft?: boolean
  hasMath?: boolean
  [key: string]: any // allow extra keys
}

export function output(options?: { root?: string; base?: string }): OutputPlugin {
  const root = options?.root ?? path.resolve()
  const postsPath = path.resolve(root, 'content/posts')
  const resourcePath = path.resolve(root, 'content/resources')
  const baseUrl = options?.base ?? '/'
  const p = local.output({
    path: postsPath,
    meta: (note) =>
      ({
        title: note.name,
        slug: note.slug || note.id,
        tags: note.extra.tags || [],
        date: new Date(note.created).toISOString(),

        // Add these to match Tufte theme frontmatter requirements:
        author: note.extra.author || 'Meenal Jhajharia',  // or pull dynamically if possible
        draft: note.extra.draft ?? false,
        hasMath: note.extra.hasMath ?? true,

        // Add anything else Tufte theme requires here
      } as HugoPostMeta),
    contentLink: (it) => path.join('/', baseUrl, `/posts/${it.linkContentId}`),
    resourceLink: (it) => path.join('/', baseUrl, `/resources/${it.resource.id}${path.extname(it.resource.name)}`),
    contentPath: (it) => path.resolve(postsPath, it.id + '.md'),
    resourcePath: (it) => path.resolve(resourcePath, it.id + path.extname(it.name)),
  })
  p.name = 'hugo'
  return p
}
