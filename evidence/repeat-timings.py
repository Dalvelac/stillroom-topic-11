"""Measure the same public catalogue document using curl and three local proxy listeners."""
import csv
import hashlib
import math
import os
from pathlib import Path
import statistics
import subprocess
import sys
import tempfile

# For the installed shop use 8770. The evidence run served a clean fixture on 18770.
port = int(os.environ.get("STILLROOM_PORT", "8770"))
url = f"http://127.0.0.1:{port}/?q=Roaster%27s&category=coffee&sort=price-asc"
paths = [("Direct", None), ("Burp", 8080), ("ZAP", 8092), ("mitmdump", 8093)]
output = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("latency.csv")
rows = []
expected = None
with tempfile.TemporaryDirectory() as temp:
    page = Path(temp) / "body"
    def sample(path):
        name, listener = path
        args = ["curl", "--disable", "--silent", "--show-error", "--max-time", "5"]
        if listener:
            args += ["--noproxy", "", "--proxy", f"http://127.0.0.1:{listener}"]
        else:
            args += ["--noproxy", "*"]
        args += ["--output", str(page), "--write-out", "%{http_code} %{time_total}", url]
        status, elapsed = subprocess.check_output(args, text=True).split()
        digest = hashlib.sha256(page.read_bytes()).hexdigest()
        if status != "200" or (expected is not None and digest != expected):
            raise RuntimeError(f"Unexpected result for {name}: {status}, body digest {digest}")
        return digest, float(elapsed) * 1000

    for _ in range(4):
        for path in paths:
            expected, _ = sample(path)

    for index in range(32):
        rotation = index % len(paths)
        for position, path in enumerate(paths[rotation:] + paths[:rotation], start=1):
            digest, ms = sample(path)
            rows.append((index + 1, position, path[0], f"{ms:.3f}", 200, digest))

with output.open("x", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(("round", "position", "path", "curl_total_ms", "http_status", "body_sha256"))
    writer.writerows(rows)
for name, _ in paths:
    numbers = sorted(float(row[3]) for row in rows if row[2] == name)
    print(f"{name:9}  n={len(numbers)}  median={statistics.median(numbers):.3f} ms"
          f"  p95={numbers[math.ceil(.95 * len(numbers))-1]:.3f} ms")
