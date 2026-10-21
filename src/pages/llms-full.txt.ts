import type { APIRoute } from 'astro'
import { llmsFullText } from '../lib/markdown'

export const GET: APIRoute = async () => new Response(await llmsFullText())
