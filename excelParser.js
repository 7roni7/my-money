// excelParser.js - מנגנון פריסת ופענוח קבצי אקסל ותשלומים

window.parseExcelData = function(dataRows) {
  return dataRows.map(row => {
    // 1. חילוץ תיאור/שם בית העסק
    let title = row["שם בית העסק"] || row["שם עסקה"] || row["תיאור"] || row["Unnamed: 1"] || "עסקה ללא שם";
    title = String(title).trim();

    // 2. חילוץ סכום העסקה
    let rawAmount = row["סכום חיוב"] || row["סכום עסקה"] || row["סכום"] || row["Unnamed: 5"] || row["Unnamed: 2"] || 0;
    let amount = parseFloat(String(rawAmount).replace(/[^\d.-]/g, '')) || 0;

    let currentInst = 1;
    let totalInst = 1;

    // 3. זיהוי תשלומים מעמודות ייעודיות באקסל
    if (row["תשלום נוכחי"] && row["סך תשלומים"]) {
      currentInst = parseInt(row["תשלום נוכחי"]) || 1;
      totalInst = parseInt(row["סך תשלומים"]) || 1;
    } 
    // 4. זיהוי תשלומים מתוך טקסט (למשל: "מנטופ תשלום 1 מתוך 2" או "01/02")
    else {
      // תבנית א': "תשלום 1 מתוך 2" או "תשלום 1 מ-2"
      const matchText = title.match(/(.*?)\s*(?:תשלום\s*)?(\d+)\s*(?:מתוך|מ-)\s*(\d+)/i);
      // תבנית ב': "01/02" או "1/2"
      const matchSlash = title.match(/(.*?)\s*(\d{1,2})\/(\d{1,2})/i);

      if (matchText) {
        title =   matchText[1].trim() || title;
        currentInst = parseInt(matchText[2]);
        totalInst = parseInt(matchText[3]);
      } else if (matchSlash) {
        title = matchSlash[1].trim() || title;
        currentInst = parseInt(matchSlash[2]);
        totalInst = parseInt(matchSlash[3]);
      }
    }

    return {
      id: 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: title,
      amount: amount,
      currentInstallment: currentInst,
      totalInstallments: totalInst,
      isInstallment: totalInst > 1,
      date: row["תאריך עסקה"] || row["תאריך רכישה"] || new Date().toISOString().split('T')[0]
    };
  });
};
