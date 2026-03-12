#!/usr/bin/env python3
"""
Generate PITCH game images via online img2img API.
Jenny = brown hair, green eyes, round black glasses, purple hoodie, anime VN style.

Usage:
  python3 gen_pitch_images.py                    # generate all missing
  python3 gen_pitch_images.py sprites            # only Jenny condition sprites
  python3 gen_pitch_images.py backgrounds        # only bg_room + bg_stream
  python3 gen_pitch_images.py actions            # only sv_* action scenes
  python3 gen_pitch_images.py poster             # only poster
  python3 gen_pitch_images.py jenny_tired        # one specific image by name
  python3 gen_pitch_images.py --force            # regenerate all (overwrite)
"""

import datetime, hashlib, hmac, json, os, ssl, subprocess, sys, time
import urllib.parse, urllib.request, urllib.error
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
IMG_DIR    = os.path.join(SCRIPT_DIR, "src/Pitch/img")
REF_PATH   = os.path.join(IMG_DIR, "jenny_idle.png")

# ── API settings ──────────────────────────────────────────────────────────────
API_URL     = "http://aiservice.wdabuliu.com:8019/genl_image"
API_TIMEOUT = 360
RATE_WAIT   = 75

_SSL_CTX = ssl.create_default_context()
_SSL_CTX.check_hostname = False
_SSL_CTX.verify_mode    = ssl.CERT_NONE

# ── Cloudflare R2 ────────────────────────────────────────────────────────────
R2_ACCOUNT_ID = "bdccd2c68ff0d2e622994d24dbb1bae3"
R2_ACCESS_KEY = "b203adb7561b4f8800cbc1fa02424467"
R2_SECRET_KEY = "e7926e4175b7a0914496b9c999afd914cd1e4af7db8f83e0cf2bfad9773fa2b0"
R2_BUCKET     = "aigram"
R2_ENDPOINT   = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
R2_PUBLIC     = "https://images.aiwaves.tech"

# ── Jenny character base prompt ──────────────────────────────────────────────
JENNY_BASE = (
    "anime visual novel character sprite, full body standing pose, "
    "young woman, shoulder-length brown hair, green eyes, "
    "round black-framed glasses, purple lavender hoodie over white shirt, "
    "dark shorts, sneakers, pale skin, cute face, "
    "standing upright, feet visible, centered, "
    "solid flat bright green background #00FF00, green screen background, "
    "anime illustration style, soft cel shading, clean linework"
)

# ── Image definitions ─────────────────────────────────────────────────────────

SPRITES = [
    {
        "name": "jenny_idle",
        "group": "sprites",
        "green_screen": True,
        "prompt": JENNY_BASE + (
            ", neutral calm expression, gentle smile, "
            "relaxed standing pose, hands at sides"
        ),
    },
    {
        "name": "jenny_happy",
        "group": "sprites",
        "green_screen": True,
        "prompt": JENNY_BASE + (
            ", happy cheerful expression, bright smile, "
            "eyes sparkling with joy, slightly tilted head, "
            "energetic positive mood"
        ),
    },
    {
        "name": "jenny_sad",
        "group": "sprites",
        "green_screen": True,
        "prompt": JENNY_BASE + (
            ", sad melancholy expression, downcast eyes, "
            "slight frown, drooping shoulders, "
            "looking down, dejected mood"
        ),
    },
    {
        "name": "jenny_surprised",
        "group": "sprites",
        "green_screen": True,
        "prompt": JENNY_BASE + (
            ", surprised shocked expression, wide open eyes, "
            "open mouth, eyebrows raised high, "
            "taken aback pose"
        ),
    },
    {
        "name": "jenny_shy",
        "group": "sprites",
        "green_screen": True,
        "prompt": JENNY_BASE + (
            ", shy embarrassed expression, slight blush on cheeks, "
            "looking away slightly, one hand near face, "
            "bashful timid mood"
        ),
    },
    {
        "name": "jenny_tired",
        "group": "sprites",
        "green_screen": True,
        "prompt": JENNY_BASE + (
            ", tired exhausted expression, slight dark circles under eyes, "
            "half-lidded drowsy eyes, yawning or about to yawn, "
            "slightly messy hair, slouching slightly"
        ),
    },
    {
        "name": "jenny_focused",
        "group": "sprites",
        "green_screen": True,
        "prompt": JENNY_BASE + (
            ", intense focused determined expression, "
            "sharp alert eyes, slight furrowed brows, "
            "confident posture, looking straight ahead with purpose"
        ),
    },
    {
        "name": "jenny_stressed",
        "group": "sprites",
        "green_screen": True,
        "prompt": JENNY_BASE + (
            ", stressed anxious expression, "
            "worried eyes, biting lip slightly, "
            "hand touching forehead or temple, tense posture, "
            "slight sweat drop"
        ),
    },
    {
        "name": "jenny_worn",
        "group": "sprites",
        "green_screen": True,
        "prompt": JENNY_BASE + (
            ", mild fatigue state, "
            "slight dark circles under eyes, slightly tired half-lidded eyes, "
            "hair ends slightly messy, hoodie slightly wrinkled, "
            "mildly drained but still composed expression"
        ),
    },
    {
        "name": "jenny_rundown",
        "group": "sprites",
        "green_screen": True,
        "prompt": JENNY_BASE + (
            ", moderate exhaustion state, "
            "obvious dark circles under eyes, dull pale complexion, "
            "hair noticeably messy and unkempt, "
            "hunched posture, shoulders drooping forward, "
            "hollow tired eyes, blank distant expression, clearly worn out"
        ),
    },
    {
        "name": "jenny_wreck",
        "group": "sprites",
        "green_screen": True,
        "prompt": JENNY_BASE + (
            ", severe burnout and exhaustion state, "
            "deep sunken dark circles, very pale almost grey skin tone, "
            "hair very disheveled and messy, glasses slightly askew, "
            "hollow cheeks, completely dead flat eyes, "
            "heavily slouched posture barely upright, running on empty"
        ),
    },
    {
        "name": "jenny_manic",
        "group": "sprites",
        "green_screen": True,
        "prompt": JENNY_BASE + (
            ", manic overexcited state, "
            "wide wild eyes with intense energy, "
            "big slightly unhinged grin, messy energetic hair, "
            "leaning forward eagerly, too much caffeine energy, "
            "red tinted cheeks from overwork"
        ),
    },
]

BACKGROUNDS = [
    {
        "name": "bg_room",
        "group": "backgrounds",
        "green_screen": False,
        "crop": (432, 928),
        "prompt": (
            "vertical portrait composition, tall narrow scene, "
            "silicon valley startup office interior seen from inside, "
            "tall window on the right showing city skyline at golden hour, "
            "standing desk with laptop and dual monitors in the center, "
            "whiteboard with colorful sticky notes on the left wall, "
            "scattered coffee cups, potted plants on floor and shelf, "
            "modern minimalist furniture, warm wood floor, "
            "pendant lamp hanging from ceiling, cozy creative workspace, "
            "all elements arranged vertically top to bottom, "
            "anime background illustration style, highly detailed, no characters, "
            "warm soft natural lighting, pastel warm color palette"
        ),
    },
    {
        "name": "bg_stream",
        "group": "backgrounds",
        "green_screen": False,
        "crop": (432, 928),
        "prompt": (
            "vertical portrait composition, tall narrow scene, "
            "corporate investor meeting room interior, "
            "large presentation screen mounted high on the wall showing pitch deck with charts, "
            "long dark conference table below extending toward viewer, "
            "empty leather office chairs around the table, "
            "glass walls showing other offices in background, "
            "ceiling with modern panel lights, "
            "laptop and documents on the table, water glasses, "
            "all elements arranged vertically top to bottom, "
            "anime background illustration style, highly detailed, no characters, "
            "cool professional blue-grey tones, corporate atmosphere"
        ),
    },
]

ACTIONS = [
    {
        "name": "sv_desk",
        "group": "actions",
        "green_screen": False,
        "crop": (384, 288),
        "prompt": (
            "anime illustration, cozy startup office desk scene, "
            "laptop with code on screen, coffee cup steaming, "
            "sticky notes and notebooks, warm morning light from window, "
            "no characters, soft pastel colors, detailed interior"
        ),
    },
    {
        "name": "sv_rest",
        "group": "actions",
        "green_screen": False,
        "crop": (384, 288),
        "prompt": (
            "anime illustration, cozy bedroom scene, "
            "unmade bed with soft blankets, alarm clock showing early morning, "
            "curtains letting in soft light, peaceful sleeping atmosphere, "
            "no characters, warm muted colors"
        ),
    },
    {
        "name": "sv_eat",
        "group": "actions",
        "green_screen": False,
        "crop": (384, 288),
        "prompt": (
            "anime illustration, takeout food on office desk, "
            "ramen bowl, energy drinks, snack wrappers, "
            "laptop pushed to the side, late night coding fuel, "
            "no characters, warm cozy lighting"
        ),
    },
    {
        "name": "sv_phone",
        "group": "actions",
        "green_screen": False,
        "crop": (384, 288),
        "prompt": (
            "anime illustration, smartphone on desk showing chat messages, "
            "family photos in background, warm desk lamp light, "
            "cozy personal moment, nighttime window view, "
            "no characters, soft emotional atmosphere"
        ),
    },
    {
        "name": "sv_walk",
        "group": "actions",
        "green_screen": False,
        "crop": (384, 288),
        "prompt": (
            "anime illustration, silicon valley street scene, "
            "palm trees, tech company buildings, morning sunlight, "
            "jogging path along green park, clear blue sky, "
            "no characters, fresh bright colors, wide shot"
        ),
    },
    {
        "name": "sv_setup",
        "group": "actions",
        "green_screen": False,
        "crop": (384, 288),
        "prompt": (
            "anime illustration, startup whiteboard brainstorming session, "
            "whiteboard covered with diagrams and user flow charts, "
            "post-it notes in multiple colors, markers, "
            "no characters, creative workspace, bright daylight"
        ),
    },
    {
        "name": "sv_relax",
        "group": "actions",
        "green_screen": False,
        "crop": (384, 288),
        "prompt": (
            "anime illustration, cozy living room scene, "
            "TV screen showing netflix, blanket on couch, "
            "dim warm lighting, cup of tea, relaxing evening, "
            "no characters, comfortable home atmosphere"
        ),
    },
    {
        "name": "sv_video",
        "group": "actions",
        "green_screen": False,
        "crop": (384, 288),
        "prompt": (
            "anime illustration, video call meeting setup, "
            "laptop screen showing grid of video call participants, "
            "ring light, professional background, home office, "
            "no characters shown in room, tech startup atmosphere"
        ),
    },
    {
        "name": "sv_game",
        "group": "actions",
        "green_screen": False,
        "crop": (384, 288),
        "prompt": (
            "anime illustration, competitive analysis research scene, "
            "multiple browser tabs open on monitor showing app interfaces, "
            "notepad with comparison notes, coffee cup, "
            "focused analytical workspace, no characters, evening lighting"
        ),
    },
]

POSTER = [
    {
        "name": "poster",
        "group": "poster",
        "green_screen": False,
        "crop": (432, 928),
        "prompt": (
            "vertical portrait composition, tall narrow poster, "
            "modern SaaS startup splash screen design, "
            "large bold text 'PITCH' centered in upper third, "
            "subtitle 'Series A or Bust' below title, "
            "anime girl silhouette sitting with laptop in lower half, "
            "city skyline silhouette at bottom, "
            "gradient purple to indigo background (#6366f1 to #8b5cf6), "
            "minimalist tech aesthetic, clean typography, "
            "all content centered vertically, mobile app style"
        ),
    },
]

ALL_TASKS = SPRITES + BACKGROUNDS + ACTIONS + POSTER

# ── R2 Upload ────────────────────────────────────────────────────────────────

def _r2_sign(key: bytes, msg: str) -> bytes:
    return hmac.new(key, msg.encode(), hashlib.sha256).digest()


def upload_ref(path: str) -> str:
    """Upload ref image to Cloudflare R2 → public CDN URL."""
    with open(path, 'rb') as f:
        data = f.read()

    obj_key    = "refs/" + os.path.basename(path)
    host       = f"{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
    now        = datetime.datetime.utcnow()
    amz_date   = now.strftime("%Y%m%dT%H%M%SZ")
    date_stamp = now.strftime("%Y%m%d")

    content_type = "image/png"
    content_hash = hashlib.sha256(data).hexdigest()
    canon_uri    = "/" + R2_BUCKET + "/" + urllib.parse.quote(obj_key, safe="/")

    canon_headers = (
        f"content-type:{content_type}\n"
        f"host:{host}\n"
        f"x-amz-content-sha256:{content_hash}\n"
        f"x-amz-date:{amz_date}\n"
    )
    signed_headers = "content-type;host;x-amz-content-sha256;x-amz-date"

    canon_req = "\n".join([
        "PUT", canon_uri, "",
        canon_headers, signed_headers, content_hash,
    ])

    cred_scope     = f"{date_stamp}/auto/s3/aws4_request"
    string_to_sign = "\n".join([
        "AWS4-HMAC-SHA256", amz_date, cred_scope,
        hashlib.sha256(canon_req.encode()).hexdigest(),
    ])

    k = _r2_sign(("AWS4" + R2_SECRET_KEY).encode(), date_stamp)
    k = _r2_sign(k, "auto")
    k = _r2_sign(k, "s3")
    k = _r2_sign(k, "aws4_request")
    sig = hmac.new(k, string_to_sign.encode(), hashlib.sha256).hexdigest()

    auth = (
        f"AWS4-HMAC-SHA256 Credential={R2_ACCESS_KEY}/{cred_scope}, "
        f"SignedHeaders={signed_headers}, Signature={sig}"
    )

    url = f"{R2_ENDPOINT}/{R2_BUCKET}/{urllib.parse.quote(obj_key, safe='/')}"
    req = urllib.request.Request(url, data=data, method="PUT", headers={
        "Content-Type": content_type,
        "x-amz-content-sha256": content_hash,
        "x-amz-date": amz_date,
        "Authorization": auth,
        "Content-Length": str(len(data)),
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        r.read()

    return f"{R2_PUBLIC}/{obj_key}"


# ── API helpers ──────────────────────────────────────────────────────────────

def call_api(ref_url: str | None, prompt: str) -> str | None:
    """Call img2img (with ref) or txt2img (without ref). Returns CDN URL."""
    params = {"prompt": prompt, "user_id": 123456}
    if ref_url:
        params["url"] = ref_url

    payload = json.dumps({"query": "", "params": params}).encode()
    req = urllib.request.Request(
        API_URL, data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=API_TIMEOUT) as r:
            result = json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        try:
            result = json.loads(body)
        except Exception:
            print(f"  ✗ HTTP {e.code}: {body[:200]}")
            return None

    code = result.get("code")
    if code == 200:
        return result["url"]
    if code == 429:
        raise RuntimeError("rate_limit")
    print(f"  ✗ API code={code}")
    return None


def download_image(url: str, out_path: str):
    """Download image; convert to PNG if needed."""
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60, context=_SSL_CTX) as r:
        data = r.read()

    ext = os.path.splitext(url.split("?")[0])[1].lower()
    if ext and ext != ".png":
        tmp = out_path + ext
        with open(tmp, "wb") as f:
            f.write(data)
        subprocess.run(["sips", "-s", "format", "png", tmp, "--out", out_path],
                       check=True, capture_output=True)
        os.remove(tmp)
    else:
        with open(out_path, "wb") as f:
            f.write(data)


def remove_green(img_path: str, threshold=55, feather=25):
    """Remove green screen background (global pixel removal)."""
    img  = Image.open(img_path).convert("RGBA")
    data = img.load()
    w, h = img.size
    removed = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = data[x, y]
            greenness = g - max(r, b)
            if greenness > threshold:
                alpha = 1.0 - min(1.0, (greenness - threshold) / feather)
                data[x, y] = (r, g, b, int(a * alpha))
                removed += 1
    img.save(img_path)
    pct = removed * 100 // (w * h)
    print(f"  ✓ green removed ({pct}% pixels affected)")


def crop_and_resize(img_path: str, target_w: int, target_h: int):
    """Crop center to target aspect ratio, then resize."""
    img = Image.open(img_path)
    w, h = img.size
    target_ratio = target_w / target_h
    current_ratio = w / h

    if current_ratio > target_ratio:
        # Too wide — crop sides
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        img = img.crop((left, 0, left + new_w, h))
    elif current_ratio < target_ratio:
        # Too tall — crop top/bottom
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        img = img.crop((0, top, w, top + new_h))

    img = img.resize((target_w, target_h), Image.LANCZOS)
    img.save(img_path)
    print(f"  ✓ cropped & resized to {target_w}×{target_h}")


# ── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    args  = sys.argv[1:]
    force = "--force" in args
    args  = [a for a in args if a != "--force"]
    target = args[0] if args else None

    # Filter tasks by group or name
    if target in ("sprites", "backgrounds", "actions", "poster"):
        tasks = [t for t in ALL_TASKS if t["group"] == target]
    elif target:
        tasks = [t for t in ALL_TASKS if t["name"] == target]
        if not tasks:
            print(f"'{target}' not found. Available:")
            for t in ALL_TASKS:
                print(f"  {t['name']} ({t['group']})")
            sys.exit(1)
    else:
        tasks = ALL_TASKS

    print(f"PITCH image generator — {len(tasks)} task(s)\n")

    # Upload jenny_idle.png as ref for sprites
    ref_url = None
    needs_ref = any(t["green_screen"] for t in tasks)
    if needs_ref:
        print("Uploading Jenny reference to R2…")
        try:
            ref_url = upload_ref(REF_PATH)
            print(f"  ✓ {ref_url}\n")
        except Exception as e:
            print(f"  ✗ R2 upload failed: {e}")
            print("  Falling back: using jenny_idle.png as ref via R2 retry…")
            sys.exit(1)

    success = 0
    for i, task in enumerate(tasks):
        name     = task["name"]
        out_path = os.path.join(IMG_DIR, f"{name}.png")

        if not force and os.path.exists(out_path):
            # Check if it's a placeholder (same size as another file = copy)
            idle_size = os.path.getsize(os.path.join(IMG_DIR, "jenny_idle.png"))
            if os.path.getsize(out_path) != idle_size and task["green_screen"]:
                print(f"[{i+1}/{len(tasks)}] {name} — exists, skipping (use --force)")
                continue
            elif not task["green_screen"]:
                # For non-sprite assets, skip only if --force not set
                print(f"[{i+1}/{len(tasks)}] {name} — exists, skipping (use --force)")
                continue

        print(f"[{i+1}/{len(tasks)}] {name}")
        print(f"  prompt: {task['prompt'][:90]}…")

        # Use ref for sprites (img2img), no ref for scenes (txt2img with ref for style)
        use_ref = ref_url if task["green_screen"] else ref_url

        # Call API with retry on rate limit
        cdn_url = None
        while True:
            try:
                cdn_url = call_api(use_ref, task["prompt"])
                break
            except RuntimeError:
                print(f"  ⏳ rate limited — waiting {RATE_WAIT}s…")
                time.sleep(RATE_WAIT)

        if not cdn_url:
            print(f"  ✗ generation failed, skipping")
            if i < len(tasks) - 1:
                print(f"  ⏳ waiting {RATE_WAIT}s…")
                time.sleep(RATE_WAIT)
            continue

        # Download
        print(f"  ↓ downloading…")
        try:
            download_image(cdn_url, out_path)
        except Exception as e:
            print(f"  ✗ download failed: {e}")
            if i < len(tasks) - 1:
                print(f"  ⏳ waiting {RATE_WAIT}s…")
                time.sleep(RATE_WAIT)
            continue

        # Remove green screen for sprites
        if task["green_screen"]:
            print(f"  removing green screen…")
            remove_green(out_path)

        # Crop & resize to target dimensions
        if "crop" in task:
            tw, th = task["crop"]
            crop_and_resize(out_path, tw, th)

        size_kb = os.path.getsize(out_path) // 1024
        print(f"  ✓ saved {name}.png ({size_kb} KB)")
        success += 1

        # Wait between requests
        if i < len(tasks) - 1:
            print(f"  ⏳ waiting {RATE_WAIT}s…")
            time.sleep(RATE_WAIT)

    print(f"\n── Done: {success}/{len(tasks)} generated ──")
    print(f"Output: {IMG_DIR}")
