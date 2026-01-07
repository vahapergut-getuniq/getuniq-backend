import puppeteer from "puppeteer";
import { MarketingPDFTemplate } from "../templates/marketingTemplateConfig.js";
import { buildMarketingPDF } from "../templates/marketingTemplate.js";

export const exportMarketingPDF = async (req, res) => {
  console.log("🔥 PDF REQ BODY:", req.body);   // ⭐ EKLE

  try {
    const summary = req.body.data;

    if (!summary) {
      return res.status(400).json({ message: "Missing summary data" });
    }

    // HTML'i oluştur
    const html = buildMarketingPDF(summary, MarketingPDFTemplate);

    // Puppeteer başlat
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // PDF oluştur
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0" },
    });

    await browser.close();

    // PDF cevap olarak gönder
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=marketing-report.pdf"
    );

    return res.send(pdf);

  } catch (error) {
    console.log("❌ PDF ERROR:", error);
    return res.status(500).json({
      message: "PDF failed",
      error: error.message,
    });
  }
};
