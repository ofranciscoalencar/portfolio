"""
Generate remotion-ads/public/beat.m4a — an original 120 BPM drum pattern
synthesized from scratch, so the ad carries no licensing risk.

At 120 BPM a kick lands every 0.5s, so every 1s scene cut sits on a kick.
The three sub-bass drops must line up with the scenes that carry a
BeatFlash in src/Ad.tsx (SCENES `start` frames at 30fps):

    intro   frame   0  →  0s
    CHAMPS  frame 180  →  6s
    BRAZIL  frame 360  → 12s

Change a scene's start in Ad.tsx and you must change DROPS here too.

    python3 remotion-ads/scripts/gen-beat.py
"""
import math, os, random, struct, subprocess, wave

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WAV = os.path.join(HERE, "public", "beat.wav")
M4A = os.path.join(HERE, "public", "beat.m4a")
FFMPEG = os.environ.get(
    "FFMPEG",
    "/Users/franciscoalencar/Library/Python/3.14/lib/python/site-packages/"
    "imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1",
)

SR = 44100
SECONDS = 15.5
TOTAL = int(SR * SECONDS)
BPM = 120
BEAT = int(SR * 60 / BPM)

# (seconds, sub frequency Hz, length s, gain) — see the frame table above
DROPS = [(0, 40, 1.5, 0.7), (6, 42, 1.6, 0.8), (12, 38, 1.8, 0.85)]


def kick(dur=0.25, base=55):
    n = int(SR * dur)
    return [math.sin(2 * math.pi * (base + 80 * math.exp(-i / SR * 25)) * (i / SR))
            * math.exp(-(i / SR) * 6) for i in range(n)]


def snare(dur=0.18):
    rng = random.Random(42)
    n = int(SR * dur)
    return [((rng.random() * 2 - 1) * 0.55 + math.sin(2 * math.pi * 200 * i / SR) * 0.25)
            * math.exp(-(i / SR) * 16) for i in range(n)]


def hihat(seed, dur=0.05):
    rng = random.Random(seed)
    n = int(SR * dur)
    return [(rng.random() * 2 - 1) * 0.35 * math.exp(-(i / SR) * 50) for i in range(n)]


def sub(freq, dur):
    n = int(SR * dur)
    return [math.sin(2 * math.pi * freq * i / SR) * math.exp(-(i / SR) * 1.8) * 0.9
            for i in range(n)]


buf = [0.0] * TOTAL


def add(samples, pos, gain):
    for i, s in enumerate(samples):
        if 0 <= pos + i < TOTAL:
            buf[pos + i] += s * gain


for b in range(int(SECONDS * BPM / 60)):
    pos = b * BEAT
    add(kick(), pos, 0.95)                       # four on the floor
    if b % 4 in (1, 3):
        add(snare(), pos, 0.85)                  # backbeat on 2 and 4
    add(hihat(b), pos, 0.55)                     # 8th-note hats
    add(hihat(b + 100), pos + BEAT // 2, 0.45)

for at, freq, dur, gain in DROPS:
    add(sub(freq, dur), int(SR * at), gain)

peak = max(abs(s) for s in buf) or 1
with wave.open(WAV, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, s / peak * 0.95)) * 32767))
                           for s in buf))

subprocess.run([FFMPEG, "-y", "-i", WAV, "-c:a", "aac", "-b:a", "192k", M4A],
               check=True, capture_output=True)
os.remove(WAV)
print(f"wrote {M4A}  {SECONDS}s  {BPM}bpm  drops at {[d[0] for d in DROPS]}s")
