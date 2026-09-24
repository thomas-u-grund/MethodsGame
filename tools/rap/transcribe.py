#!/usr/bin/env python3
"""Word-level timestamps for Professor G's live recording (Whisper, local).
    .venv-tts/bin/python tools/rap/transcribe.py web/profg-live.mp3 out.json
The lyrics are known (the Christmas-lecture slides); this only finds WHEN each word is
rapped, so tools/rap/align.py can time every caption line and the mouth to the performance."""
import sys, json, whisper
m = whisper.load_model(sys.argv[3] if len(sys.argv) > 3 else 'small.en')
r = m.transcribe(sys.argv[1], word_timestamps=True, language='en', condition_on_previous_text=False,
                 initial_prompt='Will the real social scientist please stand up. Professor G. Empirical sociologist, data, methods, hypothesis, Popper, Luhmann, Marx, Durkheim, Weber.')
words = [{'w': w['word'].strip(), 's': round(w['start'], 2), 'e': round(w['end'], 2)} for seg in r['segments'] for w in seg.get('words', [])]
json.dump({'text': r['text'], 'words': words}, open(sys.argv[2], 'w'), indent=0)
print(len(words), 'words')
