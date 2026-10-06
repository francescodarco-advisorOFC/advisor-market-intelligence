"""Completa il .docx generato: incorpora anche Bold e Italic di Libre Baskerville
(docx-js incorpora solo il Regular) e crea la versione .dotx (modello di Word).

Uso: python3 design/word/finalize.py <input.docx> <cartella-font> <output.docx> <output.dotx>
"""
import re
import sys
import uuid
import zipfile

src, font_dir, out_docx, out_dotx = sys.argv[1:5]

DOCX_MAIN = "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"
DOTX_MAIN = "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml"
REL_FONT = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/font"


def obfuscate(data: bytes, key: str) -> bytes:
    """Algoritmo OOXML: XOR dei primi 32 byte con i byte del GUID in ordine inverso."""
    hexkey = key.replace("-", "").strip("{}")
    kb = [int(hexkey[i:i + 2], 16) for i in range(0, 32, 2)][::-1]
    head = bytes(b ^ kb[i % 16] for i, b in enumerate(data[:32]))
    return head + data[32:]


with zipfile.ZipFile(src) as z:
    files = {n: z.read(n) for n in z.namelist()}

font_table = files["word/fontTable.xml"].decode()
rels_name = "word/_rels/fontTable.xml.rels"
rels = files[rels_name].decode()

extra = []
for tag, fname in (("w:embedBold", "LibreBaskerville-Bold.ttf"), ("w:embedItalic", "LibreBaskerville-Italic.ttf")):
    key = "{" + str(uuid.uuid4()).upper() + "}"
    rid = f"rIdAdv{tag.split(':embed')[1]}"
    part = f"fonts/{fname.replace('.ttf', '.odttf')}"
    with open(f"{font_dir}/{fname}", "rb") as f:
        files[f"word/{part}"] = obfuscate(f.read(), key)
    rels = rels.replace("</Relationships>", f'<Relationship Id="{rid}" Type="{REL_FONT}" Target="{part}"/></Relationships>')
    extra.append(f'<{tag} r:id="{rid}" w:fontKey="{key}"/>')

# inserisce embedBold/embedItalic subito dopo embedRegular del font Libre Baskerville
pattern = re.compile(r'(<w:font w:name="Libre Baskerville">.*?<w:embedRegular[^>]*/>)', re.S)
font_table, n = pattern.subn(lambda m: m.group(1) + "".join(extra), font_table, count=1)
if n != 1:
    sys.exit("embedRegular di Libre Baskerville non trovato in fontTable.xml")
# lo schema richiede il GUID in maiuscolo (docx-js lo scrive in minuscolo)
font_table = re.sub(r'w:fontKey="(\{[^"]+\})"', lambda m: f'w:fontKey="{m.group(1).upper()}"', font_table)
files["word/fontTable.xml"] = font_table.encode()
files[rels_name] = rels.encode()

# salva anche i font usati con il documento (Word: "Incorpora i caratteri nel file")
# (lo schema vuole embedTrueTypeFonts dopo displayBackgroundShape)
settings = files["word/settings.xml"].decode().replace("<w:embedTrueTypeFonts/>", "")
if "<w:displayBackgroundShape/>" in settings:
    settings = settings.replace("<w:displayBackgroundShape/>", "<w:displayBackgroundShape/><w:embedTrueTypeFonts/>", 1)
else:
    settings = re.sub(r"(<w:settings[^>]*>)", r"\1<w:embedTrueTypeFonts/>", settings, count=1)
files["word/settings.xml"] = settings.encode()


def write(path, content_types):
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        for name, data in files.items():
            if name != "[Content_Types].xml":
                z.writestr(name, data)


ct = files["[Content_Types].xml"].decode()
write(out_docx, ct)
write(out_dotx, ct.replace(DOCX_MAIN, DOTX_MAIN))
print("scritti", out_docx, out_dotx)
