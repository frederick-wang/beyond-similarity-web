import type { APIRoute } from 'astro'
import { absoluteUrl } from '../data/paper'

// Every crawler is admitted, those that collect model-training data included
// (docs/adr/0002-admit-all-crawlers.md).
export const GET: APIRoute = () => new Response(['User-agent: *', 'Allow: /', '', `Sitemap: ${absoluteUrl('/sitemap.xml')}`, ''].join('\n'))
