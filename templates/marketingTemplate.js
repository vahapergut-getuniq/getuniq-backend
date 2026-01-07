// templates/marketingTemplate.js

export function buildMarketingPDF(data, config) {
  const {
    projectName,
    clientName,
    date,
    overview,
    awareness,
    consideration,
    conversion,
    deliverables
  } = data;

  // 🔥 Deliverables güvenli şekilde array’e çevrilir
  const normalizeList = (input) => {
    if (Array.isArray(input)) return input;
    if (typeof input === "string")
      return input.split("\n").map((x) => x.trim()).filter((x) => x !== "");
    return [];
  };

  const deliverableList = normalizeList(deliverables);

  return `
  <html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: #1E1B4B;
      }

      .cover {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 60px;
        background: linear-gradient(135deg, #8249AE, #00CFE8);
        color: white;
      }

      .cover h1 {
        font-size: 42px;
        margin: 0 0 10px;
      }

      .cover p {
        font-size: 20px;
        opacity: .9;
      }

      .page {
        padding: 50px;
        page-break-before: always;
      }

      h2 {
        color: #8249AE;
        font-size: 26px;
        margin-bottom: 10px;
      }

      .card {
        margin-top: 8px;
        padding: 18px;
        border-radius: 14px;
        background: rgba(130,73,174,0.06);
        border: 1px solid rgba(130,73,174,0.15);
        white-space: pre-wrap;
      }

      ul { padding-left: 20px; }
      li { margin-bottom: 6px; }

      footer {
        position: fixed;
        bottom: 20px;
        left: 50px;
        right: 50px;
        text-align: center;
        font-size: 12px;
        color: #666;
      }
    </style>
  </head>

  <body>

    <!-- COVER PAGE -->
    <div class="cover">
      <h1>${projectName || "Marketing Strategy Report"}</h1>
      <p>${clientName || ""} — ${date || ""}</p>
    </div>

    <!-- CONTENT PAGE -->
    <div class="page">
      <h2>Overview</h2>
      <div class="card">${overview || ""}</div>

      <h2>Awareness Strategy</h2>
      <div class="card">${awareness || ""}</div>

      <h2>Consideration Strategy</h2>
      <div class="card">${consideration || ""}</div>

      <h2>Conversion Strategy</h2>
      <div class="card">${conversion || ""}</div>

      <h2>Deliverables</h2>
      <div class="card">
        <ul>
          ${deliverableList.map((d) => `<li>${d}</li>`).join("")}
        </ul>
      </div>
    </div>

    <footer>GetUniq AI — Marketing Report</footer>
  </body>
  </html>
  `;
}
