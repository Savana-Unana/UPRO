import argparse
import json
import math
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy.signal import resample_poly


def db(value):
    return 20 * math.log10(max(float(value), 1e-12))


def signed(value):
    return f"{value:+.1f} dB"


def main():
    parser = argparse.ArgumentParser(description="Measure UPRO soundtrack loudness.")
    parser.add_argument("--target", type=float, default=-14.0)
    parser.add_argument("--ceiling", type=float, default=-1.0)
    parser.add_argument("--version", default=None)
    parser.add_argument("--output", default="output/reports/ost-loudness.md")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    songs = json.loads((root / "data/songs.json").read_text(encoding="utf-8"))
    results = []
    errors = []

    for song in songs:
        if args.version and song.get("Version") != args.version:
            continue
        relative = song.get("file")
        if not relative:
            continue
        path = root / relative
        if not path.exists():
            errors.append((song.get("name", "Unknown"), relative, "file not found"))
            continue
        try:
            audio, rate = sf.read(path, always_2d=True, dtype="float64")
            meter = pyln.Meter(rate)
            loudness = float(meter.integrated_loudness(audio))
            oversampled = resample_poly(audio, 4, 1, axis=0)
            peak = db(np.max(np.abs(oversampled)))
            desired = args.target - loudness
            safe = min(desired, args.ceiling - peak)
            results.append({
                "name": song.get("name", path.stem),
                "file": relative,
                "lufs": loudness,
                "peak": peak,
                "desired": desired,
                "gain": safe,
                "limited": safe < desired - 0.05,
            })
        except Exception as error:
            errors.append((song.get("name", "Unknown"), relative, str(error)))

    results.sort(key=lambda item: item["gain"], reverse=True)
    output = root / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# OST Loudness Equalization",
        "",
        f"Target: **{args.target:.1f} LUFS integrated**  ",
        f"True-peak ceiling: **{args.ceiling:.1f} dBTP**  ",
        *( [f"Version: **{args.version}**  "] if args.version else [] ),
        f"Measured playable tracks: **{len(results)}**",
        "",
        "The recommended gain is peak-safe. `Limited` means the ideal LUFS boost was reduced to preserve peak headroom; a limiter would be needed to hit the target exactly.",
        "",
        "| Song | Integrated | True peak | Ideal change | Recommended gain | Note |",
        "|---|---:|---:|---:|---:|---|",
    ]
    for item in results:
        note = "Limited" if item["limited"] else ""
        lines.append(
            f"| {item['name'].replace('|', '\\|')} | {item['lufs']:.1f} LUFS | "
            f"{item['peak']:.1f} dBTP | {signed(item['desired'])} | {signed(item['gain'])} | {note} |"
        )
    if errors:
        lines.extend(["", "## Files not measured", ""])
        lines.extend(f"- **{name}** (`{path}`): {error}" for name, path, error in errors)
    output.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Measured {len(results)} tracks; {len(errors)} errors; wrote {output}")


if __name__ == "__main__":
    main()
