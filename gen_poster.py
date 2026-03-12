#!/usr/bin/env python3
"""Regenerate PITCH poster as 1:1 square, using jenny_idle.png as reference."""

import datetime, hashlib, hmac, json, os, ssl, subprocess, sys, time
import urllib.parse, urllib.request, urllib.error
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
IMG_DIR    = os.path.join(SCRIPT_DIR, "src/Pitch/img")
REF_PATH   = os.path.join(IMG_DIR, "jenny_idle.png")
OUT_PATH   = os.path.join(IMG_DIR, "poster.png")

API_URL     = "http://aiservice.wdabuliu.com:8019/genl_image"
API_TIMEOUT = 360

_SSL_CTX = ssl.create_default_context()
_SSL_CTX.check_hostname = False
_SSL_CTX.verify_mode    = ssl.CERT_NONE

R2_ACCOUNT_ID = "bdccd2c68ff0d2e622994d24dbb1bae3"
R2_ACCESS_KEY = "b203adb7561b4f8800cbc1fa02424467"
R2_SECRET_KEY = "e7926e4175b7a0914496b9c999afd914cd1e4af7db8f83e0cf2bfad9773fa2b0"
R2_BUCKET     = "aigram"
R2_ENDPOINT   = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
R2_PUBLIC     = "https://images.aiwaves.tech"

POSTER_PROMPT = (
    "square 1:1 composition, game cover art, anime illustration, "
    "young woman with shoulder-length brown hair, green eyes, round black-framed glasses, "
    "purple lavender hoodie, sitting at desk with laptop, confident smile, "
    "cyberpunk neon city skyline visible through large window behind her, "
    "dark moody atmosphere, purple and indigo lighting, "
    "large stylized text 'PITCH' glowing in neon above her, "
    "startup office environment, monitors and code on screens, "
    "cinematic composition, high detail, anime visual novel style, soft cel shading"
)


def _r2_sign(key: bytes, msg: str) -> bytes:
    return hmac.new(key, msg.encode(), hashlib.sha256).digest()


def upload_ref(path: str) -> str:
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
    canon_req = "\n".join(["PUT", canon_uri, "", canon_headers, signed_headers, content_hash])
    cred_scope = f"{date_stamp}/auto/s3/aws4_request"
    string_to_sign = "\n".join([
        "AWS4-HMAC-SHA256", amz_date, cred_scope,
        hashlib.sha256(canon_req.encode()).hexdigest(),
    ])
    k = _r2_sign(("AWS4" + R2_SECRET_KEY).encode(), date_stamp)
    k = _r2_sign(k, "auto"); k = _r2_sign(k, "s3"); k = _r2_sign(k, "aws4_request")
    sig = hmac.new(k, string_to_sign.encode(), hashlib.sha256).hexdigest()
    auth = (f"AWS4-HMAC-SHA256 Credential={R2_ACCESS_KEY}/{cred_scope}, "
            f"SignedHeaders={signed_headers}, Signature={sig}")
    url = f"{R2_ENDPOINT}/{R2_BUCKET}/{urllib.parse.quote(obj_key, safe='/')}"
    req = urllib.request.Request(url, data=data, method="PUT", headers={
        "Content-Type": content_type, "x-amz-content-sha256": content_hash,
        "x-amz-date": amz_date, "Authorization": auth, "Content-Length": str(len(data)),
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        r.read()
    return f"{R2_PUBLIC}/{obj_key}"


def call_api(ref_url: str, prompt: str) -> str | None:
    params = {"prompt": prompt, "user_id": 123456, "url": ref_url}
    payload = json.dumps({"query": "", "params": params}).encode()
    req = urllib.request.Request(
        API_URL, data=payload,
        headers={"Content-Type": "application/json"}, method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=API_TIMEOUT) as r:
            result = json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  ✗ HTTP {e.code}: {body[:200]}")
        return None
    code = result.get("code")
    if code == 200:
        return result["url"]
    if code == 429:
        print("  ✗ Rate limited, wait 75s and retry")
        return None
    print(f"  ✗ API code={code}")
    return None


def download_image(url: str, out_path: str):
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


if __name__ == "__main__":
    print("=== PITCH Poster Generator (1:1, with Jenny ref) ===\n")

    # Upload ref
    print("Uploading jenny_idle.png to R2…")
    ref_url = upload_ref(REF_PATH)
    print(f"  ✓ {ref_url}\n")

    # Generate
    print("Generating poster…")
    cdn_url = call_api(ref_url, POSTER_PROMPT)
    if not cdn_url:
        print("Failed! Try again later.")
        sys.exit(1)
    print(f"  ✓ {cdn_url}\n")

    # Download
    print("Downloading…")
    download_image(cdn_url, OUT_PATH)
    print(f"  ✓ saved to {OUT_PATH}\n")

    # API outputs 1024×1024, which is already 1:1 — just resize to 512×512
    img = Image.open(OUT_PATH)
    w, h = img.size
    print(f"  Raw size: {w}×{h}")
    target = 512
    if w != target or h != target:
        # Center crop to 1:1 if needed, then resize
        side = min(w, h)
        left = (w - side) // 2
        top  = (h - side) // 2
        img = img.crop((left, top, left + side, top + side))
        img = img.resize((target, target), Image.LANCZOS)
        img.save(OUT_PATH)
        print(f"  ✓ Resized to {target}×{target}")
    else:
        img = img.resize((target, target), Image.LANCZOS)
        img.save(OUT_PATH)
        print(f"  ✓ Resized to {target}×{target}")

    print("\nDone! Poster saved as poster.png (512×512)")
