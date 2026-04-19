/**
 * Maps product slugs to the persona pages they appear in.
 * Used to add "See Best For" internal links from product pages.
 */
export const PRODUCT_PERSONA_MAP: Record<string, { slug: string; title: string }[]> = {
  'nvidia-rtx-4090': [
    { slug: 'gpu-for-stable-diffusion', title: 'Best GPUs for Stable Diffusion' },
    { slug: 'gpu-for-local-llm', title: 'Best GPUs for Local LLMs' },
    { slug: 'gpu-for-comfyui', title: 'Best GPUs for ComfyUI' },
    { slug: 'hardware-for-llama-3-70b', title: 'Best Hardware for Llama 3 70B' },
  ],
  'nvidia-rtx-4070-super': [
    { slug: 'gpu-for-stable-diffusion', title: 'Best GPUs for Stable Diffusion' },
    { slug: 'gpu-for-local-llm', title: 'Best GPUs for Local LLMs' },
    { slug: 'gpu-for-comfyui', title: 'Best GPUs for ComfyUI' },
  ],
  'amd-radeon-rx-7900-xtx': [
    { slug: 'gpu-for-stable-diffusion', title: 'Best GPUs for Stable Diffusion' },
    { slug: 'gpu-for-local-llm', title: 'Best GPUs for Local LLMs' },
    { slug: 'gpu-for-comfyui', title: 'Best GPUs for ComfyUI' },
    { slug: 'hardware-for-llama-3-70b', title: 'Best Hardware for Llama 3 70B' },
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
  'beelink-sei14': [
    { slug: 'mini-pc-for-ollama', title: 'Best Mini PCs for Ollama' },
    { slug: 'budget-ai-hardware', title: 'Best Budget Hardware for Local AI' },
  ],
}
