import type { APIRoute } from 'astro'
import { en } from '../content/en'
import { pageMarkdown } from '../lib/markdown'

export const GET: APIRoute = async () =>
  new Response(await pageMarkdown(en), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
