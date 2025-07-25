import { beforeAll, describe, expect, it } from 'vitest'
import { calcTitle, convertContentLink, input } from '../input'
import { fromAsync } from '@mark-magic/utils'
import { flatMap, last } from 'lodash-es'
import { convert } from '@mark-magic/core'
import { fromMarkdown, select } from '@liuli-util/markdown-util'
import { joplinDataApi } from 'joplin-api'
import * as local from '@mark-magic/plugin-local'
import { initTempPath } from '@liuli-util/test'

it('calcTitle', () => {
  expect(calcTitle({ id: '1', title: 'test.png', file_extension: 'png', mime: 'image/png' })).eq('test.png')
  expect(calcTitle({ id: '1', title: 'test', file_extension: 'png', mime: 'image/png' })).eq('test.png')
  expect(calcTitle({ id: '1', title: 'test', file_extension: '', mime: 'image/png' })).eq('test.png')
  expect(calcTitle({ id: '1', title: '', file_extension: '', mime: 'image/png' })).eq('1.png')
  expect(calcTitle({ id: '1', title: '', file_extension: 'png', mime: '' })).eq('1.png')
})

it('internal link for note and resource', async () => {
  const r = convertContentLink(`[test](:/test) ![image](:/image) [github](https://github.com)`, ['image'])
  expect(r.trim()).eq('[test](:/content/test) ![image](:/resource/image) [github](https://github.com)')
})

let api: ReturnType<typeof joplinDataApi>
describe.skip('input', () => {
  const tempPath = initTempPath(__filename)
  beforeAll(() => {
    api = joplinDataApi({
      token: import.meta.env.VITE_JOPLIN_TOKEN,
      baseUrl: import.meta.env.VITE_JOPLIN_BASE_URL,
      type: 'rest',
    })
  })
  it('convert to local', async () => {
    await convert({
      input: input({
        baseUrl: import.meta.env.VITE_JOPLIN_BASE_URL,
        token: import.meta.env.VITE_JOPLIN_TOKEN,
        tag: 'blog',
      }),
      output: local.output({
        path: tempPath,
      }),
    })
  }, 10000)

  it('Should include extra tags', async () => {
    const list = await fromAsync(
      input({
        baseUrl: import.meta.env.VITE_JOPLIN_BASE_URL,
        token: import.meta.env.VITE_JOPLIN_TOKEN,
        tag: 'blog',
      }).generate(),
    )
    expect(list).not.empty
    expect(flatMap(list, 'extra.tags')).not.include('blog')
  })
  it('Should path is include file name', async () => {
    const list = await fromAsync(
      input({
        baseUrl: import.meta.env.VITE_JOPLIN_BASE_URL,
        token: import.meta.env.VITE_JOPLIN_TOKEN,
        tag: 'blog',
      }).generate(),
    )
    list.forEach((it) => expect(last(it.path)!.endsWith('.md')).true)
  })

  describe('Should content include title set context', () => {
    beforeAll(async () => {
      if ((await api.search.search({ query: 'test title in plugin-joplin tag:blog' })).items.length > 0) {
        return
      }
      const createNoteId = (
        await api.note.create({
          title: 'test title in plugin-joplin',
          body: 'test body',
        })
      ).id
      const blogTagId = (await api.tag.list()).items.find((it) => it.title === 'blog')!.id
      await api.tag.addTagByNoteId(blogTagId, createNoteId)
    })
    it('Should content include title', async () => {
      const list = await fromAsync(
        input({
          baseUrl: import.meta.env.VITE_JOPLIN_BASE_URL,
          token: import.meta.env.VITE_JOPLIN_TOKEN,
          tag: 'blog',
        }).generate(),
      )
      list.forEach((it) => expect(!!select('heading[depth="1"]', fromMarkdown(it.content))).true)
    })
  })

  describe('Error handle', () => {
    it('Should throw error when baseUrl is invalid', async () => {
      await expect(
        fromAsync(
          input({
            baseUrl: 'http://localhost:2000',
            token: import.meta.env.VITE_JOPLIN_TOKEN,
            tag: 'blog',
          }).generate(),
        ),
      ).rejects.toThrowError('Failed to connect to Joplin')
    })
    it('Should throw error when token is invalid', async () => {
      await expect(
        fromAsync(
          input({
            baseUrl: import.meta.env.VITE_JOPLIN_BASE_URL,
            token: 'invalid token',
            tag: 'blog',
          }).generate(),
        ),
      ).rejects.toThrowError('The token is invalid')
    })
  })
})

describe('Should convert html img src to resource link', () => {
  it('Should convert html img src to resource link', async () => {
    const html = `<img src=":/a" />`
    const r = convertContentLink(html, ['a'])
    expect(r.trim()).eq(`<img src=":/resource/a">`)
  })
  it('Should convert html multiple img src to resource link', async () => {
    const html = `<img src=":/a" />\n<img src=":/b" />`
    const r = convertContentLink(html, ['a', 'b'])
    expect(r.trim()).eq(`<img src=":/resource/a">\n<img src=":/resource/b">`)
  })
})
