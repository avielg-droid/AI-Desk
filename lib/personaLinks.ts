/**
 * Maps product slugs to the persona pages they appear in.
 * Used to add "See Best For" internal links from product pages.
 */
export const PRODUCT_PERSONA_MAP: Record<string, { slug: string; title: string }[]> = {
  'gigabyte-rtx-5070-windforce': [
    { slug: 'gpu-for-stable-diffusion', title: 'Best GPUs for Stable Diffusion' },
    { slug: 'gpu-for-local-llm', title: 'Best GPUs for Local LLMs' },
    { slug: 'gpu-for-comfyui', title: 'Best GPUs for ComfyUI' },
  ],
  'asus-rtx-5070-sff': [
    { slug: 'gpu-for-stable-diffusion', title: 'Best GPUs for Stable Diffusion' },
    { slug: 'gpu-for-local-llm', title: 'Best GPUs for Local LLMs' },
    { slug: 'gpu-for-comfyui', title: 'Best GPUs for ComfyUI' },
  ],
  'gigabyte-rx-9060-xt-gaming': [
    { slug: 'gpu-for-stable-diffusion', title: 'Best GPUs for Stable Diffusion' },
    { slug: 'gpu-for-local-llm', title: 'Best GPUs for Local LLMs' },
    { slug: 'gpu-for-comfyui', title: 'Best GPUs for ComfyUI' },
    { slug: 'budget-ai-hardware', title: 'Best Budget Hardware for Local AI' },
  ],
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
