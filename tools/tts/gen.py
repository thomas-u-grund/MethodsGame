"""Render voice lines with Chatterbox (English model, runs locally on Apple Silicon via MPS).

Usage: .venv-tts/bin/python tools/tts/gen.py jobs.json
jobs.json: [{"out": "path.wav", "text": "...", "ref": "voice-ref.wav" | null,
             "exaggeration": 0.5, "cfg_weight": 0.5, "temperature": 0.8, "seed": 1}]
"""
import json, sys, torch, torchaudio
from chatterbox.tts import ChatterboxTTS

device = "mps" if torch.backends.mps.is_available() else "cpu"
model = ChatterboxTTS.from_pretrained(device=device)
for job in json.load(open(sys.argv[1])):
    torch.manual_seed(job.get("seed", 1))
    wav = model.generate(job["text"], audio_prompt_path=job.get("ref"),
                         exaggeration=job.get("exaggeration", 0.5),
                         cfg_weight=job.get("cfg_weight", 0.5),
                         temperature=job.get("temperature", 0.8))
    torchaudio.save(job["out"], wav, model.sr)
    print("wrote", job["out"], flush=True)
