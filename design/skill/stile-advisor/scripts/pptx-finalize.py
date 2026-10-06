"""Completa il .pptx generato: pallini degli elenchi in rosso ADVISOR e versione .potx (modello).

Uso: python3 design/powerpoint/finalize.py <input.pptx> <output.pptx> <output.potx>
"""
import re
import sys
import zipfile

src, out_pptx, out_potx = sys.argv[1:4]

PPTX_MAIN = "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"
POTX_MAIN = "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml"
BU_CLR = '<a:buClr><a:srgbClr val="BA0100"/></a:buClr>'
# buClr va prima di buSzPct / buFont / buChar (ordine dello schema)
BULLET = re.compile(r"(?<!</a:buClr>)((?:<a:buSzPct[^>]*/>)?(?:<a:buFont[^>]*/>)?<a:buChar )")

with zipfile.ZipFile(src) as z:
    files = {n: z.read(n) for n in z.namelist()}

for name in files:
    if name.startswith(("ppt/slides/slide", "ppt/slideLayouts/", "ppt/slideMasters/")) and name.endswith(".xml"):
        xml = files[name].decode()
        files[name] = BULLET.sub(lambda m: BU_CLR + m.group(1), xml).encode()


def write(path, content_types):
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        for name, data in files.items():
            if name != "[Content_Types].xml":
                z.writestr(name, data)


ct = files["[Content_Types].xml"].decode()
write(out_pptx, ct)
write(out_potx, ct.replace(PPTX_MAIN, POTX_MAIN))
print("scritti", out_pptx, out_potx)
