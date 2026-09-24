#!/usr/bin/env python3
"""
Phase 2 generation script for the hero sizzle reel.

Dispatches the 4 reference stills (Flux 1.1 Pro via Freepik) and the 6 video
takes (5 via Freepik Seedance Pro 1080p, 1 via fal.ai Veo3 Fast), polls for
completion, downloads outputs to ~/Desktop/Portfolio/_build/02-hero-sizzle/.

Modes:
    --mode=dry-run (default) — print request payloads + cost estimate, no HTTP.
    --mode=stills            — generate the 4 reference stills on Freepik.
    --mode=videos            — generate the 6 video takes (requires stills done).
    --mode=full              — stills, wait for user ok, then videos.

Secrets are read from ~/Projects/portfolio/.env.local (gitignored).
"""

from __future__ import annotations

import argparse
import base64
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

# ─── Paths + config ───────────────────────────────────────────────────

ROOT = Path.home() / "Projects/portfolio"
ENV_FILE = ROOT / ".env.local"
OUTPUT_DIR = Path.home() / "Desktop/Portfolio/_build/02-hero-sizzle"
STILLS_DIR = OUTPUT_DIR / "stills"
TAKES_DIR = OUTPUT_DIR / "takes"

FREEPIK_BASE = "https://api.freepik.com"
FAL_BASE = "https://queue.fal.run"

# Freepik task polling: CREATED → IN_PROGRESS → COMPLETED | FAILED
POLL_INTERVAL_S = 5
POLL_TIMEOUT_S = 600  # 10 minutes per generation

# ─── Locked content (sourced from the three locked MD files, verbatim) ─

STILLS = [
    {
        "slug": "char-a",
        "name": "CHAR-A — The Walker (HOOD UP v2)",
        "aspect_ratio": "widescreen_16_9",
        "prompt": (
            "Photorealistic photograph, shot on 35mm Kodak Vision3 500T film "
            "stock. Rear view of a man in his early 30s, medium athletic "
            "build, walking forward down the center of a wide urban "
            "boulevard at night. He is seen entirely from behind. He wears "
            "a matte-black cotton hoodie WITH THE HOOD UP, fully covering "
            "his head so his hair, ears, and face are completely obscured "
            "by the hood — zero face visibility, no hair visible, just the "
            "rounded silhouette of the pulled-up hood from behind. Black "
            "slim-fit jeans, black low-profile sneakers. His posture is "
            "relaxed but purposeful — hands at his sides or in hoodie "
            "pockets, head tilted very slightly down, walking at a calm, "
            "steady pace. The street surface is wet from recent rain, "
            "reflecting ambient light. Sodium-vapor streetlamps cast warm "
            "amber pools on the asphalt. Heavily desaturated David Fincher "
            "exterior-night color grade: low saturation, muted colors, "
            "crushed blacks, cool cyan in the shadows, warm sodium-yellow "
            "in the highlights. Slight atmospheric haze. Visible 35mm film "
            "grain. The composition places The Walker dead center of "
            "frame, the boulevard's vanishing point stretching ahead of "
            "him into the dark. ABSOLUTELY NO READABLE TEXT anywhere. "
            "NO FACE, NO HAIR VISIBLE — hood covers everything above the "
            "shoulders. Anamorphic lens characteristics: subtle horizontal "
            "flare. 16:9 aspect ratio."
        ),
    },
    {
        "slug": "env-a",
        "name": "ENV-A — Paulista Wide Night (aerial)",
        "aspect_ratio": "widescreen_16_9",
        "prompt": (
            "ABSOLUTELY NO LEGIBLE TEXT, NO WORDS, NO LETTERS, NO READABLE "
            "SIGNAGE, NO BRAND NAMES, NO BILLBOARDS WITH TEXT. All signage "
            "and billboards must be pure abstract colored light shapes — "
            "soft glows with no recognizable characters. Photorealistic "
            "aerial photograph of Avenida Paulista in São Paulo, Brazil at "
            "night, shot from approximately 200 feet above the avenue "
            "looking straight down the boulevard's central axis. The avenue "
            "stretches into the distance as a wide, straight urban canyon "
            "flanked by towering skyscrapers. The distinctive suspended "
            "red structure of MASP visible on the right side. The street "
            "surface is wet from recent rain, creating long reflections of "
            "streetlights. Sodium-vapor streetlamps line both sides, "
            "casting warm amber light. A thin layer of atmospheric haze "
            "hangs at mid-building height. Scattered across the avenue: a "
            "few vehicles with headlights, small groups of pedestrians as "
            "tiny figures. Heavily desaturated David Fincher "
            "exterior-night color grade: crushed blacks, low saturation, "
            "muted colors, cool cyan in building shadows, warm sodium "
            "highlights on wet surfaces. Volumetric haze catches distant "
            "light. Steam or smoke rises from two points along the avenue. "
            "One or two red-and-blue police strobe reflections visible on "
            "the wet asphalt in the mid-distance. 35mm Kodak 500T film "
            "stock, visible grain, anamorphic lens characteristics. 16:9 "
            "aspect ratio. Remember: zero readable words anywhere in the "
            "frame."
        ),
    },
    {
        "slug": "env-b",
        "name": "ENV-B — Paulista Street-Level Chaos",
        "aspect_ratio": "widescreen_16_9",
        "prompt": (
            "ABSOLUTELY NO LEGIBLE TEXT, NO WORDS, NO LETTERS, NO READABLE "
            "SIGNAGE, NO BRAND NAMES, NO STORE NAMES. All neon signs and "
            "billboards must be pure abstract colored glows — blurred "
            "color fields with no recognizable characters. "
            "Photorealistic street-level photograph of Avenida Paulista in "
            "São Paulo at night, shot at hip height (~3 feet) looking down "
            "the center of the avenue. The camera is low, creating "
            "dramatic vanishing-point perspective with the wet asphalt "
            "dominating the lower third of frame. The avenue stretches "
            "forward into the dark. On the wet pavement: a flipped-over "
            "delivery scooter, scattered papers, abandoned shopping bags. "
            "In the midground: blurred motion of people running across the "
            "avenue in different directions — figures caught mid-stride, "
            "slightly motion-blurred. In the background: the skyscraper "
            "canyon of Paulista, with abstract colored neon glows "
            "(magenta, cyan, amber) bleeding light onto wet surfaces — "
            "NO readable letters or words anywhere in the signs. A "
            "police car with red-and-blue strobe lights is caught "
            "mid-pass on the left side, its lights creating streaked "
            "reflections on the wet road. Steam rises from a manhole in "
            "the mid-distance. David Fincher exterior-night color grade: "
            "heavily desaturated, low saturation, muted colors, "
            "sodium-vapor yellow streetlights, cool cyan shadows, crushed "
            "warm blacks. Volumetric atmosphere. 35mm Kodak 500T film "
            "grain, anamorphic lens with slight barrel distortion from "
            "ultra-wide focal length. 16:9 aspect ratio. Remember: zero "
            "readable words anywhere in the frame."
        ),
    },
    {
        "slug": "env-c",
        "name": "ENV-C — Macro Neon Puddle",
        "aspect_ratio": "widescreen_16_9",
        "prompt": (
            "Extreme close-up photorealistic photograph of a rain puddle on "
            "dark asphalt at night, shot at ground level with a macro lens. "
            "The puddle surface reflects blurred neon light from above — "
            "magenta, cyan, warm amber — bleeding into abstract color fields "
            "on the water's surface. No text is readable in any reflection; "
            "the neon shapes are pure dissolved color. A single small ripple "
            "disturbs the water surface near center frame, creating "
            "concentric rings that distort the neon reflections. The asphalt "
            "texture is visible at the edges of the puddle — rough, dark, "
            "wet. In the out-of-focus background: the soft glow of sodium "
            "streetlamps and a distant red-and-blue police strobe, heavily "
            "bokeh'd into large soft circles. A faint wisp of steam crosses "
            "the upper portion of the frame. The depth of field is "
            "razor-thin — only the puddle surface and its immediate edges "
            "are in focus. Color palette: deep warm black base, jewel-tone "
            "neon highlights (magenta dominant, cyan secondary, amber "
            "accent). 35mm Kodak 500T grain visible even in the macro. "
            "Anamorphic bokeh (oval-shaped out-of-focus highlights). 16:9 "
            "aspect ratio."
        ),
    },
]

# Videos. `image_ref` points to one of the still slugs above; the generated
# still's Freepik-hosted URL is passed as `image` input on Freepik or `image_url`
# on fal.ai. `provider` = "fal" | "freepik-seedance".

VIDEO_TAKES = [
    {
        "slug": "01-a-gods-eye",
        "name": "Shot 01-A — God's Eye Pull-Back",
        "provider": "fal",
        "endpoint": "fal-ai/veo3/fast/image-to-video",
        "image_ref": "env-a",
        "aspect_ratio": "16:9",
        "duration": "8s",  # Veo3 Fast accepts 4s/6s/8s; we trim to 4s in Resolve.
        "audio": False,
        "est_cost_usd": 0.80,  # $0.10/s × 8s
        "prompt": (
            "Cinematic aerial drone shot of the REAL Avenida Paulista in "
            "São Paulo, Brazil at night. Photorealistic reference: the "
            "actual six-lane boulevard with its central palm-tree median, "
            "MASP's distinctive suspended red concrete-and-glass structure "
            "on the right side, Conjunto Nacional modernist building on "
            "the left, Edifício Itália in the far distance skyline, "
            "ornate black wrought-iron lamp posts with sodium-vapor bulbs "
            "lining both sidewalks — these landmarks must be recognizable, "
            "not stylized. "
            "Camera starts tight directly overhead on The Walker "
            "(matte-black hoodie WITH HOOD UP fully covering his head, "
            "black jeans, black sneakers, seen from behind, face and hair "
            "entirely hidden under the hood) mid-stride, top-down view, "
            "the rounded silhouette of his hood filling the center of the "
            "frame against the textured wet asphalt. Smooth "
            "gimbal-stabilized pull-back and rise over 5 seconds, slowly "
            "revealing the avenue around him: the palm median, passing "
            "police cars with red-and-blue strobes, crowds scattering on "
            "side streets, steam columns rising from manholes. By end of "
            "pull-back the frame reveals a massive Kaiju silhouette two "
            "kilometers behind at the end of Paulista, obscured by "
            "volumetric haze — rendered at distance with Fincher "
            "restraint, not monster-movie spectacle. The Walker continues "
            "walking straight forward at steady pace, unbothered. "
            "Heavily desaturated David Fincher exterior-night grade: low "
            "saturation, sodium-amber streetlights, cool cyan shadows, "
            "crushed blacks. 35mm anamorphic, 24fps, 4K. NO READABLE "
            "TEXT anywhere, no legible signage. Smooth continuous drone "
            "pull-back, no cuts."
        ),
    },
    {
        "slug": "01-b-vertical-rise",
        "name": "Shot 01-B — Vertical Rise Reveal",
        "provider": "freepik-seedance",
        "endpoint": "/v1/ai/image-to-video/seedance-pro-1080p",
        "image_ref": "char-a",
        "aspect_ratio": "widescreen_16_9",
        "duration": "5",
        "camera_fixed": False,
        "frames_per_second": 24,
        "est_cost_usd": 0.0,  # included in Freepik Premium+
        "prompt": (
            "Cinematic aerial drone shot, São Paulo at night, real "
            "Avenida Paulista (recognizable landmarks: central palm "
            "median, MASP red suspended structure, Conjunto Nacional). "
            "Camera starts at the Walker's shoulder height directly "
            "behind him, tracking his back as he walks forward for the "
            "first 1.5 seconds. The Walker wears a matte-black hoodie "
            "WITH HOOD UP fully covering his head — face and hair "
            "completely hidden, only the rounded hood silhouette visible "
            "from behind. Then the drone begins a slow, continuous "
            "vertical rise — we ascend while still facing forward, so "
            "the avenue's vanishing-point geometry extends ahead and "
            "below. As we rise, a large dark winged silhouette glides "
            "slowly across the upper skyline (abstract creature, no "
            "franchise signifiers). Higher still, the MASP red structure "
            "becomes visible to the left. Helicopter searchlights cut "
            "the sky in the distance. The Walker is still visible below, "
            "small now, walking the centerline. Heavily desaturated "
            "Fincher night grade. 35mm anamorphic, 24fps, 4K. NO "
            "READABLE TEXT. Single continuous rise-and-reveal move over "
            "5 seconds."
        ),
    },
    {
        "slug": "06-b-hip-ultrawide",
        "name": "Shot 06-B — Hip-Level Ultra-Wide Track",
        "provider": "freepik-seedance",
        "endpoint": "/v1/ai/image-to-video/seedance-pro-1080p",
        "image_ref": "env-b",
        "aspect_ratio": "widescreen_16_9",
        "duration": "5",
        "camera_fixed": False,
        "frames_per_second": 24,
        "est_cost_usd": 0.0,
        "prompt": (
            "Cinematic drone shot, São Paulo at night, real Avenida "
            "Paulista. Camera tracks The Walker (matte-black hoodie "
            "WITH HOOD UP covering his entire head, black jeans, black "
            "sneakers, seen from behind — face and hair completely "
            "hidden) from behind at hip height, ultra-wide-angle lens "
            "creating slight barrel distortion that emphasizes the "
            "vanishing-point geometry of the avenue. We see the "
            "Walker's lower back and hooded silhouette, black jeans, "
            "sneakers on wet asphalt, steam rising. In foreground: a "
            "flipped scooter, scattered papers. In midground: crowds "
            "sprinting across frame. "
            "Far background: a PHOTOREALISTIC Kaiju creature of "
            "Godzilla-scale lurches slowly between two skyscrapers — "
            "detailed textured reptilian skin with visible scales, "
            "subtle bioluminescent highlights along the spine, "
            "four-limbed bipedal stance, weight and mass in its slow "
            "movement. The creature is rendered with the same 35mm "
            "anamorphic film grain and Fincher color grade as the rest "
            "of the scene — cinematic weight, not silhouette cartoon, "
            "not monster-movie spectacle. Partly obscured by volumetric "
            "atmospheric haze so it reads as real but distant. "
            "Neon shop-sign glow bleeds into the edges of frame (all "
            "letters abstracted/illegible). Heavily desaturated "
            "Fincher grade. 35mm anamorphic ultra-wide, 24fps, 4K. NO "
            "READABLE TEXT. 5-second continuous track."
        ),
    },
    {
        "slug": "06-c-side-parallel",
        "name": "Shot 06-C — Side-Parallel Tracking",
        "provider": "fal-seedance",
        "endpoint": "fal-ai/bytedance/seedance/v1/pro/image-to-video",
        "image_ref": "env-b",
        "aspect_ratio": "16:9",
        "duration": 5,
        "resolution": "1080p",
        "camera_fixed": False,
        "est_cost_usd": 0.50,
        "prompt": (
            "Cinematic drone shot, São Paulo at night, real Avenida "
            "Paulista. Camera tracks The Walker (matte-black hoodie "
            "WITH HOOD UP covering his entire head, black jeans, black "
            "sneakers, seen from behind — face and hair completely "
            "hidden by the hood) from a 90° side angle, parallel to his "
            "direction of travel, at chest height. He walks "
            "screen-right to screen-left across the frame at constant "
            "pace, only his hooded silhouette and profile ever visible "
            "(face NEVER shown, hood obscures everything above the "
            "shoulders). In the background: the avenue's full chaos "
            "layered in depth — skyscraper canyon, a dark winged "
            "silhouette gliding at mid-height (abstract creature, no "
            "franchise signifiers), police lights strobing, crowds in "
            "soft focus. Shallow depth of field keeping the Walker "
            "crisp and the chaos softly blurred. Heavily desaturated "
            "Fincher night grade. 35mm anamorphic, 24fps, 4K. NO "
            "READABLE TEXT. 5-second continuous parallel track."
        ),
    },
    {
        "slug": "12-b-sneaker-neon",
        "name": "Shot 12-B — Sneaker on Wet Neon Reflection",
        "provider": "fal-seedance",
        "endpoint": "fal-ai/bytedance/seedance/v1/pro/image-to-video",
        "image_ref": "env-c",
        "aspect_ratio": "16:9",
        "duration": 5,
        "resolution": "1080p",
        "camera_fixed": True,
        "est_cost_usd": 0.50,
        "prompt": (
            "Extreme macro close-up on a black Nike Air Jordan 1 "
            "high-top sneaker (iconic Jordan Wings logo visible on the "
            "ankle collar, characteristic stitched panel construction, "
            "visible Nike swoosh) stepping into a shallow rain puddle "
            "on Paulista asphalt. The puddle reflects blurred neon "
            "signage — magenta, cyan, amber — bleeding into abstract "
            "color fields with no readable text. Ripple spreads outward "
            "in slow motion as the sneaker makes contact. Periphery of "
            "frame: blurred police-strobe red-and-blue, distant Kaiju "
            "silhouette reflected in the puddle at extreme distortion. "
            "Deep warm black base, jewel-tone neon highlights. Heavily "
            "desaturated Fincher night grade across the scene, with "
            "the Jordan's leather texture crisp in macro focus. 35mm "
            "anamorphic macro, 24fps, 4K slow motion. 5-second "
            "single-step action."
        ),
    },
    {
        # Continuation of 01-B Vertical Rise. Seeded from the LAST frame of
        # the approved 01-B take so the drone height + character position
        # match exactly. Ends back at the 01-B start composition (shoulder
        # height behind Walker) so the two takes compose a seamless loop.
        "slug": "01-b-loop",
        "name": "Shot 01-B-LOOP — Walker still + descent to loop point",
        "provider": "fal-seedance",
        "endpoint": "fal-ai/bytedance/seedance/v1/pro/image-to-video",
        "image_ref": "01-b-last-frame",
        "aspect_ratio": "16:9",
        "duration": 8,
        "resolution": "1080p",
        "camera_fixed": False,
        "est_cost_usd": 0.80,
        "prompt": (
            "Continuation of a cinematic aerial drone shot on Avenida "
            "Paulista, São Paulo, at night. SAME SCENE, SAME CHARACTER, "
            "SAME COLOR GRADE. The Walker (matte-black hoodie WITH HOOD "
            "UP completely covering his head, face and hair hidden, "
            "black jeans, black sneakers, seen from behind) is small in "
            "the center of the frame, standing on the wet centerline of "
            "the avenue. "
            "Action over 8 seconds: (1) First 2 seconds — the Walker "
            "stands still, slowly pulls a phone from his hoodie pocket "
            "and holds it low, looking at its screen (face remains "
            "entirely hidden under the hood — never visible). (2) Next "
            "3 seconds — he lowers the phone and stands still again, "
            "hands back at his sides; meanwhile cars continue passing "
            "down Paulista in both directions, pedestrians walk on the "
            "sidewalks on both sides. (3) Final 3 seconds — the drone "
            "begins a slow continuous vertical DESCENT back toward the "
            "Walker, maintaining the same forward-facing orientation, "
            "ending the shot at shoulder height directly behind him "
            "with his back and pulled-up hood filling the center of the "
            "frame (composition matches the opening of the sequence "
            "for seamless loop). "
            "Throughout: cars pass at steady 30-50 km/h with "
            "headlights and taillights, pedestrians move naturally on "
            "both sidewalks, red-and-blue police strobes reflect "
            "occasionally on wet asphalt in the mid-distance, steam "
            "rises from manholes, gentle atmospheric haze. Heavily "
            "desaturated David Fincher exterior-night grade: low "
            "saturation, crushed blacks, cool cyan shadows, warm "
            "sodium-amber streetlamp highlights. 35mm anamorphic, "
            "24fps, 4K. NO READABLE TEXT, NO LEGIBLE SIGNAGE. Smooth "
            "continuous shot, no cuts."
        ),
    },
    {
        "slug": "12-c-hood-neon",
        "name": "Shot 12-C — Hood Edge in Neon Glow",
        "provider": "fal-seedance",
        "endpoint": "fal-ai/bytedance/seedance/v1/pro/image-to-video",
        "image_ref": "char-a",
        "aspect_ratio": "16:9",
        "duration": 5,
        "resolution": "1080p",
        "camera_fixed": False,
        "est_cost_usd": 0.50,
        "prompt": (
            "Extreme close-up on the back edge of The Walker's hood — "
            "matte-black hoodie WITH HOOD UP, the curved seam where "
            "the raised hood meets the shoulders visible, fabric "
            "texture crisp. The hood catches soft pink-and-cyan neon "
            "glow from an off-frame São Paulo storefront, wrapping "
            "around its rounded contour. A tiny lens flare blooms at "
            "the edge of frame. Face, hair, and head completely hidden "
            "inside the hood — zero facial visibility. In deep "
            "background bokeh: the abstract dark silhouette of a large "
            "winged creature gliding past a skyscraper at distance, "
            "out of focus (no franchise signifiers). Rain mist floats "
            "across. Heavily desaturated Fincher night grade. 35mm "
            "anamorphic macro, 24fps, 4K. 5-second shot, subtle "
            "forward motion as the Walker continues walking."
        ),
    },
]

# ─── .env.local loader ────────────────────────────────────────────────

def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    if not ENV_FILE.exists():
        sys.exit(f"ERROR: {ENV_FILE} not found. Save your API keys there first.")
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env

# ─── HTTP helpers ─────────────────────────────────────────────────────

def http_request(
    method: str,
    url: str,
    *,
    headers: dict[str, str] | None = None,
    json_body: dict | None = None,
    timeout: int = 60,
) -> dict:
    data = None
    headers = dict(headers or {})
    if json_body is not None:
        data = json.dumps(json_body).encode("utf-8")
        headers.setdefault("Content-Type", "application/json")
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8")
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        sys.exit(f"HTTP {e.code} from {url}\n{body}")
    except urllib.error.URLError as e:
        sys.exit(f"Network error calling {url}: {e}")

def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "phase2-generate"})
    with urllib.request.urlopen(req, timeout=300) as resp, dest.open("wb") as f:
        while True:
            chunk = resp.read(65536)
            if not chunk:
                break
            f.write(chunk)

# ─── Freepik: Flux 1.1 Pro still ──────────────────────────────────────

def freepik_generate_still(api_key: str, spec: dict) -> dict:
    """Returns {"task_id", "image_url", "local_path"} when complete."""
    STILLS_DIR.mkdir(parents=True, exist_ok=True)
    local_path = STILLS_DIR / f"{spec['slug']}.png"

    print(f"  → POST flux-pro-v1-1 (aspect={spec['aspect_ratio']})")
    submit = http_request(
        "POST",
        f"{FREEPIK_BASE}/v1/ai/text-to-image/flux-pro-v1-1",
        headers={"x-freepik-api-key": api_key},
        json_body={
            "prompt": spec["prompt"],
            "aspect_ratio": spec["aspect_ratio"],
            "output_format": "png",
            "safety_tolerance": 2,
        },
    )
    task_id = submit["data"]["task_id"]
    print(f"  task_id={task_id}, polling...")
    image_url = freepik_poll_flux(api_key, task_id)
    print(f"  downloading {image_url[:60]}...")
    download(image_url, local_path)
    print(f"  ✓ saved {local_path}")
    return {"task_id": task_id, "image_url": image_url, "local_path": str(local_path)}

def freepik_poll_flux(api_key: str, task_id: str) -> str:
    start = time.time()
    url = f"{FREEPIK_BASE}/v1/ai/text-to-image/flux-pro-v1-1/{task_id}"
    while time.time() - start < POLL_TIMEOUT_S:
        resp = http_request("GET", url, headers={"x-freepik-api-key": api_key})
        status = resp.get("data", {}).get("status")
        if status == "COMPLETED":
            generated = resp["data"].get("generated", [])
            if not generated:
                sys.exit(f"  task {task_id} COMPLETED but no image URLs returned")
            return generated[0]
        if status == "FAILED":
            sys.exit(f"  task {task_id} FAILED: {json.dumps(resp)}")
        time.sleep(POLL_INTERVAL_S)
    sys.exit(f"  task {task_id} timed out after {POLL_TIMEOUT_S}s")

# ─── Freepik: Seedance Pro 1080p video ────────────────────────────────

def freepik_generate_seedance(
    api_key: str, spec: dict, image_b64: str
) -> dict:
    """image_b64 is the base64 string (no data: URI prefix) of the PNG file."""
    TAKES_DIR.mkdir(parents=True, exist_ok=True)
    local_path = TAKES_DIR / f"{spec['slug']}.mp4"
    endpoint = f"{FREEPIK_BASE}{spec['endpoint']}"

    print(f"  → POST seedance-pro-1080p (duration={spec['duration']}s)")
    submit = http_request(
        "POST",
        endpoint,
        headers={"x-freepik-api-key": api_key},
        json_body={
            "prompt": spec["prompt"],
            "image": image_b64,
            "duration": spec["duration"],
            "aspect_ratio": spec["aspect_ratio"],
            "camera_fixed": spec["camera_fixed"],
            "frames_per_second": spec["frames_per_second"],
        },
    )
    task_id = submit["data"]["task_id"]
    print(f"  task_id={task_id}, polling...")
    video_url = freepik_poll_seedance(api_key, task_id, endpoint)
    print(f"  downloading {video_url[:60]}...")
    download(video_url, local_path)
    print(f"  ✓ saved {local_path}")
    return {"task_id": task_id, "video_url": video_url, "local_path": str(local_path)}

def freepik_poll_seedance(api_key: str, task_id: str, endpoint: str) -> str:
    start = time.time()
    url = f"{endpoint}/{task_id}"
    while time.time() - start < POLL_TIMEOUT_S:
        resp = http_request("GET", url, headers={"x-freepik-api-key": api_key})
        status = resp.get("data", {}).get("status")
        if status == "COMPLETED":
            generated = resp["data"].get("generated", [])
            if not generated:
                sys.exit(f"  task {task_id} COMPLETED but no video URL returned")
            return generated[0]
        if status == "FAILED":
            sys.exit(f"  task {task_id} FAILED: {json.dumps(resp)}")
        time.sleep(POLL_INTERVAL_S)
    sys.exit(f"  task {task_id} timed out after {POLL_TIMEOUT_S}s")

# ─── fal.ai: Veo3 Fast image-to-video ─────────────────────────────────

def fal_generate_seedance(api_key: str, spec: dict, image_data_uri: str) -> dict:
    """Seedance 1.0 Pro image-to-video via fal.ai.
    Different from Freepik's Seedance: integer duration, colon aspect ratio,
    `image_url` field name (supports data URIs)."""
    TAKES_DIR.mkdir(parents=True, exist_ok=True)
    local_path = TAKES_DIR / f"{spec['slug']}.mp4"

    print(f"  → POST {spec['endpoint']} (duration={spec['duration']}s)")
    submit = http_request(
        "POST",
        f"{FAL_BASE}/{spec['endpoint']}",
        headers={"Authorization": f"Key {api_key}"},
        json_body={
            "prompt": spec["prompt"],
            "image_url": image_data_uri,
            "duration": spec["duration"],
            "resolution": spec.get("resolution", "1080p"),
            "aspect_ratio": spec["aspect_ratio"],
            "camera_fixed": spec["camera_fixed"],
        },
    )
    request_id = submit.get("request_id")
    status_url = submit.get("status_url")
    response_url = submit.get("response_url")
    if not (request_id and status_url and response_url):
        sys.exit(f"  fal.ai submit missing urls: {json.dumps(submit)}")
    print(f"  request_id={request_id}, polling...")
    video_url = fal_poll(api_key, status_url, response_url, request_id)
    print(f"  downloading {video_url[:60]}...")
    download(video_url, local_path)
    print(f"  ✓ saved {local_path}")
    return {"request_id": request_id, "video_url": video_url, "local_path": str(local_path)}


def fal_generate_veo3(api_key: str, spec: dict, image_data_uri: str) -> dict:
    """image_data_uri is a `data:image/png;base64,<b64>` string."""
    TAKES_DIR.mkdir(parents=True, exist_ok=True)
    local_path = TAKES_DIR / f"{spec['slug']}.mp4"

    print(f"  → POST {spec['endpoint']} (duration={spec['duration']}, audio={spec['audio']})")
    submit = http_request(
        "POST",
        f"{FAL_BASE}/{spec['endpoint']}",
        headers={"Authorization": f"Key {api_key}"},
        json_body={
            "prompt": spec["prompt"],
            "image_url": image_data_uri,
            "aspect_ratio": spec["aspect_ratio"],
            "duration": spec["duration"],
            "audio": spec["audio"],
        },
    )
    request_id = submit.get("request_id")
    # fal.ai returns `status_url` and `response_url` in the submit response;
    # use those directly rather than reconstructing paths (which vary per model).
    status_url = submit.get("status_url")
    response_url = submit.get("response_url")
    if not (request_id and status_url and response_url):
        sys.exit(f"  fal.ai submit missing request_id/status_url/response_url: {json.dumps(submit)}")
    print(f"  request_id={request_id}, polling...")
    video_url = fal_poll(api_key, status_url, response_url, request_id)
    print(f"  downloading {video_url[:60]}...")
    download(video_url, local_path)
    print(f"  ✓ saved {local_path}")
    return {"request_id": request_id, "video_url": video_url, "local_path": str(local_path)}

def fal_poll(api_key: str, status_url: str, response_url: str, request_id: str) -> str:
    start = time.time()
    while time.time() - start < POLL_TIMEOUT_S:
        status_resp = http_request(
            "GET", status_url, headers={"Authorization": f"Key {api_key}"}
        )
        status = status_resp.get("status")
        if status == "COMPLETED":
            result = http_request(
                "GET", response_url, headers={"Authorization": f"Key {api_key}"}
            )
            video = result.get("video") or {}
            url = video.get("url")
            if not url:
                sys.exit(f"  fal request {request_id} has no video URL: {json.dumps(result)}")
            return url
        if status in ("ERROR", "FAILED"):
            sys.exit(f"  fal request {request_id} FAILED: {json.dumps(status_resp)}")
        time.sleep(POLL_INTERVAL_S)
    sys.exit(f"  fal request {request_id} timed out after {POLL_TIMEOUT_S}s")

# ─── Dry-run renderer ─────────────────────────────────────────────────

def mask_key(k: str) -> str:
    if len(k) < 8:
        return "*" * len(k)
    return f"{k[:3]}…{k[-3:]} ({len(k)} chars)"

def print_dry_run(env: dict[str, str]) -> None:
    print("━" * 60)
    print("PHASE 2 DRY-RUN — no HTTP calls made")
    print("━" * 60)
    print()
    print("Keys loaded:")
    print(f"  FREEPIK_API_KEY = {mask_key(env.get('FREEPIK_API_KEY', ''))}")
    print(f"  FAL_KEY         = {mask_key(env.get('FAL_KEY', ''))}")
    print()
    print(f"Output directories (will be created):")
    print(f"  stills → {STILLS_DIR}")
    print(f"  videos → {TAKES_DIR}")
    print()
    print("─" * 60)
    print(f"PHASE A — {len(STILLS)} reference stills (Flux 1.1 Pro via Freepik)")
    print("─" * 60)
    for s in STILLS:
        print()
        print(f"  {s['name']}")
        print(f"    POST {FREEPIK_BASE}/v1/ai/text-to-image/flux-pro-v1-1")
        print(f"    aspect_ratio = {s['aspect_ratio']}, output = png")
        print(f"    prompt ({len(s['prompt'])} chars): {s['prompt'][:100]}…")
        print(f"    cost: $0 (Freepik Premium+ included)")
    print()
    print("─" * 60)
    print(f"PHASE B — {len(VIDEO_TAKES)} video takes")
    print("─" * 60)
    total_video_cost = 0.0
    for v in VIDEO_TAKES:
        print()
        print(f"  {v['name']}")
        if v["provider"] == "fal":
            print(f"    POST {FAL_BASE}/{v['endpoint']} (fal.ai)")
        else:
            print(f"    POST {FREEPIK_BASE}{v['endpoint']} (Freepik)")
        print(f"    image_ref = {v['image_ref']} (uses generated still URL)")
        print(f"    duration = {v['duration']}, aspect = {v['aspect_ratio']}")
        print(f"    prompt ({len(v['prompt'])} chars): {v['prompt'][:100]}…")
        print(f"    cost: ${v['est_cost_usd']:.2f}")
        total_video_cost += v["est_cost_usd"]
    print()
    print("━" * 60)
    print(f"TOTAL ESTIMATED COST: ${total_video_cost:.2f}")
    print(f"  (Freepik: $0 beyond your $30/mo Premium+ subscription)")
    print(f"  (fal.ai:  ${total_video_cost:.2f} pay-per-gen; 01-A retakes bill separately)")
    print("━" * 60)
    print()
    print("To run for real:")
    print("  python3 scripts/phase2-generate.py --mode=stills   # Phase A only")
    print("  python3 scripts/phase2-generate.py --mode=videos   # Phase B (requires stills)")
    print("  python3 scripts/phase2-generate.py --mode=full     # A, pause for approval, then B")

# ─── Execution modes ──────────────────────────────────────────────────

def run_stills(
    env: dict[str, str], only: set[str] | None = None
) -> dict[str, str]:
    """Returns slug → image_url map. If `only` is set, regenerate just those."""
    api_key = env.get("FREEPIK_API_KEY")
    if not api_key:
        sys.exit("FREEPIK_API_KEY missing in .env.local")
    manifest_path = STILLS_DIR / "manifest.json"
    # Start from existing manifest if present — lets us do partial retakes.
    results: dict[str, str] = {}
    if manifest_path.exists():
        results.update(json.loads(manifest_path.read_text()))
    to_run = [s for s in STILLS if (not only or s["slug"] in only)]
    print(f"Generating {len(to_run)} still(s) via Flux 1.1 Pro...")
    for spec in to_run:
        print(f"\n[{spec['slug']}] {spec['name']}")
        result = freepik_generate_still(api_key, spec)
        results[spec["slug"]] = result["image_url"]
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(results, indent=2))
    print(f"\n✓ {len(to_run)} still(s) regenerated. Manifest: {manifest_path}")
    return results

def _load_still_b64(slug: str) -> str:
    """Read a previously-downloaded still from disk and base64-encode it.
    Bypasses the Flux delivery URL's ~1-hour SAS-token TTL."""
    path = STILLS_DIR / f"{slug}.png"
    if not path.exists():
        sys.exit(
            f"  still '{slug}' not found at {path}. "
            "Run --mode=stills first."
        )
    return base64.b64encode(path.read_bytes()).decode("ascii")


def run_videos(
    env: dict[str, str],
    stills_manifest: dict[str, str] | None = None,
    only: set[str] | None = None,
) -> None:
    freepik_key = env.get("FREEPIK_API_KEY")
    fal_key = env.get("FAL_KEY")
    if not freepik_key:
        sys.exit("FREEPIK_API_KEY missing in .env.local")
    to_run = [v for v in VIDEO_TAKES if (not only or v["slug"] in only)]
    print(f"\nGenerating {len(to_run)} video take(s)...")
    # Cache base64 so identical image_ref across takes isn't re-encoded.
    b64_cache: dict[str, str] = {}
    for spec in to_run:
        print(f"\n[{spec['slug']}] {spec['name']}")
        ref = spec["image_ref"]
        if ref not in b64_cache:
            b64_cache[ref] = _load_still_b64(ref)
        image_b64 = b64_cache[ref]
        if spec["provider"] == "fal":
            if not fal_key:
                sys.exit("FAL_KEY missing in .env.local (needed for Veo3 01-A)")
            fal_generate_veo3(fal_key, spec, f"data:image/png;base64,{image_b64}")
        elif spec["provider"] == "fal-seedance":
            if not fal_key:
                sys.exit("FAL_KEY missing in .env.local (needed for fal Seedance)")
            fal_generate_seedance(fal_key, spec, f"data:image/png;base64,{image_b64}")
        else:
            freepik_generate_seedance(freepik_key, spec, image_b64)
    print(f"\n✓ {len(to_run)} take(s) done.")

def run_full(env: dict[str, str]) -> None:
    stills_manifest = run_stills(env)
    print("\n" + "━" * 60)
    input(
        "Review stills in " + str(STILLS_DIR) + ".\n"
        "Press ENTER when you've approved all 4 stills and want to proceed "
        "with the 6 video takes, or Ctrl+C to abort."
    )
    print("━" * 60)
    run_videos(env, stills_manifest)

# ─── Main ─────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--mode",
        choices=["dry-run", "stills", "videos", "full"],
        default="dry-run",
    )
    parser.add_argument(
        "--only",
        type=str,
        default="",
        help="Comma-separated slugs to run (e.g. 'env-a,env-b' for retakes).",
    )
    args = parser.parse_args()
    env = load_env()
    only = {s.strip() for s in args.only.split(",") if s.strip()} or None
    if args.mode == "dry-run":
        print_dry_run(env)
    elif args.mode == "stills":
        run_stills(env, only=only)
    elif args.mode == "videos":
        run_videos(env, only=only)
    elif args.mode == "full":
        run_full(env)

if __name__ == "__main__":
    main()
