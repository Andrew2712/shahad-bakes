import type { Order, Invoice } from "@/lib/firebase/db";

// Dynamically import jsPDF to keep bundle size low
async function loadJsPDF() {
  const { jsPDF } = await import("jspdf");
  return jsPDF;
}

const BRAND_ORANGE = [234, 88, 12] as const;   // #EA580C ≈ Shahad orange
const BRAND_BROWN = [92, 58, 33] as const;     // #5C3A21 cocoa
const CREAM = [246, 231, 193] as const;        // #F6E7C1

function formatCurrency(n: number) {
  return `Rs. ${n.toFixed(2)}`;
}

function formatDate(ts: { toDate?: () => Date } | Date | null) {
  if (!ts) return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const d = typeof (ts as any).toDate === "function" ? (ts as any).toDate() : ts as Date;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export async function generateInvoicePDF(invoice: Invoice): Promise<Blob> {
  const JsPDF = await loadJsPDF();
  const doc = new JsPDF({ unit: "mm", format: "a4" });

  const W = 210;
  const margin = 18;

  // ── Header bar ──────────────────────────────────────────────
  doc.setFillColor(...BRAND_ORANGE);
  doc.rect(0, 0, W, 42, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("SHAHAD BAKES", margin, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("SWEETNESS OF PURITY AND HEALTH", margin, 25);
  doc.text("hello@shahadbakes.com  |  @shahad_bakes", margin, 31);
  doc.text("Bangalore, India", margin, 37);

  // INVOICE label on right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text("INVOICE", W - margin, 20, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`#${invoice.invoiceNumber}`, W - margin, 28, { align: "right" });
  doc.text(`Date: ${formatDate(invoice.createdAt)}`, W - margin, 34, { align: "right" });

  // ── Bill To ─────────────────────────────────────────────────
  let y = 54;
  doc.setTextColor(...BRAND_BROWN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("BILLED TO", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  y += 6;
  doc.text(invoice.customerName, margin, y);
  y += 5;
  doc.text(invoice.customerEmail, margin, y);
  y += 5;
  doc.text(invoice.customerPhone, margin, y);
  y += 5;
  const addrLines = doc.splitTextToSize(invoice.deliveryAddress, 80);
  doc.text(addrLines, margin, y);
  y += addrLines.length * 5;

  // Order reference on right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND_BROWN);
  doc.text("ORDER ID", W - margin - 60, 54);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.text(invoice.orderId, W - margin - 60, 60);

  // ── Items table ─────────────────────────────────────────────
  y = Math.max(y + 6, 90);
  const colX = [margin, 90, 130, 160, W - margin];

  // Table header
  doc.setFillColor(...BRAND_BROWN);
  doc.rect(margin - 2, y - 5, W - margin * 2 + 4, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("ITEM", colX[0], y);
  doc.text("CATEGORY", colX[1], y);
  doc.text("UNIT PRICE", colX[2], y);
  doc.text("QTY", colX[3], y);
  doc.text("AMOUNT", colX[4], y, { align: "right" });
  y += 8;

  // Rows
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "normal");
  invoice.items.forEach((item, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(...CREAM);
      doc.rect(margin - 2, y - 4, W - margin * 2 + 4, 8, "F");
    }
    doc.text(doc.splitTextToSize(item.name, 45)[0], colX[0], y);
    doc.text(item.quantity.toString(), colX[3], y);
    doc.text(formatCurrency(item.price), colX[2], y);
    doc.text(formatCurrency(item.price * item.quantity), colX[4], y, { align: "right" });
    y += 8;
  });

  // ── Totals ───────────────────────────────────────────────────
  y += 4;
  const totalsX = W - margin - 60;

  const addRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text(label, totalsX, y);
    doc.text(value, W - margin, y, { align: "right" });
    y += 7;
  };

  doc.setDrawColor(...BRAND_ORANGE);
  doc.line(totalsX - 2, y - 2, W - margin + 2, y - 2);
  addRow("Subtotal", formatCurrency(invoice.subtotal));
  addRow("Tax (5%)", formatCurrency(invoice.tax));
  addRow(
    invoice.deliveryCharge === 0 ? "Delivery (FREE)" : "Delivery",
    formatCurrency(invoice.deliveryCharge)
  );
  if (invoice.discount > 0) addRow("Discount", `-${formatCurrency(invoice.discount)}`);
  doc.line(totalsX - 2, y - 2, W - margin + 2, y - 2);
  doc.setFillColor(...BRAND_ORANGE);
  doc.rect(totalsX - 4, y - 5, W - margin - totalsX + 6 + margin, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL", totalsX, y + 1);
  doc.text(formatCurrency(invoice.total), W - margin, y + 1, { align: "right" });
  y += 16;

  // ── Footer ───────────────────────────────────────────────────
  doc.setFillColor(...BRAND_ORANGE);
  doc.rect(0, 285, W, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Thank you for choosing Shahad Bakes — Baked with Love ♥",
    W / 2,
    292,
    { align: "center" }
  );

  return doc.output("blob");
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
