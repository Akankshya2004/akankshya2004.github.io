import json
from pathlib import Path


GALLERY_DIR = Path(__file__).resolve().parents[1] / "Assets" / "gallery"
MANIFEST_PATH = GALLERY_DIR / "gallery.json"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def main() -> None:
    if not GALLERY_DIR.exists():
        raise SystemExit(f"Gallery folder not found: {GALLERY_DIR}")

    images = sorted(
        f"Assets/gallery/{path.name}"
        for path in GALLERY_DIR.iterdir()
        if path.is_file() and path.suffix.lower() in ALLOWED_EXTENSIONS
    )

    MANIFEST_PATH.write_text(json.dumps(images, indent=2), encoding="utf-8")
    print(f"Wrote {len(images)} images to {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
