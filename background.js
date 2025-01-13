chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: populateInspectionQuantity
  });
});

function populateInspectionQuantity() {
  // Get all tables on the page
  const tables = document.querySelectorAll('table');

  // Loop through each table
  tables.forEach((table) => {
    const headers = Array.from(table.querySelector('thead tr').getElementsByTagName('th'));

    // Log headers to see the structure in case of multiple tables
    console.log('Headers:', headers.map(header => header.textContent.trim()));

    // Find the index of the "Minimum Quantity Required" column
    const minQuantityIndex = headers.findIndex(th => th.textContent.includes('Minimum Quantity Required'));

    // Find the index of the "Acceptable Quantity Found During Inspection" column
    const inspectionQuantityIndex = headers.findIndex(th => {
      const text = th.textContent.replace(/[\*\s]/g, '').toLowerCase();
      return text.includes('acceptablequantityfoundduringinspection');
    });

    // If the columns are not found, show an alert and return
    if (minQuantityIndex === -1 || inspectionQuantityIndex === -1) {
      console.log("Required columns not found.");
      return;
    }

    // Get all rows in the table body
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach((row) => {
      // Get the "Minimum Quantity Required" value from the relevant column
      const minQuantityRequired = row.cells[minQuantityIndex].innerText.trim();

      // Find the "Acceptable Quantity Found During Inspection" input field
      const acceptableQuantityInput = row.querySelector(`td:nth-child(${inspectionQuantityIndex + 1}) input[type="number"]`);

      // If the input field is found, set its value to the "Minimum Quantity Required"
      if (acceptableQuantityInput) {
        acceptableQuantityInput.value = minQuantityRequired;

         // Trigger input and change events to ensure the form detects the change
         const inputEvent = new Event('input', { bubbles: true });
         const changeEvent = new Event('change', { bubbles: true });
 
         acceptableQuantityInput.dispatchEvent(inputEvent);
         acceptableQuantityInput.dispatchEvent(changeEvent);
      }
    });
  });

  console.log("Acceptable Quantity Found has been populated in all tables!");
}