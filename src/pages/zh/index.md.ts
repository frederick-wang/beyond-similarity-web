import type { APIRoute } from 'astro'
import { zh } from '../../content/zh'
import { pageMarkdown } from '../../lib/markdown'

export const GET: APIRoute = async () => new Response(await pageMarkdown(zh))
