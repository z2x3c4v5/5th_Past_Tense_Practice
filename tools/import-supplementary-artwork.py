"""One-time import of generated artwork; never overwrite worksheet images."""
import concurrent.futures
import hashlib
import io
import json
from pathlib import Path
import re
import subprocess
import time
import urllib.parse
import urllib.request
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'tools/supplementary-artwork-manifest.json').read_text())
source = (ROOT / 'worksheet.js').read_text()
index = (ROOT / 'index.html').read_text()
originals = {p.as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT / 'img').glob('*.png')}
assert len(originals) == 21, 'Original image set changed; review before importing.'

def lesson_data(text):
    script = "const vm=require('node:vm');const fs=require('node:fs');const c={};vm.createContext(c);vm.runInContext(fs.readFileSync(0,'utf8')+';globalThis.result={days:WORKSHEET_DAYS,textbook:TEXTBOOK};',c);process.stdout.write(JSON.stringify(c.result));"
    return json.loads(subprocess.check_output(['node', '-e', script], input=text.encode(), cwd=ROOT))

before = lesson_data(source)
rows = [r for d in before['days'] for r in d['rows']]
assert len(rows) == 51
by_past = {r['past']: r for r in rows}
entries = manifest['images']
assert len(entries) == len({e['past'] for e in entries})
for e in entries:
    assert re.fullmatch('[a-z]+', e['past'])
    assert e['past'] in by_past and not by_past[e['past']].get('img'), 'Do not replace an existing image.'

def download(e):
    # These are the exact signed download fields returned by Canva, not live app dependencies.
    day = e['date'][:8]
    query = urllib.parse.urlencode({
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        'X-Amz-Credential': manifest['access_key'] + '/' + day + '/us-east-1/s3/aws4_request',
        'X-Amz-Date': e['date'], 'X-Amz-Expires': str(e['expires']),
        'X-Amz-Signature': e['signature'], 'X-Amz-SignedHeaders': 'host',
        'response-expires': manifest['response_expires'],
    }, quote_via=urllib.parse.quote)
    url = manifest['base_url'] + f"{e['page']:04d}.png?" + query
    assert urllib.parse.urlsplit(url).hostname == 's3.amazonaws.com'
    last = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'PastTenseArtworkImport/1.0'})
            with urllib.request.urlopen(req, timeout=40) as response:
                data = response.read(12000001)
            assert 1000 < len(data) <= 12000000
            im = Image.open(io.BytesIO(data)).convert('RGB')
            assert im.width >= 300 and im.height >= 240
            im.thumbnail((550, 450), Image.Resampling.LANCZOS)
            output = io.BytesIO()
            im.save(output, format='WEBP', quality=88, method=6)
            return e['past'], output.getvalue(), im.size
        except Exception as exc:
            last = exc
            time.sleep(attempt + 1)
    raise RuntimeError('Could not import ' + e['past']) from last

# Complete all downloads before changing any repository file.
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    images = list(pool.map(download, entries))

new_source = source
for past, data, size in images:
    pattern = re.compile(r'^(\s*row\([^\n]*?,\s*"' + re.escape(past) + r'",[^\n]*?\{ )(?=prompt:)', re.MULTILINE)
    new_source, count = pattern.subn(lambda m: m.group(1) + 'img: "img/supplementary/' + past + '.webp", ', new_source)
    assert count == 1, (past, count)

after = lesson_data(new_source)
# Strip only the newly added img property and require all teaching data to be identical.
for collection in ([r for d in after['days'] for r in d['rows']], after['textbook']):
    for r in collection:
        if r.get('img', '').startswith('img/supplementary/'):
            del r['img']
assert after == before, 'Unexpected change to words, sentences, order, or textbook data.'

folder = ROOT / 'img/supplementary'
folder.mkdir(parents=True, exist_ok=True)
for past, data, size in images:
    path = folder / (past + '.webp')
    assert not path.exists(), 'Never overwrite an existing asset.'
    path.write_bytes(data)
(ROOT / 'worksheet.js').write_text(new_source)
assert '<script src="worksheet.js"></script>' in index
(ROOT / 'index.html').write_text(index.replace('<script src="worksheet.js"></script>', '<script src="worksheet.js?v=artwork-20260907-1"></script>'))
for name, digest in originals.items():
    assert hashlib.sha256(Path(name).read_bytes()).hexdigest() == digest
subprocess.run(['node', '--check', 'worksheet.js'], cwd=ROOT, check=True)
subprocess.run(['node', '--check', 'app.js'], cwd=ROOT, check=True)
print(json.dumps({'imported': len(images), 'original_pngs_preserved': len(originals), 'lesson_rows_unchanged': len(rows), 'new_images': [p for p, _, _ in images]}, indent=2))
