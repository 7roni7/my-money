// forecastLogic.js - מנגנון תחזית ופריסת תשלומים עתידיים

window.generateInstallmentForecasts = function(transactions, currentYearMonth) {
  const forecasts = [];

  transactions.forEach(txn => {
    // בודקים אם מדובר בעסקת תשלומים שיש לה תשלומים עתידיים
    if (txn.isInstallment && txn.currentInstallment < txn.totalInstallments) {
      const remainingCount = txn.totalInstallments - txn.currentInstallment;
      
      const baseDate = new Date(txn.date || Date.now());

      for (let i = 1; i <= remainingCount; i++) {
        const nextDate = new Date(baseDate);
        nextDate.setMonth(nextDate.getMonth() + i);

        const year = nextDate.getFullYear();
        const month = String(nextDate.getMonth() + 1).padStart(2, '0');
        const targetYM = `${year}-${month}`;

        // יוצרים חיוב צפוי עבור החודשים הבאים
        forecasts.push({
          ...txn,
          id: `forecast_${txn.id}_inst_${txn.currentInstallment + i}`,
          currentInstallment: txn.currentInstallment + i,
          targetYearMonth: targetYM,
          isForecast: true,
          date: nextDate.toISOString().split('T')[0]
        });
      }
    }
  });

  return forecasts;
};
