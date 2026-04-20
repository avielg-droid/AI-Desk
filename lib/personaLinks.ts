/**
 * Maps product slugs to the persona pages they appear in.
 * Used to add "See Best For" internal links from product pages.
 */
export const PRODUCT_PERSONA_MAP: Record<string, { slug: string; title: string }[]> = {
  'apple-mac-mini-m4-pro': [
    { slug: 'mini-pc-for-ollama', title: 'Best Mini PCs for Ollama' },
    { slug: 'hardware-for-llama-3-70b', title: 'Best Hardware for Llama 3 70B' },
  ],
  'apple-mac-mini-m4': [
    { slug: 'mini-pc-for-ollama', title: 'Best Mini PCs for Ollama' },
    { slug: 'budget-ai-hardware', title: 'Best Budget Hardware for Local AI' },
  ],
  'gmktec-nucbox-m5-pro': [
    { slug: 'mini-pc-for-ollama', title: 'Best Mini PCs for Ollama' },
    { slug: 'budget-ai-hardware', title: 'Best Budget Hardware for Local AI' },
  ],
  'geekom-it12': [
    { slug: 'mini-pc-for-ollama', title: 'Best Mini PCs for Ollama' },
    { slug: 'budget-ai-hardware', title: 'Best Budget Hardware for Local AI' },
  ],
  'kamrui-hyper-h2': [
    { slug: 'mini-pc-for-ollama', title: 'Best Mini PCs for Ollama' },
    { slug: 'budget-ai-hardware', title: 'Best Budget Hardware for Local AI' },
  ],
  'kamrui-pinova-p1': [
    { slug: 'mini-pc-for-ollama', title: 'Best Mini PCs for Ollama' },
    { slug: 'budget-ai-hardware', title: 'Best Budget Hardware for Local AI' },
  ],
  'kamrui-pinova-p2': [
    { slug: 'mini-pc-for-ollama', title: 'Best Mini PCs for Ollama' },
    { slug: 'budget-ai-hardware', title: 'Best Budget Hardware for Local AI' },
  ],
}
