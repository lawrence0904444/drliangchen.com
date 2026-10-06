import type { APIContext } from 'astro';
import { feed } from '../feed';

export const GET = (context: APIContext) => feed(context, 'zh');
