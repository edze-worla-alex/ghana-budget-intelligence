"""Rebuild data/budget/paragraphs.json from the Budget Speech PDF.
Usage: python scripts/extract-paragraphs.py path/to/speech.pdf   (needs poppler's pdftotext)
Each record: { n: paragraph number, page: PDF page, text }. Page numbers equal the printed
page numbers in this PDF. Numbered sub-lists are folded into their parent paragraph.
"""
import json, re, subprocess, sys
txt = subprocess.check_output(["pdftotext", "-layout", sys.argv[1], "-"]).decode("utf-8", "ignore")
paras, cur = {}, None
for page_no, page in enumerate(txt.split("\f"), 1):
    for line in page.split("\n"):
        m = re.match(r"^\s{0,3}(\d{1,3})\.\s+(\S.*)", line)
        if m:
            cur = int(m.group(1)); paras[cur] = {"n": cur, "page": page_no, "text": m.group(2).strip()}
        elif cur and line.strip() and "BUDGET SPEECH" not in line and not re.fullmatch(r"\s*\d+\s*", line):
            paras[cur]["text"] += " " + line.strip()
out = [{**v, "text": " ".join(v["text"].split())} for v in sorted(paras.values(), key=lambda v: v["n"])]
json.dump(out, open("data/budget/paragraphs.json", "w"), ensure_ascii=False)
print(len(out), "paragraphs")
