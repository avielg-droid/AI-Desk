export interface GuideStep {
  title: string
  body: string
  code?: string
}

export interface GuideEntry {
  slug: string
  /** H1 / title: "Run Llama 3.1 on Mac Mini M4" */
  title: string
  /** Target query */
  targetQuery: string
  /** Short description for meta/card */
  description: string
  model: {
    name: string
    paramCount: string       // "8B", "13B", "70B"
    type: 'llm' | 'image' | 'multimodal'
    ollamaId?: string        // e.g. "llama3.1:8b"
    huggingFaceId?: string
  }
  /** Slug of related product from /content/products */
  productSlug: string
  /** Minimum VRAM / unified memory needed */
  minMemoryGb: number
  /** Expected tokens/s range */
  benchmarkTps?: string
  /** Expected image gen time */
  benchmarkImageSecs?: string
  softwareRequired: string[]
  steps: GuideStep[]
  tips: string[]
  relatedGuideSlugs: string[]
  relatedProductSlugs: string[]
  lastUpdated: string
}

export const GUIDE_ENTRIES: GuideEntry[] = [
  {
    slug: 'run-llama-3-on-mac-mini-m4',
    title: 'Run Llama 3.1 8B on Mac Mini M4',
    targetQuery: 'run llama 3 on mac mini m4',
    description: 'Step-by-step guide to running Llama 3.1 8B locally on the Apple Mac Mini M4 using Ollama — no GPU required.',
    model: {
      name: 'Llama 3.1 8B',
      paramCount: '8B',
      type: 'llm',
      ollamaId: 'llama3.1:8b',
    },
    productSlug: 'apple-mac-mini-m4',
    minMemoryGb: 8,
    benchmarkTps: '28–35 tok/s',
    softwareRequired: ['Ollama', 'macOS 14+'],
    steps: [
      {
        title: 'Install Ollama',
        body: 'Download Ollama from the official site and run the macOS installer. It installs a background service that handles model downloads and inference.',
        code: '# Verify install\nollama --version',
      },
      {
        title: 'Pull Llama 3.1 8B',
        body: 'The 8B model fits comfortably in the M4\'s 16 GB unified memory. The download is about 4.7 GB.',
        code: 'ollama pull llama3.1:8b',
      },
      {
        title: 'Run a test prompt',
        body: 'Start an interactive session and test the model. You should see the first token within 1–2 seconds.',
        code: 'ollama run llama3.1:8b "Explain VRAM in one paragraph"',
      },
      {
        title: 'Serve via REST API (optional)',
        body: 'Ollama exposes an OpenAI-compatible API on port 11434, so any app that supports custom endpoints (Open WebUI, Chatbox, etc.) works out of the box.',
        code: '# Start server (already running after install)\ncurl http://localhost:11434/api/generate \\\n  -d \'{"model":"llama3.1:8b","prompt":"Hello"}\'',
      },
      {
        title: 'Install Open WebUI for a chat interface',
        body: 'For a browser-based ChatGPT-style interface, run Open WebUI via Docker. It auto-discovers your local Ollama instance.',
        code: 'docker run -d \\\n  -p 3000:8080 \\\n  --add-host=host.docker.internal:host-gateway \\\n  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \\\n  ghcr.io/open-webui/open-webui:main',
      },
    ],
    tips: [
      'The M4\'s 16 GB unified memory can hold Llama 3.1 8B and the OS simultaneously — you rarely need to evict the model.',
      'For faster responses, close memory-heavy apps (browsers, creative tools) before a long inference session.',
      'Llama 3.1 8B Q4_K_M quantization (Ollama\'s default) gives near-full quality at 4× lower memory than FP16.',
      'The M4 Neural Engine offloads some compute — Ollama uses Metal, not the Neural Engine, for better compatibility.',
    ],
    relatedGuideSlugs: [
      'run-llama-3-on-mac-mini-m4-pro',
      'run-stable-diffusion-on-mac-mini-m4',
    ],
    relatedProductSlugs: ['apple-mac-mini-m4', 'apple-mac-mini-m4-pro'],
    lastUpdated: '2026-04-21',
  },

  {
    slug: 'run-llama-3-on-mac-mini-m4-pro',
    title: 'Run Llama 3.3 70B on Mac Mini M4 Pro',
    targetQuery: 'run llama 70b on mac mini m4 pro',
    description: 'Complete guide to running Llama 3.3 70B (Q4) locally on the Mac Mini M4 Pro with 24 GB unified memory using Ollama.',
    model: {
      name: 'Llama 3.3 70B',
      paramCount: '70B',
      type: 'llm',
      ollamaId: 'llama3.3:70b',
    },
    productSlug: 'apple-mac-mini-m4-pro',
    minMemoryGb: 24,
    benchmarkTps: '8–12 tok/s',
    softwareRequired: ['Ollama', 'macOS 14+'],
    steps: [
      {
        title: 'Install Ollama',
        body: 'Download and install Ollama for macOS. The installer creates a menu-bar icon and background inference server.',
        code: 'ollama --version',
      },
      {
        title: 'Pull Llama 3.3 70B',
        body: 'The Q4_K_M quantized model is about 40 GB. With 24 GB unified memory the model is partially offloaded to system RAM — performance is still excellent versus a pure CPU machine.',
        code: 'ollama pull llama3.3:70b',
      },
      {
        title: 'Verify GPU layers',
        body: 'Check that Ollama is loading layers onto the Metal GPU rather than running pure CPU.',
        code: 'ollama run llama3.3:70b "" --verbose 2>&1 | grep "gpu layers"',
      },
      {
        title: 'Run your first prompt',
        body: 'Start inference. Expect 8–12 tokens/s — comparable to a single RTX 4090 at this parameter count.',
        code: 'ollama run llama3.3:70b "Write a haiku about silicon"',
      },
      {
        title: 'Point any OpenAI-compatible app at Ollama',
        body: 'Use base URL http://localhost:11434/v1 and any model name. No API key required.',
        code: 'export OPENAI_BASE_URL=http://localhost:11434/v1\nexport OPENAI_API_KEY=ollama',
      },
    ],
    tips: [
      'The M4 Pro\'s 273 GB/s memory bandwidth is why 70B is viable — bandwidth matters more than raw FLOPS for LLM inference.',
      'If you hit memory pressure, close Safari and other heavy apps; macOS will reclaim RAM for Ollama automatically.',
      'Llama 3.3 70B outperforms Llama 3.1 405B on many benchmarks — the 70B sweet spot is real.',
      'Set `OLLAMA_NUM_PARALLEL=1` to dedicate all memory to one request for maximum single-session speed.',
    ],
    relatedGuideSlugs: [
      'run-llama-3-on-mac-mini-m4',
      'run-stable-diffusion-on-mac-mini-m4',
    ],
    relatedProductSlugs: ['apple-mac-mini-m4-pro', 'apple-mac-mini-m4'],
    lastUpdated: '2026-04-21',
  },

  {
    slug: 'run-stable-diffusion-on-mac-mini-m4',
    title: 'Run Stable Diffusion on Mac Mini M4',
    targetQuery: 'stable diffusion mac mini m4',
    description: 'How to run SDXL and FLUX on the Mac Mini M4 using Diffusers or ComfyUI — with expected generation times and optimization tips.',
    model: {
      name: 'SDXL / FLUX.1',
      paramCount: '3.5B',
      type: 'image',
    },
    productSlug: 'apple-mac-mini-m4',
    minMemoryGb: 16,
    benchmarkImageSecs: '18–25s per 1024×1024 (SDXL)',
    softwareRequired: ['Python 3.11', 'ComfyUI', 'pytorch-nightly (MPS)'],
    steps: [
      {
        title: 'Install ComfyUI',
        body: 'ComfyUI has the best Apple Silicon support in the image-gen ecosystem. Clone it and install dependencies.',
        code: 'git clone https://github.com/comfyanonymous/ComfyUI\ncd ComfyUI\npip install -r requirements.txt',
      },
      {
        title: 'Download SDXL base model',
        body: 'Place the model checkpoint in ComfyUI\'s models/checkpoints directory. Use the fp16 variant to fit in 16 GB.',
        code: '# ~6.5 GB download\ncd models/checkpoints\nwget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0_0.9vae.safetensors',
      },
      {
        title: 'Launch ComfyUI with MPS backend',
        body: 'The --force-fp16 flag prevents OOM on 16 GB systems running SDXL.',
        code: 'python main.py --force-fp16',
      },
      {
        title: 'Open the UI',
        body: 'Navigate to http://127.0.0.1:8188 and load a basic SDXL workflow. Queue a prompt to test generation speed.',
      },
      {
        title: 'Try FLUX.1 Schnell for faster generations',
        body: 'FLUX.1 Schnell generates in 4 steps vs SDXL\'s 20–30, cutting time to ~8–12s on M4. Download the fp8 variant.',
        code: '# ~8 GB\nhuggingface-cli download black-forest-labs/FLUX.1-schnell \\\n  --local-dir models/checkpoints/flux-schnell',
      },
    ],
    tips: [
      'Use fp16 precision — fp32 doubles VRAM usage with no perceptible quality gain on M-series.',
      'FLUX.1 Schnell (4-step) is 3–4× faster than SDXL on M4; use it for iteration, SDXL for final renders.',
      'Keep image size at 1024×1024 or below on 16 GB to avoid system RAM spillover.',
      'ComfyUI\'s MPS backend is more stable than the A1111 WebUI for Apple Silicon in 2026.',
    ],
    relatedGuideSlugs: [
      'run-llama-3-on-mac-mini-m4',
      'run-stable-diffusion-on-rtx-5070',
    ],
    relatedProductSlugs: ['apple-mac-mini-m4', 'apple-mac-mini-m4-pro'],
    lastUpdated: '2026-04-21',
  },

  {
    slug: 'run-stable-diffusion-on-rtx-5070',
    title: 'Run SDXL and FLUX on RTX 5070',
    targetQuery: 'stable diffusion rtx 5070',
    description: 'How to run SDXL and FLUX.1 on the NVIDIA RTX 5070 with 12 GB GDDR7 — setup, benchmarks, and VRAM optimization tips.',
    model: {
      name: 'SDXL / FLUX.1',
      paramCount: '3.5B',
      type: 'image',
    },
    productSlug: 'gigabyte-rtx-5070-windforce',
    minMemoryGb: 8,
    benchmarkImageSecs: '3–5s per 1024×1024 (SDXL)',
    softwareRequired: ['Python 3.11', 'CUDA 12.4', 'ComfyUI'],
    steps: [
      {
        title: 'Install CUDA 12.4 and drivers',
        body: 'RTX 5070 requires driver ≥ 565 and CUDA 12.4. Use the NVIDIA installer — do not install via apt directly on Windows.',
        code: '# Verify on Linux\nnvidia-smi\nnvcc --version',
      },
      {
        title: 'Install ComfyUI',
        body: 'ComfyUI is the recommended front-end for SDXL and FLUX — better memory management than A1111 for high-res generation.',
        code: 'git clone https://github.com/comfyanonymous/ComfyUI\ncd ComfyUI\npip install -r requirements.txt',
      },
      {
        title: 'Download SDXL checkpoint',
        body: 'The fp16 base model is ~6.5 GB — well within the RTX 5070\'s 12 GB VRAM.',
        code: 'cd models/checkpoints\nwget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0_0.9vae.safetensors',
      },
      {
        title: 'Launch ComfyUI',
        body: 'Start the server and open the browser UI. The RTX 5070 will appear in GPU selection automatically.',
        code: 'python main.py --gpu-only',
      },
      {
        title: 'Run FLUX.1 Dev for maximum quality',
        body: 'The RTX 5070\'s 12 GB VRAM fits FLUX.1 Dev in fp8 quantization. Expect ~6–8s for 1024×1024.',
        code: '# ~8 GB fp8 checkpoint\nhuggingface-cli download black-forest-labs/FLUX.1-dev \\\n  --local-dir models/checkpoints/flux-dev',
      },
    ],
    tips: [
      'Enable --bf16-unet in ComfyUI if you see NaN artifacts — RTX 5000 series prefers bf16 over fp16 for FLUX.',
      '12 GB VRAM fits SDXL + refiner in a single pass with --medvram; use --highvram for batched generation.',
      'FLUX.1 Dev produces noticeably better text rendering than SDXL — worth the 2× extra generation time.',
      'PyTorch 2.6+ includes Blackwell-optimized CUDA kernels — always use the latest nightly for RTX 50-series.',
    ],
    relatedGuideSlugs: [
      'run-llama-3-on-rtx-5070',
      'run-stable-diffusion-on-mac-mini-m4',
    ],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'asus-rtx-5070-sff'],
    lastUpdated: '2026-04-21',
  },

  {
    slug: 'run-llama-3-on-rtx-5070',
    title: 'Run Llama 3.1 70B on RTX 5070',
    targetQuery: 'run llama 70b rtx 5070',
    description: 'How to run Llama 3.1 70B (Q4) on an RTX 5070 12 GB using Ollama — includes VRAM limits, layer offload settings, and expected speed.',
    model: {
      name: 'Llama 3.1 70B (Q4)',
      paramCount: '70B',
      type: 'llm',
      ollamaId: 'llama3.1:70b',
    },
    productSlug: 'gigabyte-rtx-5070-windforce',
    minMemoryGb: 12,
    benchmarkTps: '12–18 tok/s (with CPU offload)',
    softwareRequired: ['Ollama', 'CUDA 12.4', 'NVIDIA Driver 565+'],
    steps: [
      {
        title: 'Install Ollama for Windows/Linux',
        body: 'Download the Ollama installer for your OS. On Linux, the one-liner script handles driver detection automatically.',
        code: '# Linux\ncurl -fsSL https://ollama.com/install.sh | sh\n\n# Verify\nollama --version',
      },
      {
        title: 'Pull Llama 3.1 70B',
        body: 'The Q4_K_M quantized model is ~40 GB. Only ~12 GB fits on the GPU — the rest offloads to CPU RAM. You need ≥ 64 GB system RAM for full offload.',
        code: 'ollama pull llama3.1:70b',
      },
      {
        title: 'Set GPU layer count',
        body: 'With 12 GB VRAM, you can fit roughly 25–30 of the 80 transformer layers on GPU. Remaining layers run on CPU. Ollama handles this automatically but you can tune with the num_gpu flag.',
        code: 'OLLAMA_NUM_GPU=30 ollama run llama3.1:70b "Test prompt"',
      },
      {
        title: 'Run via REST API',
        body: 'The OpenAI-compatible API works for all downstream apps.',
        code: 'curl http://localhost:11434/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -d \'{"model":"llama3.1:70b","messages":[{"role":"user","content":"Hello"}]}\'',
      },
    ],
    tips: [
      '12 GB VRAM + 64 GB system RAM gives 12–18 tok/s — faster than a CPU-only setup by 4–6×.',
      'For 70B at full GPU speed, pair two RTX 5070s or upgrade to an RTX 5090 (32 GB).',
      'Llama 3.1 8B fits entirely in 12 GB VRAM and runs at 55–70 tok/s — use it for latency-sensitive tasks.',
      'Use `ollama ps` to see active models and their VRAM allocation.',
    ],
    relatedGuideSlugs: [
      'run-stable-diffusion-on-rtx-5070',
      'run-llama-3-on-mac-mini-m4-pro',
    ],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'asus-rtx-5070-sff'],
    lastUpdated: '2026-04-21',
  },

  {
    slug: 'run-ollama-on-mini-pc',
    title: 'Run Ollama on a Mini PC (Intel/AMD)',
    targetQuery: 'run ollama on mini pc',
    description: 'How to run local LLMs with Ollama on an Intel or AMD mini PC — best models for 16 GB RAM, performance expectations, and optimization.',
    model: {
      name: 'Llama 3.2 3B / Phi-4',
      paramCount: '3B–14B',
      type: 'llm',
      ollamaId: 'llama3.2:3b',
    },
    productSlug: 'gmktec-nucbox-m5-pro',
    minMemoryGb: 16,
    benchmarkTps: '4–12 tok/s (CPU)',
    softwareRequired: ['Ollama', 'Linux or Windows 11'],
    steps: [
      {
        title: 'Install Ollama',
        body: 'Mini PCs without discrete GPUs run Ollama in CPU-only mode. Ollama detects this automatically and uses AVX2/AVX-512 SIMD where available.',
        code: '# Linux\ncurl -fsSL https://ollama.com/install.sh | sh',
      },
      {
        title: 'Choose a model that fits in RAM',
        body: 'Rule of thumb: model file size ≤ 60% of total RAM to leave headroom for OS and apps. On 16 GB, stick to Q4 models ≤ 8 GB (7B–8B parameter models).',
        code: '# Best options for 16 GB mini PC:\nollama pull llama3.2:3b     # 2.0 GB — fastest\nollama pull phi4             # 9.1 GB — best quality\nollama pull llama3.1:8b     # 4.7 GB — balanced',
      },
      {
        title: 'Set thread count',
        body: 'CPU inference benefits from pinning threads to performance cores. Set OLLAMA_NUM_THREAD to your P-core count.',
        code: '# Example: 8 P-cores\nexport OLLAMA_NUM_THREAD=8\nollama run llama3.2:3b',
      },
      {
        title: 'Install Open WebUI',
        body: 'Add a browser-based UI for a full chat experience.',
        code: 'docker run -d -p 3000:8080 \\\n  --add-host=host.docker.internal:host-gateway \\\n  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \\\n  ghcr.io/open-webui/open-webui:main',
      },
    ],
    tips: [
      'Mini PCs with Intel Core Ultra (Meteor Lake+) have integrated NPUs but Ollama does not use them — stick to CPU/GPU.',
      'Phi-4 14B Q4 at 9 GB outperforms Llama 3.1 8B on reasoning tasks despite the similar file size.',
      'RAM speed matters on mini PCs — DDR5-5600 gives ~30% more bandwidth than DDR4-3200, translating to faster tok/s.',
      'For always-on home assistant use, configure Ollama as a systemd service so it survives reboots.',
    ],
    relatedGuideSlugs: [
      'run-llama-3-on-mac-mini-m4',
      'run-llama-3-on-rtx-5070',
    ],
    relatedProductSlugs: ['gmktec-nucbox-m5-pro', 'kamrui-hyper-h2', 'geekom-it12'],
    lastUpdated: '2026-04-21',
  },

  {
    slug: 'run-stable-diffusion-on-rx-9060-xt',
    title: 'Run Stable Diffusion on RX 9060 XT (ROCm)',
    targetQuery: 'stable diffusion amd rx 9060 xt rocm',
    description: 'Complete guide to running SDXL and FLUX on the AMD RX 9060 XT 16 GB using ROCm and ComfyUI on Linux.',
    model: {
      name: 'SDXL / FLUX.1',
      paramCount: '3.5B',
      type: 'image',
    },
    productSlug: 'gigabyte-rx-9060-xt-gaming',
    minMemoryGb: 8,
    benchmarkImageSecs: '6–9s per 1024×1024 (SDXL)',
    softwareRequired: ['ROCm 6.3+', 'Ubuntu 22.04', 'Python 3.11', 'ComfyUI'],
    steps: [
      {
        title: 'Install ROCm 6.3',
        body: 'ROCm 6.3+ is required for RDNA 4 (RX 9060 XT) support. The AMDGPU-install script handles kernel modules and libraries.',
        code: 'wget https://repo.radeon.com/amdgpu-install/6.3/ubuntu/jammy/amdgpu-install_6.3.60300-1_all.deb\nsudo dpkg -i amdgpu-install_6.3.60300-1_all.deb\nsudo amdgpu-install --usecase=rocm\n\n# Verify\nrocm-smi',
      },
      {
        title: 'Install PyTorch with ROCm support',
        body: 'Use the ROCm-specific PyTorch wheel — the standard PyPI build does not include ROCm.',
        code: 'pip install torch torchvision torchaudio \\\n  --index-url https://download.pytorch.org/whl/rocm6.3',
      },
      {
        title: 'Install ComfyUI',
        body: 'Clone ComfyUI and install requirements. The ROCm PyTorch you installed will be detected automatically.',
        code: 'git clone https://github.com/comfyanonymous/ComfyUI\ncd ComfyUI && pip install -r requirements.txt',
      },
      {
        title: 'Set HSA override for RDNA 4',
        body: 'RDNA 4 may need a GPU target override until ROCm fully formalizes RDNA 4 support.',
        code: 'export HSA_OVERRIDE_GFX_VERSION=11.0.0\npython main.py --gpu-only',
      },
      {
        title: 'Download and run SDXL',
        body: '16 GB VRAM fits SDXL + refiner in a single pass. Expect 6–9s per 1024×1024 image.',
        code: 'cd models/checkpoints\nwget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0_0.9vae.safetensors',
      },
    ],
    tips: [
      'ROCm performance on RDNA 4 improves with each release — update ROCm before troubleshooting slow generation.',
      '16 GB VRAM means you can run FLUX.1 Dev at full fp16 precision, unlike 8–12 GB cards that need fp8.',
      'The HSA_OVERRIDE_GFX_VERSION workaround may not be needed once ROCm 6.4 ships with native RDNA 4 support.',
      'ollama also supports ROCm on Linux — for LLM use, install with the same ROCm stack.',
    ],
    relatedGuideSlugs: [
      'run-stable-diffusion-on-rtx-5070',
      'run-ollama-on-mini-pc',
    ],
    relatedProductSlugs: ['gigabyte-rx-9060-xt-gaming'],
    lastUpdated: '2026-04-21',
  },

  {
    slug: 'run-deepseek-r1-locally',
    title: 'Run DeepSeek R1 Locally with Ollama',
    targetQuery: 'run deepseek r1 locally',
    description: 'How to run DeepSeek R1 (8B and 70B) locally on your own hardware using Ollama — hardware requirements, speed expectations, and tips.',
    model: {
      name: 'DeepSeek R1',
      paramCount: '8B / 70B',
      type: 'llm',
      ollamaId: 'deepseek-r1:8b',
    },
    productSlug: 'apple-mac-mini-m4-pro',
    minMemoryGb: 8,
    benchmarkTps: '20–28 tok/s (8B on M4 Pro)',
    softwareRequired: ['Ollama'],
    steps: [
      {
        title: 'Install Ollama',
        body: 'Ollama supports DeepSeek R1 out of the box via its model registry. Install on macOS, Linux, or Windows.',
        code: 'ollama --version',
      },
      {
        title: 'Pull DeepSeek R1',
        body: 'Choose the size that fits your hardware. The 8B model needs ~5 GB VRAM; the 70B needs ~40 GB (GPU + RAM offload).',
        code: '# 8B — best for 8–16 GB systems\nollama pull deepseek-r1:8b\n\n# 70B — best for 24 GB+ unified or multi-GPU\nollama pull deepseek-r1:70b',
      },
      {
        title: 'Run with extended context',
        body: 'DeepSeek R1 uses chain-of-thought reasoning that produces long outputs. Increase context window for complex tasks.',
        code: 'ollama run deepseek-r1:8b --context 16384 "Solve: if x² + 2x - 8 = 0, find x"',
      },
      {
        title: 'Use the thinking tags',
        body: 'DeepSeek R1\'s outputs include <think> blocks showing the reasoning chain. These are normal — the final answer follows after.',
      },
    ],
    tips: [
      'DeepSeek R1 8B rivals GPT-4o on many reasoning benchmarks — it\'s the best local reasoning model at this size.',
      'The <think> reasoning tokens count toward your context window — increase it for complex multi-step problems.',
      'On Apple Silicon, R1 8B runs at ~20–28 tok/s; on RTX 5070, expect ~55–65 tok/s for the 8B variant.',
      'R1 70B requires GPU offload on most consumer hardware — ensure ≥ 64 GB system RAM alongside your GPU.',
    ],
    relatedGuideSlugs: [
      'run-llama-3-on-mac-mini-m4-pro',
      'run-llama-3-on-rtx-5070',
    ],
    relatedProductSlugs: ['apple-mac-mini-m4-pro', 'gigabyte-rtx-5070-windforce'],
    lastUpdated: '2026-04-21',
  },
]

export function getAllGuides(): GuideEntry[] {
  return GUIDE_ENTRIES
}

export function getGuideBySlug(slug: string): GuideEntry | null {
  return GUIDE_ENTRIES.find(g => g.slug === slug) ?? null
}

export function getAllGuideSlugs(): string[] {
  return GUIDE_ENTRIES.map(g => g.slug)
}

export function getGuidesByModel(type: GuideEntry['model']['type']): GuideEntry[] {
  return GUIDE_ENTRIES.filter(g => g.model.type === type)
}
