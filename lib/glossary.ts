export const GLOSSARY: Record<string, string> = {
  'VRAM':               'Video RAM — dedicated memory on a GPU. Determines the maximum model size you can run with full GPU acceleration. Once a model exceeds VRAM, it spills to system RAM over the slow PCIe bus.',
  'Unified Memory':     'Apple Silicon uses a single pool of fast RAM shared between CPU and GPU. Larger unified memory = larger models run entirely at full bandwidth — no PCIe bottleneck.',
  'Memory Bandwidth':   'How fast data moves between memory and the processor, measured in GB/s. Tokens per second scales nearly linearly with bandwidth — this is the single most important GPU spec for LLM speed.',
  'Quantization':       'Compressing a model by reducing numeric precision. Q4 = 4-bit (smallest, fastest), Q8 = 8-bit (balanced), FP16 = full precision. Less bits = less VRAM required, slight quality reduction.',
  'Tensor Cores':       "Specialized hardware units on NVIDIA GPUs designed for matrix multiplication — the core math operation in neural networks. 5th-gen Tensor Cores (Blackwell) are significantly faster than 4th-gen (Ada Lovelace) for AI inference.",
  'Tokens/s':           'Tokens per second — the standard speed metric for LLMs. One token ≈ 0.75 words. Above 10 t/s feels interactive; below 5 t/s feels like watching paint dry.',
  'TDP (Power Draw)':   'Thermal Design Power in watts — the maximum sustained power draw. Higher TDP generally means more performance but more heat and electricity cost. Important for 24/7 always-on setups.',
  'Max LLM Size':       'The largest language model this hardware can run with full GPU/unified-memory acceleration, at the specified quantization. Larger models require more memory.',
  'ROCm':               "AMD's open-source GPU compute platform — AMD's answer to NVIDIA CUDA. Required for GPU-accelerated AI on AMD cards. Mature on Linux; less reliable on Windows.",
  'CUDA':               "NVIDIA's proprietary parallel computing platform. Industry standard for AI/ML. Nearly every AI framework (PyTorch, Ollama, ComfyUI) supports CUDA natively and first.",
  'Ollama':             'Free open-source tool for running LLMs locally on macOS, Linux, and Windows. Download a model with a single command. No cloud account required. Supports Llama, Mistral, Qwen, Phi, and more.',
  'PCIe':               'Peripheral Component Interconnect Express — the bus connecting a discrete GPU to the motherboard. PCIe 4.0 or 5.0 needed for fast model offloading when VRAM is exceeded.',
  'GDDR7':              'The latest generation of GPU memory (2024+). Significantly higher bandwidth than GDDR6X at the same capacity tier. Used in NVIDIA Blackwell cards (RTX 5070 series).',
  'GDDR6':              'Previous-generation GPU memory. Lower bandwidth than GDDR7, but paired with larger capacities (e.g., 16GB RX 9060 XT) can offer better model headroom despite lower token speed.',
  'LPDDR4':             'Low-Power DDR4 — often soldered memory in mini PCs. Lower bandwidth than desktop DDR4 or DDR5. Limits tokens-per-second compared to high-end alternatives.',
  'RDNA 4':             "AMD's 2024 GPU architecture. Notable IPC improvement over RDNA 3, improved AI inference throughput, paired with GDDR6 in the RX 9060 XT series.",
  'Blackwell':          "NVIDIA's 2024–2025 GPU architecture generation. Features 5th-generation Tensor Cores, GDDR7 memory, and significant AI inference performance improvements over Ada Lovelace (RTX 40 series).",
  'Tokens Per Second (7B)': 'Measured inference speed running a 7B parameter model (e.g., Llama 3.1 8B) at Q4 quantization. This is the practical benchmark for interactive chat performance.',
  'Tokens Per Second (13B)': 'Measured inference speed running a 13B parameter model (e.g., Llama 2 13B) at Q4 quantization. Slower than 7B due to larger model size.',
  'SDXL Generation Time': 'Time in seconds to generate one 1024×1024 image using Stable Diffusion XL at default settings. GPU-only; mini PCs without discrete GPU cannot run SDXL at usable speeds.',
  'Interface':          'The connection standard used by this accessory. Thunderbolt 5 = up to 80Gbps. USB4 = up to 40Gbps. DisplayPort 2.1 = up to 80Gbps display bandwidth.',
}

export function getGlossaryEntry(label: string): string | undefined {
  return GLOSSARY[label]
}
