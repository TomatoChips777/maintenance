import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import FormatDate from '../extra/DateFormat';

function generatePDF(data) {
    const doc = new jsPDF();
    doc.text('Borrowing Records', 14, 16);
  
    const tableColumn = ["ID", "Borrower", "Email", "Department", "Item", "Description", "Borrow Date", "Return Date","Asssisted By","Status"];
    const tableRows = [];
  
    data.forEach(entry => {
      const rowData = [
        entry.id,
        entry.borrower_name,
        entry.email,
        entry.department,
        entry.item_name,
        entry.description,
        FormatDate(entry.borrow_date),
        FormatDate(entry.returned_date),
        entry.assisted_by,
        entry.status
      ];
      tableRows.push(rowData);
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8 },  // Smaller font size to fit more content
    });
    
    // doc.autoTable({
    //   head: [tableColumn],
    //   body: tableRows,
    //   startY: 20,
    //   theme: 'grid',
    // });
  
    doc.save('borrowing-records.pdf');
  };
  
  export default generatePDF;
  