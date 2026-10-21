import type { APIRoute } from 'astro'
import { llmsText } from '../lib/markdown'

export const GET: APIRoute = () => new Response(llmsText())
