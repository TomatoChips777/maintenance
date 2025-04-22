export function formatBorrowingFrequencyText (data, timeframe) {
    if (!data || data.length === 0) return "No data available.";
  
    // Group records by selected timeframe
    const groupByTimeframe = (records, dateField) => {
      return records.reduce((acc, record) => {
        const dateObj = new Date(record[dateField]);
        let key;
        switch (timeframe) {
          case 'week':
            const startOfWeek = new Date(dateObj);
            startOfWeek.setDate(dateObj.getDate() - dateObj.getDay()); // Start of the week (Sunday)
            key = startOfWeek.toLocaleDateString();
            break;
          case 'month':
            key = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;
            break;
          case 'year':
            key = `${dateObj.getFullYear()}`;
            break;
          default: // default case is for "day"
            key = dateObj.toLocaleDateString();
        }
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
    };
  
    // Format data into a readable string
    const groupedData = groupByTimeframe(data, 'borrow_date');
    const chartData = Object.entries(groupedData)
      .map(([key, count]) => ({ date: key, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  
    const total = chartData.reduce((sum, item) => sum + item.count, 0);
    const firstDate = chartData[0]?.date || '';
    const lastDate = chartData.at(-1)?.date || '';
  
    let formattedText = `Total Borrowings: ${total}\nDate Range: ${firstDate} – ${lastDate}\n\nBorrowing Frequency:\n`;
  
    chartData.forEach(item => {
      formattedText += `  - ${item.date}: ${item.count} borrowings\n`;
    });
  
    return formattedText;
  };
  
  
export function formatBorrowings(data) {
    return data.map(borrowing => {
      const { item_name, borrower_name, borrow_date, returned_date, status } = borrowing;
      const borrowDate = new Date(borrow_date).toLocaleString();
      const returnDate = new Date(returned_date).toLocaleString();
      return `Borrower: ${borrower_name} | Items: ${item_name} | Borrowed: ${borrowDate} | Returned: ${returnDate} | Status: ${status}`;
    }).join("\n");
  }
  
  export function formatInventory(data) {
    return data.map(item => {
      const { item: itemName, status, category, total, available } = item;
      return `${itemName} (${category}) | Status: ${status} | Total: ${total} | Available: ${available}`;
    }).join("\n");
  }
  
  

  export function formatEvents(data) {
    return [...data].map(event => {
      const { title, startDate, endDate, preparations } = event;
      const start = new Date(startDate).toLocaleString();
      const end = new Date(endDate).toLocaleString();
      const preparationsList = preparations.map(p => `${p.name} (Quantity: ${p.quantity})`).join(", ");
      return `Event: ${title} | Time: ${start} - ${end} | Preparations: ${preparationsList}`;
    }).join("\n");
  }
  
  export function formatQuickStats(data) {
    const { borrowedToday, overdueReturns, activeBorrowers, availableItems } = data;
    return `
  Borrowed Today: ${borrowedToday}
  Overdue Returns: ${overdueReturns}
  Active Borrowers: ${activeBorrowers}
  Available Items: ${availableItems}
  `.trim();
  }
  
  export function formatBorrowersRanking(data) {
    return data.map(r => `${r.borrower_name}: ${r.borrow_count} borrowings`).join("\n");
  }
  
  export function formatAssistFrequency(data) {
    return data.map(a => `${a.assisted_by}: ${a.assist_count} assists`).join("\n");
  }
  
  export function formatDataForAskButton(data) {
    return `
  --- Borrowings ---
  ${formatBorrowings(data)}
  
  --- Inventory ---
  ${formatInventory(data)}
  
  --- Events ---
  ${formatEvents(data)}
  
  --- Quick Stats ---
  ${formatQuickStats(data)}
  
  --- Borrowers Ranking ---
  ${formatBorrowersRanking(data)}
  
  --- Assist Frequency ---
  ${formatAssistFrequency(data)}
  `.trim();
  }
  