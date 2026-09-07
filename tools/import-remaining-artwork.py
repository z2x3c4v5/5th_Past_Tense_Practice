"""Import the final 13 approved scenes without changing any existing artwork or teaching data."""
import concurrent.futures
import copy
import hashlib
import io
import json
import os
from pathlib import Path
import re
import subprocess
import time
import urllib.parse
import urllib.request
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
TARGETS = {'went', 'made', 'helped', 'cleaned', 'cooked', 'closed', 'saw', 'sang', 'gave', 'took', 'looked', 'wanted', 'liked'}
VERSION = 'artwork-20260908-complete'
manifest = json.loads(Path('tools/remaining-artwork-manifest.json').read_text())
source = Path('worksheet.js').read_text()
index = Path('index.html').read_text()
existing_images = {str(p): hashlib.sha256(p.read_bytes()).hexdigest() for p in Path('img').rglob('*') if p.is_file()}
assert len(list(Path('img').glob('*.png'))) == 21
assert len(list(Path('img/supplementary').glob('*.webp'))) == 17
preserved = {str(p): hashlib.sha256(p.read_bytes()).hexdigest() for p in [Path('app.js'), Path('style.css'), Path('illustrations.js'), Path('worksheets/past_tense_worksheet.docx')]}

def lesson_data(text):
    script = "const vm=require('node:vm');const fs=require('node:fs');const c={};vm.createContext(c);vm.runInContext(fs.readFileSync(0,'utf8')+';globalThis.result={question:QUESTION,style:IMAGE_STYLE,days:WORKSHEET_DAYS,textbook:TEXTBOOK,meanings:WORD_MEANINGS};',c);process.stdout.write(JSON.stringify(c.result));"
    return json.loads(subprocess.check_output(['node', '-e', script], input=text.encode()))

before = lesson_data(source)
rows = [r for d in before['days'] for r in d['rows']]
assert len(rows) == 51
assert {r['past'] for r in rows if not r.get('img')} == TARGETS
entries = manifest['images']
assert len(entries) == 13 and {e['past'] for e in entries} == TARGETS

def download(e):
    assert re.fullmatch('[a-z]+', e['past'])
    query = urllib.parse.urlencode({
        'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
        'X-Amz-Credential': manifest['access_key'] + '/' + e['date'][:8] + '/us-east-1/s3/aws4_request',
        'X-Amz-Date': e['date'], 'X-Amz-Expires': str(e['expires']),
        'X-Amz-Signature': e['signature'], 'X-Amz-SignedHeaders': 'host',
        'response-expires': manifest['response_expires'],
    }, quote_via=urllib.parse.quote)
    # Exact signed file references from Canva; these are NOT runtime dependencies.
    url = manifest['base_url'] + f"{e['page']:04d}.png?" + query
    assert urllib.parse.urlsplit(url).hostname == 's3.amazonaws.com'
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'PastTenseArtworkImport/2.0'})
            with urllib.request.urlopen(req, timeout=35) as response:
                assert response.status == 200
                data = response.read(12000001)
            assert 1000 < len(data) <= 12000000
            image = Image.open(io.BytesIO(data)).convert('RGB')
            assert image.width >= 400 and image.height >= 320
            image.thumbnail((550, 450), Image.Resampling.LANCZOS)
            output = io.BytesIO()
            image.save(output, format='WEBP', quality=90, method=6)
            return e['past'], output.getvalue(), image
        except Exception:
            if attempt == 2:
                raise
            time.sleep(attempt + 1)

# Do not touch any app file until every image is decoded successfully.
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    images = list(pool.map(download, entries))

new_source = source
for past, data, image in images:
    pattern = re.compile(r'^(\s*row\([^\n]*?,\s*"' + re.escape(past) + r'",[^\n]*?\{ )(?=prompt:)', re.MULTILINE)
    new_source, count = pattern.subn(lambda m: m.group(1) + 'img: "img/supplementary/' + past + '.webp", ', new_source)
    assert count == 1, (past, count)

after = lesson_data(new_source)
normalized = copy.deepcopy(after)
for collection in ([r for d in normalized['days'] for r in d['rows']], normalized['textbook']):
    for row in collection:
        if row['past'] in TARGETS:
            assert row.pop('img') == 'img/supplementary/' + row['past'] + '.webp'
assert normalized == before, 'Unexpected change to teaching data or existing image mappings.'
all_rows = [r for d in after['days'] for r in d['rows']]
assert all(r.get('img', '').startswith('img/') for r in all_rows)
assert len({r['img'] for r in all_rows}) == 51

new_index, count = re.subn(r'<script src="worksheet\.js(?:\?[^"\s]*)?"></script>', '<script src="worksheet.js?v=' + VERSION + '"></script>', index)
assert count == 1
verification_path = Path('.github/workflows/verify-production-artwork.yml')
verification = verification_path.read_text()
assert 'artwork-20260907-1' in verification and 'assert len(paths) >= 38' in verification
verification = verification.replace('artwork-20260907-1', VERSION).replace('assert len(paths) >= 38', 'assert len(paths) == 51')

for past, data, image in images:
    path = Path('img/supplementary') / (past + '.webp')
    assert not path.exists(), 'Never overwrite an existing image.'
    path.write_bytes(data)
Path('worksheet.js').write_text(new_source)
Path('index.html').write_text(new_index)
verification_path.write_text(verification)
for name, digest in {**existing_images, **preserved}.items():
    assert hashlib.sha256(Path(name).read_bytes()).hexdigest() == digest, name
for path in ['worksheet.js', 'app.js', 'illustrations.js']:
    subprocess.run(['node', '--check', path], check=True)
for row in all_rows:
    with Image.open(row['img']) as image:
        image.verify()

report = {
    'added_count': 13,
    'added': [p for p, _, _ in images],
    'original_worksheet_images_preserved': 21,
    'previous_supplementary_images_preserved': 17,
    'existing_files_sha256': {**existing_images, **preserved},
    'total_local_images': 51,
    'lesson_rows_unchanged': 51,
    'image_paths': [r['img'] for r in all_rows],
    'all_lesson_data_preserved': True,
    'app_speech_and_styles_unchanged': True,
}
Path('tools/remaining-artwork-report.json').write_text(json.dumps(report, indent=2))
contact = Image.new('RGB', (1100, 1000), 'white')
draw = ImageDraw.Draw(contact)
for i, (past, _, image) in enumerate(images):
    thumb = image.copy()
    thumb.thumbnail((265, 217))
    x, y = (i % 4) * 275, (i // 4) * 250
    contact.paste(thumb, (x, y))
    draw.text((x + 8, y + 223), past, fill='black')
contact.save('remaining-artwork-contact.jpg', quality=90)
print(json.dumps({k: v for k, v in report.items() if k != 'existing_files_sha256'}, indent=2))
with open(os.environ.get('GITHUB_STEP_SUMMARY', os.devnull), 'a') as out:
    out.write('## Final 13 images imported\n\nExisting worksheet PNGs: **21 unchanged**.\n\nPreviously deployed WebPs: **17 unchanged**.\n\nAll **51** lesson rows now have fixed local images.\n\nLesson content, ordering, speech code, styles, and Word worksheet are unchanged.\n')
