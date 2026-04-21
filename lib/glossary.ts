// ── Types ─────────────────────────────────────────────────────────────────────

export type GlossaryCategory = 'memory' | 'performance' | 'software' | 'hardware' | 'connectivity'

export interface GlossaryEntry {
  slug: string
  term: string
  category: GlossaryCategory
  shortDef: string          // used in spec table tooltips
  fullDef: string           // 2–3 sentences for glossary pages
  whyItMatters: string      // specific to local AI use cases
  relatedTermSlugs: string[]
  relatedProductSlugs: string[]
}

// ── Full entry data ───────────────────────────────────────────────────────────

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  // ── Memory ────────────────────────────────────────────────────────────────
  {
    slug: 'vram',
    term: 'VRAM',
    category: 'memory',
    shortDef: 'Video RAM — dedicated memory on a GPU. Determines the maximum model size you can run with full GPU acceleration. Once a model exceeds VRAM, it spills to system RAM over the slow PCIe bus.',
    fullDef: 'VRAM (Video RAM) is high-speed memory physically attached to a GPU die, operating at bandwidths up to 672 GB/s on the RTX 5070. Unlike system RAM, it shares a direct path to the GPU\'s compute cores, allowing the chip to load model weights at full speed. When a language model\'s weights exceed available VRAM, Ollama and llama.cpp automatically offload layers to system RAM — but those layers then travel over the PCIe bus at ~30–60 GB/s instead of hundreds, cutting tokens-per-second by 50–90%.',
    whyItMatters: 'A 7B model at Q4 quantization requires ~4 GB of VRAM. A 13B model needs ~8 GB, and a 70B model needs ~40 GB. If you want to run a 13B model with full GPU acceleration, 12 GB VRAM is the minimum — the RTX 5070 sits right at that threshold.',
    relatedTermSlugs: ['unified-memory', 'quantization', 'memory-bandwidth', 'gddr7', 'pcie'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'asus-rtx-5070-sff', 'gigabyte-rx-9060-xt-gaming'],
  },
  {
    slug: 'unified-memory',
    term: 'Unified Memory',
    category: 'memory',
    shortDef: 'Apple Silicon uses a single pool of fast RAM shared between CPU and GPU. Larger unified memory = larger models run entirely at full bandwidth — no PCIe bottleneck.',
    fullDef: 'Apple\'s unified memory architecture places CPU, GPU, and Neural Engine on the same die with a shared high-bandwidth memory pool. On the M4 Pro, this pool runs at 273 GB/s — slower than an RTX 5070\'s GDDR7 but dramatically faster than any discrete GPU\'s PCIe bus overflow path. The critical advantage is capacity: a Mac Mini M4 Pro with 48 GB unified memory can fully accelerate a 70B parameter model at Q4, something no consumer GPU under $1,000 can do.',
    whyItMatters: 'For running 70B models, unified memory Macs are currently the only sub-$2,000 option. A 16 GB M4 Mac Mini tops out at 13B models. The 24 GB M4 Pro comfortably runs 13B models and barely fits some 32B at Q4. The 48 GB M4 Pro config is the practical ceiling for consumer local AI.',
    relatedTermSlugs: ['vram', 'memory-bandwidth', 'quantization', 'mlx'],
    relatedProductSlugs: ['apple-mac-mini-m4', 'apple-mac-mini-m4-pro'],
  },
  {
    slug: 'memory-bandwidth',
    term: 'Memory Bandwidth',
    category: 'memory',
    shortDef: 'How fast data moves between memory and the processor, measured in GB/s. Tokens per second scales nearly linearly with bandwidth — this is the single most important GPU spec for LLM speed.',
    fullDef: 'Memory bandwidth measures how many gigabytes of data can be moved between memory and compute cores per second. For LLM inference, every generated token requires reading the entire model\'s weights from memory at least once. A 7B model at Q4 weighs roughly 4 GB; generating one token therefore requires 4 GB of memory reads. At 672 GB/s (RTX 5070), that supports up to ~168 theoretical token-read cycles per second — which is why real-world benchmarks land around 118 t/s after overhead.',
    whyItMatters: 'Bandwidth is a better predictor of LLM speed than compute FLOPS. A mini PC with 68 GB/s LPDDR5 will always be 8–10× slower than an RTX 5070 at 672 GB/s for the same model, regardless of CPU capability. When comparing hardware, check bandwidth first.',
    relatedTermSlugs: ['vram', 'gddr7', 'gddr6', 'lpddr4', 'tokens-per-second'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'apple-mac-mini-m4-pro'],
  },
  {
    slug: 'gddr7',
    term: 'GDDR7',
    category: 'memory',
    shortDef: 'The latest generation of GPU memory (2024+). Significantly higher bandwidth than GDDR6X at the same capacity tier. Used in NVIDIA Blackwell cards (RTX 5070 series).',
    fullDef: 'GDDR7 is the memory standard used in NVIDIA\'s Blackwell generation GPUs, debuting with the RTX 5070 series in early 2025. It delivers up to 672 GB/s on a 192-bit bus — roughly 40% more bandwidth than the GDDR6X used in the RTX 4080 Super. The higher bandwidth directly translates to more tokens per second at the same VRAM capacity, making it a generational leap for LLM inference rather than just gaming.',
    whyItMatters: 'GDDR7 is the reason the RTX 5070 at $600 outperforms the RTX 4090 in tokens-per-second for models that fit in VRAM. If you\'re buying a GPU specifically for local AI in 2025–2026, GDDR7 hardware is the only segment worth considering.',
    relatedTermSlugs: ['vram', 'memory-bandwidth', 'gddr6', 'blackwell'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'asus-rtx-5070-sff'],
  },
  {
    slug: 'gddr6',
    term: 'GDDR6',
    category: 'memory',
    shortDef: 'Previous-generation GPU memory. Lower bandwidth than GDDR7, but paired with larger capacities (e.g., 16GB RX 9060 XT) can offer better model headroom despite lower token speed.',
    fullDef: 'GDDR6 is the memory standard used in AMD\'s RDNA 4 generation (RX 9060 XT) and previous NVIDIA cards. At ~512 GB/s on a 128-bit bus, it delivers roughly 24% less bandwidth than GDDR7 but supports larger VRAM capacities at a given price point — the RX 9060 XT ships with 16 GB compared to the RTX 5070\'s 12 GB. This capacity advantage is meaningful for users who prioritize model size over raw speed.',
    whyItMatters: 'If you want to run 13B models comfortably without quantization compromises, the RX 9060 XT\'s 16 GB GDDR6 gives more headroom than the RTX 5070\'s 12 GB GDDR7 — at the cost of roughly 30 fewer tokens per second.',
    relatedTermSlugs: ['vram', 'memory-bandwidth', 'gddr7', 'rdna-4'],
    relatedProductSlugs: ['gigabyte-rx-9060-xt-gaming'],
  },
  {
    slug: 'lpddr4',
    term: 'LPDDR4',
    category: 'memory',
    shortDef: 'Low-Power DDR4 — often soldered memory in mini PCs. Lower bandwidth than desktop DDR4 or DDR5. Limits tokens-per-second compared to high-end alternatives.',
    fullDef: 'LPDDR4 (Low-Power Double Data Rate 4) is a power-optimized RAM standard commonly soldered onto mini PC motherboards to reduce size and cost. It typically runs at 51–68 GB/s — about 10× less bandwidth than GDDR7. While sufficient for productivity workloads, this bandwidth ceiling means CPU-based LLM inference on LPDDR4 systems produces 6–10 tokens per second on 7B models, which feels sluggish for interactive chat.',
    whyItMatters: 'Budget mini PCs using LPDDR4 are best suited as always-on background AI servers rather than interactive chat machines. For tasks that tolerate latency — document summarization running overnight, automation scripts — the low power draw and cost make them compelling despite the speed penalty.',
    relatedTermSlugs: ['memory-bandwidth', 'unified-memory', 'tokens-per-second', 'cpu-inference'],
    relatedProductSlugs: ['kamrui-pinova-p1', 'kamrui-pinova-p2'],
  },

  // ── Performance ───────────────────────────────────────────────────────────
  {
    slug: 'quantization',
    term: 'Quantization',
    category: 'performance',
    shortDef: 'Compressing a model by reducing numeric precision. Q4 = 4-bit (smallest, fastest), Q8 = 8-bit (balanced), FP16 = full precision. Less bits = less VRAM required, slight quality reduction.',
    fullDef: 'Quantization converts a model\'s weights from 32-bit or 16-bit floating-point values to lower-precision integers. A 70B model in FP16 requires ~140 GB of VRAM — impossible on any consumer hardware. The same model at Q4 (4-bit integers) compresses to ~40 GB, fitting in a Mac Mini M4 Pro with 48 GB unified memory. The quality loss from Q4 vs FP16 is typically imperceptible in benchmarks for models above 13B, but more noticeable on smaller 7B models where every bit of precision matters.',
    whyItMatters: 'Q4_K_M is the current community standard for the best quality-per-GB ratio. If your hardware has 16 GB of memory, Q4 lets you run a 13B model; Q8 limits you to 7B. When downloading models from Hugging Face or Ollama, always check the quantization level in the filename (e.g., "Q4_K_M", "Q8_0").',
    relatedTermSlugs: ['vram', 'unified-memory', 'gguf', 'max-llm-size', 'ollama'],
    relatedProductSlugs: ['apple-mac-mini-m4-pro', 'gigabyte-rtx-5070-windforce'],
  },
  {
    slug: 'tokens-per-second',
    term: 'Tokens/s',
    category: 'performance',
    shortDef: 'Tokens per second — the standard speed metric for LLMs. One token ≈ 0.75 words. Above 10 t/s feels interactive; below 5 t/s feels like watching paint dry.',
    fullDef: 'Tokens per second (t/s) measures how quickly a model generates output. One token is roughly 0.75 words or 4 characters in English. A conversational exchange typically generates 100–300 tokens of response. At 10 t/s that\'s 10–30 seconds per reply — tolerable. At 50 t/s it feels nearly instant. At 5 t/s or below, you\'re watching individual words appear, which breaks the sense of a fluid conversation. The metric is hardware-dependent: the same 7B model at Q4 produces 8 t/s on a budget mini PC and 118 t/s on an RTX 5070.',
    whyItMatters: 'For interactive chat, target at least 15–20 t/s. For coding assistance where you read output as it streams, 30+ t/s is ideal. For background batch processing, even 5 t/s is fine. Match your hardware to your actual use case — overpaying for speed you don\'t need is wasteful.',
    relatedTermSlugs: ['memory-bandwidth', 'quantization', 'vram', 'unified-memory'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'apple-mac-mini-m4-pro', 'apple-mac-mini-m4'],
  },
  {
    slug: 'context-window',
    term: 'Context Window',
    category: 'performance',
    shortDef: 'The maximum amount of text (in tokens) a model can "see" at once. Larger context = more document history, longer conversations, bigger code files — but requires more VRAM.',
    fullDef: 'A model\'s context window is the total number of tokens it processes in a single forward pass — both your input and its output combined. Llama 3.1 supports up to 128K tokens (~96,000 words). However, every additional token in the context increases VRAM consumption. Running a 128K context requires significantly more memory than the base model weight alone, often doubling VRAM usage. Most local AI setups cap context at 4K–8K tokens to keep memory consumption manageable.',
    whyItMatters: 'For coding assistants working on large codebases, a 32K+ context window is transformative. For simple Q&A, 4K is sufficient. Check whether your hardware supports your target context size — a 13B model at 32K context may require 24+ GB of VRAM, pushing it beyond 12 GB cards.',
    relatedTermSlugs: ['vram', 'quantization', 'kv-cache'],
    relatedProductSlugs: ['apple-mac-mini-m4-pro', 'gigabyte-rtx-5070-windforce'],
  },
  {
    slug: 'kv-cache',
    term: 'KV Cache',
    category: 'performance',
    shortDef: 'Key-Value Cache — stores intermediate attention computations so the model doesn\'t re-process earlier context on each new token. Larger context = larger KV cache = more VRAM needed.',
    fullDef: 'During inference, transformer models compute "keys" and "values" for every token in the context. The KV cache stores these computations so they aren\'t recalculated on every new output token. Without it, generating token 500 would require reprocessing all 499 prior tokens, making generation exponentially slow. The cache is stored in VRAM and grows linearly with context length — at 128K context, the KV cache alone can consume 8–16 GB depending on the model architecture.',
    whyItMatters: 'KV cache is the hidden VRAM consumer that surprises people. A model that "fits" in 12 GB VRAM at short context may OOM (out of memory) when you feed it a long document. Tools like Ollama show VRAM usage in real time — watch the KV cache grow as conversation history lengthens.',
    relatedTermSlugs: ['context-window', 'vram', 'quantization'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'apple-mac-mini-m4-pro'],
  },

  // ── Software ──────────────────────────────────────────────────────────────
  {
    slug: 'ollama',
    term: 'Ollama',
    category: 'software',
    shortDef: 'Free open-source tool for running LLMs locally on macOS, Linux, and Windows. Download a model with a single command. No cloud account required. Supports Llama, Mistral, Qwen, Phi, and more.',
    fullDef: 'Ollama is a command-line and API server that abstracts model downloading, quantization selection, hardware detection, and inference into a single unified tool. Running "ollama run llama3.1" automatically downloads the Q4_K_M quantized model, detects whether you have a CUDA GPU, Apple Silicon, or CPU-only, and starts a local chat session. It also exposes an OpenAI-compatible REST API at localhost:11434, meaning any tool built for OpenAI (Continue, Open WebUI, Cursor) works with Ollama as a drop-in replacement.',
    whyItMatters: 'Ollama is the fastest path from zero to running a local LLM. On Apple Silicon, it uses the Metal backend for GPU acceleration automatically. On NVIDIA, it uses CUDA. On AMD Linux, it uses ROCm. The community model library (ollama.com/library) hosts hundreds of pre-quantized models — no manual GGUF downloading required.',
    relatedTermSlugs: ['gguf', 'cuda', 'rocm', 'mlx', 'lm-studio', 'quantization'],
    relatedProductSlugs: ['apple-mac-mini-m4', 'apple-mac-mini-m4-pro', 'geekom-it12', 'kamrui-hyper-h2'],
  },
  {
    slug: 'cuda',
    term: 'CUDA',
    category: 'software',
    shortDef: "NVIDIA's proprietary parallel computing platform. Industry standard for AI/ML. Nearly every AI framework (PyTorch, Ollama, ComfyUI) supports CUDA natively and first.",
    fullDef: 'CUDA (Compute Unified Device Architecture) is NVIDIA\'s proprietary programming model for GPU-accelerated computing. Introduced in 2007, it became the de-facto standard for AI research and production. Every major deep learning framework — PyTorch, TensorFlow, JAX — treats CUDA as the primary accelerator target. For local AI, this means NVIDIA GPUs have near-universal software compatibility: Ollama, ComfyUI, llama.cpp, LM Studio, and Automatic1111 all work out of the box with CUDA.',
    whyItMatters: 'CUDA\'s maturity is a practical advantage. AMD ROCm works well on Linux but has inconsistent Windows support and frequent compatibility issues with bleeding-edge tools. If you want everything to just work without debugging driver issues, CUDA on Windows is the path of least resistance.',
    relatedTermSlugs: ['rocm', 'tensor-cores', 'ollama', 'comfyui'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'asus-rtx-5070-sff'],
  },
  {
    slug: 'rocm',
    term: 'ROCm',
    category: 'software',
    shortDef: "AMD's open-source GPU compute platform — AMD's answer to NVIDIA CUDA. Required for GPU-accelerated AI on AMD cards. Mature on Linux; less reliable on Windows.",
    fullDef: 'ROCm (Radeon Open Compute) is AMD\'s open-source GPU compute stack, providing the libraries and drivers needed for AI/ML acceleration on Radeon GPUs. Unlike CUDA (closed-source), ROCm is fully open and has been maturing rapidly since 2022. Ollama supports ROCm on Linux automatically — running "ollama run llama3.1" on an RX 9060 XT detects the GPU and uses ROCm acceleration. Windows ROCm support exists but is fragmented; some tools (ComfyUI with certain extensions) require manual configuration.',
    whyItMatters: 'For Linux users, ROCm on the RX 9060 XT is genuinely compelling — you get 16 GB GDDR6 for models that overflow the RTX 5070\'s 12 GB. For Windows users, the ROCm experience is rougher and requires more manual setup. Check tool-specific documentation before assuming full compatibility.',
    relatedTermSlugs: ['cuda', 'ollama', 'rdna-4', 'comfyui'],
    relatedProductSlugs: ['gigabyte-rx-9060-xt-gaming'],
  },
  {
    slug: 'gguf',
    term: 'GGUF',
    category: 'software',
    shortDef: 'The standard file format for quantized LLMs used by llama.cpp and Ollama. Replaces the older GGML format. Stores model weights and metadata in a single portable file.',
    fullDef: 'GGUF (GPT-Generated Unified Format) is the model file format introduced by llama.cpp in 2023, now the universal container for quantized open-source LLMs. A GGUF file encodes the model architecture, vocabulary, tokenizer, quantization level, and all weight tensors in a single binary file. Ollama downloads and manages GGUF files behind the scenes; if you download models manually from Hugging Face, you\'ll typically choose between variants like "Llama-3.1-8B-Q4_K_M.gguf" (smaller, faster) and "Llama-3.1-8B-Q8_0.gguf" (larger, higher quality).',
    whyItMatters: 'GGUF files are self-contained and hardware-agnostic — the same file runs on Apple Silicon, NVIDIA, AMD, and CPU. The filename encodes the quantization level: Q4_K_M is the community sweet spot for balance. Q8_0 requires double the VRAM for modestly better output quality.',
    relatedTermSlugs: ['quantization', 'ollama', 'llama-cpp'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'apple-mac-mini-m4'],
  },
  {
    slug: 'mlx',
    term: 'MLX',
    category: 'software',
    shortDef: "Apple's open-source machine learning framework optimized for Apple Silicon. Enables fast LLM inference on M-series chips using the unified memory architecture natively.",
    fullDef: 'MLX is Apple\'s open-source array framework for machine learning, released in late 2023, designed specifically for Apple Silicon\'s unified memory architecture. Unlike PyTorch (which treats CPU and GPU as separate), MLX operates on a unified compute graph that naturally spans the CPU, GPU, and Neural Engine without memory copies. MLX-LM, the community\'s LLM inference package built on MLX, consistently benchmarks 20–40% faster than llama.cpp on the same Apple Silicon hardware for many models.',
    whyItMatters: 'If you\'re running LLMs on a Mac Mini M4 or M4 Pro, try MLX-LM alongside Ollama. For Llama 3.1 8B on the M4 Pro, MLX-LM often produces 70–80 t/s vs Ollama\'s 65 t/s. The Hugging Face mlx-community hosts pre-converted MLX versions of most popular models.',
    relatedTermSlugs: ['unified-memory', 'ollama', 'quantization'],
    relatedProductSlugs: ['apple-mac-mini-m4', 'apple-mac-mini-m4-pro'],
  },
  {
    slug: 'llama-cpp',
    term: 'llama.cpp',
    category: 'software',
    shortDef: 'The foundational C++ inference engine for running quantized LLMs locally. Powers Ollama, LM Studio, and most local AI tools under the hood. Supports CPU, CUDA, ROCm, and Metal.',
    fullDef: 'llama.cpp is a pure C/C++ inference engine created by Georgi Gerganov in early 2023, starting as a weekend project to run Llama on a MacBook. It grew into the foundation of the entire local AI ecosystem. Ollama, LM Studio, and most local AI wrappers use llama.cpp as their inference backend. It supports every major hardware backend — CUDA, ROCm, Metal (Apple), Vulkan — and introduced the GGUF file format. Running llama.cpp directly via command line gives you the most control over context size, batch size, thread count, and layer offloading.',
    whyItMatters: 'Understanding llama.cpp matters when you need to troubleshoot Ollama performance or configure advanced settings. The "-ngl" flag controls how many model layers are offloaded to the GPU — set it to 999 to push everything to VRAM, or lower numbers to split between GPU and CPU when VRAM is limited.',
    relatedTermSlugs: ['gguf', 'ollama', 'quantization', 'cuda', 'rocm'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'apple-mac-mini-m4'],
  },
  {
    slug: 'lm-studio',
    term: 'LM Studio',
    category: 'software',
    shortDef: 'A desktop GUI application for downloading and running local LLMs. Cross-platform (Mac, Windows, Linux). Wraps llama.cpp with a ChatGPT-like interface and built-in model browser.',
    fullDef: 'LM Studio is a free desktop application that puts a polished graphical interface on top of llama.cpp inference. It includes a built-in model browser that searches Hugging Face for GGUF files, automatic hardware detection, a ChatGPT-style chat UI, and an OpenAI-compatible local server. Unlike Ollama (command-line first), LM Studio is designed for users who prefer clicking over typing. It handles quantization selection, context window configuration, and GPU layer offloading through visual sliders.',
    whyItMatters: 'LM Studio is the recommended starting point for Windows users new to local AI. The model browser surfaces the most popular GGUF variants with size and hardware requirement labels, reducing guesswork. For Mac users, Ollama + Open WebUI often performs better; on Windows, LM Studio\'s CUDA integration is more polished than Ollama\'s.',
    relatedTermSlugs: ['ollama', 'gguf', 'llama-cpp', 'cuda'],
    relatedProductSlugs: ['geekom-it12', 'kamrui-hyper-h2', 'gigabyte-rtx-5070-windforce'],
  },
  {
    slug: 'comfyui',
    term: 'ComfyUI',
    category: 'software',
    shortDef: 'The node-based GUI for Stable Diffusion and Flux image generation. Industry standard for advanced AI image workflows. Requires a CUDA GPU for practical speeds; AMD ROCm on Linux works.',
    fullDef: 'ComfyUI is an open-source node-based workflow editor for AI image generation, supporting Stable Diffusion XL, Flux.1, SD 3.5, and most other diffusion models. Unlike Automatic1111 (the older linear UI), ComfyUI exposes every step of the generation pipeline as connectable nodes — model loading, VAE decoding, LoRA injection, upscaling — enabling complex automation workflows. It has become the production tool of choice for serious Stable Diffusion users, with thousands of community nodes extending its capabilities.',
    whyItMatters: 'ComfyUI on an RTX 5070 generates SDXL images in ~2.5 seconds. On an RX 9060 XT with ROCm on Linux, expect ~4 seconds. On a CPU-only mini PC, SDXL takes 3–8 minutes per image — effectively unusable for iterative creative work. A discrete GPU is near-mandatory for serious image generation.',
    relatedTermSlugs: ['cuda', 'rocm', 'vram', 'sdxl'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'asus-rtx-5070-sff', 'gigabyte-rx-9060-xt-gaming'],
  },
  {
    slug: 'cpu-inference',
    term: 'CPU Inference',
    category: 'software',
    shortDef: 'Running LLMs on the CPU rather than a GPU. Works on any hardware, no special drivers needed. Limited to ~8–12 t/s on 7B models — fine for background tasks, slow for interactive use.',
    fullDef: 'CPU inference runs LLM computations on the main processor rather than dedicated GPU hardware. Modern CPUs can run quantized GGUF models via llama.cpp using AVX2/AVX-512 SIMD instructions, but are bottlenecked by system RAM bandwidth (typically 50–100 GB/s) and the lack of thousands of parallel compute units. A high-end Ryzen 9 or Intel Core Ultra achieves 8–15 t/s on 7B Q4 models. This is sufficient for asynchronous tasks (batch summarization, code generation that runs while you take a break) but too slow for fluid conversational AI.',
    whyItMatters: 'Budget mini PCs running CPU inference are best deployed as always-on AI servers — think a private Ollama endpoint that family or team members can query, or an automation server processing documents overnight. Don\'t expect conversational fluency from a $230 mini PC.',
    relatedTermSlugs: ['tokens-per-second', 'lpddr4', 'ollama', 'quantization'],
    relatedProductSlugs: ['kamrui-pinova-p1', 'kamrui-pinova-p2', 'geekom-it12'],
  },

  // ── Hardware ──────────────────────────────────────────────────────────────
  {
    slug: 'tensor-cores',
    term: 'Tensor Cores',
    category: 'hardware',
    shortDef: "Specialized hardware units on NVIDIA GPUs designed for matrix multiplication — the core math operation in neural networks. 5th-gen Tensor Cores (Blackwell) are significantly faster than 4th-gen (Ada Lovelace) for AI inference.",
    fullDef: 'Tensor Cores are dedicated matrix-multiplication accelerators built into NVIDIA GPU die since the Volta architecture (2017). Each generation doubles or triples throughput: 5th-generation Tensor Cores in Blackwell (RTX 5070) support FP4 and FP8 precision natively, which AI inference frameworks can exploit for 2–4× the throughput of FP16. For LLM inference specifically, the memory bandwidth ceiling usually limits real-world throughput before Tensor Core compute does — but for batch inference (processing many prompts simultaneously), Tensor Core speed becomes the primary constraint.',
    whyItMatters: 'For single-user interactive chat, Tensor Core generation matters less than raw memory bandwidth. For deploying a shared local AI server serving multiple simultaneous users, 5th-gen Tensor Cores in Blackwell cards provide a meaningful throughput advantage.',
    relatedTermSlugs: ['cuda', 'vram', 'memory-bandwidth', 'blackwell'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'asus-rtx-5070-sff'],
  },
  {
    slug: 'tdp',
    term: 'TDP (Power Draw)',
    category: 'hardware',
    shortDef: 'Thermal Design Power in watts — the maximum sustained power draw. Higher TDP generally means more performance but more heat and electricity cost. Important for 24/7 always-on setups.',
    fullDef: 'TDP (Thermal Design Power) specifies the maximum sustained power a component draws under full load, measured in watts. A 150W GPU running 24/7 draws ~3.6 kWh per day — about $0.50/day at $0.14/kWh (US average), or ~$180/year. A 20W Mac Mini M4 under constant load costs ~$17/year. For always-on AI servers, TDP directly determines your electricity bill. Discrete GPUs also require proper case airflow and may increase ambient temperature in small rooms.',
    whyItMatters: 'For a dedicated home AI server that runs continuously, TDP is a first-order concern. The Mac Mini M4\'s 20W idle makes it the obvious choice for low-traffic personal use. The RTX 5070\'s 150W only makes sense if you\'re actively generating images or need interactive performance that justifies the cost.',
    relatedTermSlugs: ['tokens-per-second', 'cpu-inference'],
    relatedProductSlugs: ['apple-mac-mini-m4', 'kamrui-pinova-p1', 'apc-bx1500m'],
  },
  {
    slug: 'blackwell',
    term: 'Blackwell',
    category: 'hardware',
    shortDef: "NVIDIA's 2024–2025 GPU architecture generation. Features 5th-generation Tensor Cores, GDDR7 memory, and significant AI inference performance improvements over Ada Lovelace (RTX 40 series).",
    fullDef: 'Blackwell is NVIDIA\'s GPU microarchitecture codename for the RTX 50 series, succeeding Ada Lovelace (RTX 40 series). Key advances for AI workloads include 5th-generation Tensor Cores with FP4/FP8 native support, GDDR7 memory delivering 40% more bandwidth, and an improved NVLink fabric for multi-GPU setups. The consumer flagship RTX 5090 packs 32 GB GDDR7 at 1.8 TB/s — roughly 3× the bandwidth of the RTX 4090. The RTX 5070 brings GDDR7 bandwidth to the mid-range at ~$600.',
    whyItMatters: 'Blackwell is the first architecture where mid-range consumer cards ($600–800) provide meaningful LLM acceleration. The RTX 5070\'s 672 GB/s bandwidth rivals what the RTX 4090 offered at $1,600 just two years earlier. For anyone buying a GPU for local AI in 2025–2026, Blackwell is the minimum bar worth considering.',
    relatedTermSlugs: ['tensor-cores', 'gddr7', 'vram', 'cuda'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'asus-rtx-5070-sff'],
  },
  {
    slug: 'rdna-4',
    term: 'RDNA 4',
    category: 'hardware',
    shortDef: "AMD's 2024 GPU architecture. Notable IPC improvement over RDNA 3, improved AI inference throughput, paired with GDDR6 in the RX 9060 XT series.",
    fullDef: 'RDNA 4 is AMD\'s 2024 GPU microarchitecture, powering the RX 9070 and RX 9060 XT consumer cards. Key improvements over RDNA 3 include a redesigned compute unit with higher IPC (instructions per clock), improved AI matrix acceleration throughput, and a refined memory subsystem. The RX 9060 XT ships with 16 GB GDDR6 — more VRAM than the competing RTX 5070 at a similar price. ROCm support for RDNA 4 was available at launch, with official Ollama support following within months.',
    whyItMatters: 'RDNA 4 is AMD\'s most competitive AI inference offering to date. The 16 GB GDDR6 capacity advantage over the RTX 5070 makes it appealing for users who prioritize running larger models over raw token throughput. Linux users benefit most; Windows ROCm support is functional but requires manual configuration.',
    relatedTermSlugs: ['rocm', 'gddr6', 'vram', 'cuda'],
    relatedProductSlugs: ['gigabyte-rx-9060-xt-gaming'],
  },
  {
    slug: 'npu',
    term: 'NPU',
    category: 'hardware',
    shortDef: 'Neural Processing Unit — a dedicated AI accelerator chip. Found in modern Ryzen AI CPUs and Apple Silicon. Offloads specific AI tasks from CPU/GPU but too limited for full LLM inference.',
    fullDef: 'An NPU (Neural Processing Unit) is a specialized chip designed specifically for neural network computations, optimized for power efficiency rather than raw throughput. Apple\'s Neural Engine (a form of NPU) in M4 chips delivers 38 TOPS (trillion operations per second) for specific tasks like image classification and speech recognition. AMD\'s Ryzen AI NPUs in mini PCs like the NUCBox M5 Pro offer 50 TOPS. However, NPUs lack the memory bandwidth and programmability needed for LLM inference — they\'re best for fixed, optimized tasks like on-device Whisper transcription.',
    whyItMatters: 'NPU marketing is often overstated for local LLM purposes. The bottleneck for LLM inference is memory bandwidth and VRAM capacity, not compute TOPS. NPUs can accelerate specific tasks (real-time transcription, object detection) but don\'t replace GPU acceleration for running Llama 3 or Stable Diffusion.',
    relatedTermSlugs: ['unified-memory', 'tensor-cores', 'cpu-inference'],
    relatedProductSlugs: ['gmktec-nucbox-m5-pro', 'apple-mac-mini-m4'],
  },
  {
    slug: 'pcie',
    term: 'PCIe',
    category: 'hardware',
    shortDef: 'Peripheral Component Interconnect Express — the bus connecting a discrete GPU to the motherboard. PCIe 4.0 or 5.0 needed for fast model offloading when VRAM is exceeded.',
    fullDef: 'PCIe (Peripheral Component Interconnect Express) is the high-speed serial interface connecting discrete GPUs to the CPU and system memory. PCIe 4.0 x16 provides ~32 GB/s of bidirectional bandwidth; PCIe 5.0 doubles this to ~64 GB/s. For LLM inference within VRAM, PCIe speed is irrelevant. It only matters when models overflow VRAM and must stream layers from system RAM — at which point PCIe bandwidth (32–64 GB/s) becomes the bottleneck rather than GPU memory bandwidth (672 GB/s for GDDR7).',
    whyItMatters: 'If your model fits in VRAM, PCIe generation is irrelevant for inference speed. If you\'re intentionally offloading some layers to CPU RAM (e.g., running a 70B model on a 12 GB GPU), PCIe 4.0+ minimizes the penalty for those offloaded layers.',
    relatedTermSlugs: ['vram', 'memory-bandwidth', 'cpu-inference'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'gigabyte-rx-9060-xt-gaming'],
  },
  {
    slug: 'sdxl',
    term: 'SDXL',
    category: 'hardware',
    shortDef: 'Stable Diffusion XL — the standard 1024×1024 resolution image generation model. Requires 8+ GB VRAM for practical GPU-accelerated generation. Benchmark: generation time in seconds.',
    fullDef: 'Stable Diffusion XL (SDXL) is Stability AI\'s 6.6B parameter image generation model, producing 1024×1024 images. It requires approximately 8 GB VRAM to run at full resolution without memory optimization tricks. On the RTX 5070, a 20-step SDXL generation completes in ~2.5 seconds. On the RX 9060 XT with ROCm, ~4 seconds. On a CPU-only mini PC, the same generation takes 3–8 minutes, making iterative creative work impractical. Flux.1 (2024) has largely superseded SDXL in quality but requires similar hardware.',
    whyItMatters: 'SDXL generation time is the standard GPU benchmark for image generation workloads. If you plan to use Stable Diffusion or Flux seriously, target under 10 seconds per image — which means 8+ GB VRAM GPU hardware is mandatory.',
    relatedTermSlugs: ['vram', 'cuda', 'rocm', 'comfyui'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'asus-rtx-5070-sff', 'gigabyte-rx-9060-xt-gaming'],
  },

  // ── Connectivity ──────────────────────────────────────────────────────────
  {
    slug: 'thunderbolt-5',
    term: 'Thunderbolt 5',
    category: 'connectivity',
    shortDef: 'Intel\'s latest Thunderbolt standard — up to 120 Gbps bandwidth. Enables high-bandwidth eGPU enclosures, fast NVMe storage, and 8K display output from compact AI machines.',
    fullDef: 'Thunderbolt 5 doubles the bandwidth of Thunderbolt 4 (40 Gbps → 80 Gbps bidirectional, burstable to 120 Gbps asymmetric). For AI workloads, the key application is high-speed NVMe storage for model libraries — an external Thunderbolt 5 NVMe enclosure can deliver 5+ GB/s sequential read speeds, fast enough to stream model weights without measurable latency. It also enables Thunderbolt eGPU enclosures (though bandwidth limits still apply for GPU-intensive workloads).',
    whyItMatters: 'Mac Mini M4 Pro users managing large model libraries benefit most from Thunderbolt 5 storage. A 100 GB model library (several Llama 70B quantizations) loads substantially faster from a TB5 NVMe drive versus USB-A storage.',
    relatedTermSlugs: ['pcie'],
    relatedProductSlugs: ['cable-matters-thunderbolt-5', 'owc-envoy-express', 'apple-mac-mini-m4-pro'],
  },
  {
    slug: 'max-llm-size',
    term: 'Max LLM Size',
    category: 'performance',
    shortDef: 'The largest language model this hardware can run with full GPU/unified-memory acceleration, at the specified quantization. Larger models require more memory.',
    fullDef: 'Max LLM size indicates the largest model parameter count a given hardware configuration can run entirely in GPU VRAM or unified memory at Q4 quantization. Running "within VRAM" means all model layers are GPU-accelerated; exceeding this threshold forces CPU offloading with a significant speed penalty. The formula is approximate: model params (billions) × 0.5 GB ≈ VRAM needed at Q4. A 16 GB card fits ~30B models; 12 GB fits ~22B; 8 GB fits ~13B.',
    whyItMatters: 'Max LLM size is a practical ceiling, not a hard limit. You can run larger models with layer offloading — they\'ll just be slower. For interactive use, staying within the max LLM size for your hardware is the difference between 30+ t/s and 3 t/s.',
    relatedTermSlugs: ['vram', 'unified-memory', 'quantization', 'tokens-per-second'],
    relatedProductSlugs: ['gigabyte-rtx-5070-windforce', 'apple-mac-mini-m4-pro', 'gigabyte-rx-9060-xt-gaming'],
  },
]

// ── Derived lookups (backward compat + new) ───────────────────────────────────

/** Short definitions keyed by display term — used by ComparisonTable tooltips */
export const GLOSSARY: Record<string, string> = Object.fromEntries(
  GLOSSARY_ENTRIES.map(e => [e.term, e.shortDef])
)

/** Look up a short definition by display term label */
export function getGlossaryEntry(label: string): string | undefined {
  return GLOSSARY[label]
}

/** Look up full entry by URL slug */
export function getGlossaryBySlug(slug: string): GlossaryEntry | undefined {
  return GLOSSARY_ENTRIES.find(e => e.slug === slug)
}

/** All slugs for generateStaticParams */
export function getAllGlossarySlugs(): string[] {
  return GLOSSARY_ENTRIES.map(e => e.slug)
}

/** Entries grouped by category */
export function getGlossaryByCategory(): Record<GlossaryCategory, GlossaryEntry[]> {
  const result = {} as Record<GlossaryCategory, GlossaryEntry[]>
  for (const entry of GLOSSARY_ENTRIES) {
    if (!result[entry.category]) result[entry.category] = []
    result[entry.category].push(entry)
  }
  return result
}

export const CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  memory:       'Memory & Storage',
  performance:  'Performance & Benchmarks',
  software:     'Software & Frameworks',
  hardware:     'Hardware & Architecture',
  connectivity: 'Connectivity & Interfaces',
}
