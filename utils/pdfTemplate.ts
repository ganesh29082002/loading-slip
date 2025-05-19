export const generateHtml = (formData: any) => {
    const rows = formData.items.map(item => `
      <tr>
        <td>${item.particular}</td>
        <td>${item.articles}</td>
        <td>₹${item.paid}</td>
        <td>₹${item.toPay}</td>
        <td>₹${item.paid + item.toPay}</td>
      </tr>
    `).join('');
  
    const grandTotal = formData.items.reduce(
      (sum, item) => sum + item.paid + item.toPay, 0
    );
  
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            .row { margin-bottom: 8px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table, .table th, .table td { border: 1px solid #ccc; }
            .table th, .table td { padding: 10px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Delivery Bill</h1>
  
          <div class="row"><strong>Area:</strong> ${formData.area}</div>
          <div class="row"><strong>Consigner Name:</strong> ${formData.consignerName}</div>
          <div class="row"><strong>Consignee Name:</strong> ${formData.consigneeName}</div>
          <div class="row"><strong>Vehicle Name:</strong> ${formData.vehicleName}</div>
          <div class="row"><strong>From:</strong> ${formData.from}</div>
          <div class="row"><strong>To:</strong> ${formData.to}</div>
          <div class="row"><strong>Date:</strong> ${formData.date}</div>
  
          <table class="table">
            <thead>
              <tr>
                <th>Particulars</th>
                <th>No. of Articles</th>
                <th>Paid</th>
                <th>To Pay</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
  
          <div class="row" style="text-align: right; margin-top: 10px;">
            <strong>Grand Total: ₹${grandTotal}</strong>
          </div>
        </body>
      </html>
    `;
  };
  