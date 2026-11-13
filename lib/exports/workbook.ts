import ExcelJS from "exceljs";
import type { Dataset } from "./datasets";

export async function toWorkbook(sets: Dataset[]) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Ghana Budget Intelligence"; wb.created = new Date();
  for (const d of sets) {
    const ws = wb.addWorksheet(d.name.slice(0, 31));
    const cols = d.rows[0] ? Object.keys(d.rows[0]) : [];
    ws.mergeCells(1, 1, 1, Math.max(cols.length, 1)); ws.getCell("A1").value = d.title; ws.getCell("A1").font = { bold: true, size: 14, color: { argb: "FF101C2C" } };
    ws.mergeCells(2, 1, 2, Math.max(cols.length, 1)); ws.getCell("A2").value = `${d.note}  Source: 2027 Budget Speech. Exported ${new Date().toISOString().slice(0, 10)}.`;
    ws.getCell("A2").font = { italic: true, size: 9, color: { argb: "FF697586" } }; ws.getCell("A2").alignment = { wrapText: true, vertical: "top" }; ws.getRow(2).height = 32;
    const header = ws.addRow(cols);
    header.eachCell((c) => { c.font = { bold: true, color: { argb: "FFFFFFFF" } }; c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF101C2C" } }; });
    d.rows.forEach((r) => ws.addRow(cols.map((c) => r[c])));
    cols.forEach((c, i) => {
      const col = ws.getColumn(i + 1);
      const longest = Math.max(c.length, ...d.rows.map((r) => String(r[c] ?? "").length));
      col.width = Math.min(60, Math.max(10, longest + 2)); col.alignment = { vertical: "top", wrapText: longest > 50 };
      if (/amount \(millions\)|stated amount/i.test(c)) col.numFmt = "#,##0.0";
    });
    ws.views = [{ state: "frozen", ySplit: 3 }];
    if (cols.length) ws.autoFilter = { from: { row: 3, column: 1 }, to: { row: 3, column: cols.length } };
  }
  return Buffer.from(await wb.xlsx.writeBuffer());
}
