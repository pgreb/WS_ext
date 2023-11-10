console.log('content.js START!!! ================================');

// Функция для создания кнопки
function createButton() {
  const button = document.createElement('button');
  button.textContent = 'Generate PDF';

  // Обработчик нажатия на кнопку
  button.addEventListener('click', (event) => {
    // Получаем родительскую строку (tr) кнопки
    const currentRow = event.target.closest('tr');

    if (currentRow) {
      // Получаем все ячейки (td) в текущей строке
      const cells = currentRow.querySelectorAll('td');

      // Проходим по каждой ячейке и выводим в консоль название столбца и значение ячейки
      const rowData = {};
      cells.forEach((cell) => {
        const columnName = cell.getAttribute('data-column-name');
        const cellValue = cell.textContent.trim();
        rowData[columnName] = cellValue;
      });

      // Вызываем функцию для генерации PDF
      generatePDF(rowData);
    } else {
      console.error('Current row not found.');
    }
  });

  return button;
}

// Функция для добавления кнопок после загрузки таблицы
function addButtonAfterLoad() {
  console.log('addButtonAfterLoad START!!!');

  const tryAddingButton = (attemptNumber) => {
    // Находим div, внутри которого нужно искать таблицу
    const parentDiv = document.querySelector('[class^="Created-cards__"][data-page="new-goods"]');

    if (parentDiv) {
      // Попробуем найти таблицу более точным путем
      const table = parentDiv.querySelector('div[data-page="new-goods"] table');

      if (table) {
        // Получаем заголовки таблицы
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        console.log('Table Headers:', headers);

        // Добавляем кнопку в каждую строку
        const tbody = table.querySelector('[class^="New-table-body-component__"][role="rowgroup"]');
        const rows = tbody.querySelectorAll('tr[id^="table-row-"][role="row"]');
        rows.forEach((row) => {
          const buttonCell = document.createElement('td');
          buttonCell.appendChild(createButton());
          row.appendChild(buttonCell);
        });
        console.log('Buttons added successfully!');
      } else {
        setTimeout(() => tryAddingButton(attemptNumber + 1), 500); // Повторяем через 500 мс
      }
    } else {
      setTimeout(() => tryAddingButton(attemptNumber + 1), 700); // Повторяем через 700 мс
    }
  };

  tryAddingButton(1);
}

// Добавляем обработчик события после загрузки всех ресурсов страницы
window.addEventListener('load', addButtonAfterLoad);

// Функция для генерации изображения штрих-кода Code 128
function generateBarcodeImage(barcode) {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, barcode, { format: 'CODE128', displayValue: true });
  return canvas.toDataURL('image/png');
}

// Функция для генерации PDF
function generatePDF(rowData) {
  const barcode = rowData['Баркод товара']; // Замените на реальное название столбца с баркодом
  const name = rowData['Name']; // Замените на реальное название столбца с именем
  const color = rowData['Color']; // Замените на реальное название столбца с цветом
  const size = rowData['Size']; // Замените на реальное название столбца с размером
  const sku = rowData['SKU']; // Замените на реальное название столбца с артикулом

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [174, 120],
  });

  const barcodeImage = generateBarcodeImage(barcode);

  doc.addImage(barcodeImage, 'PNG', 1, 2, 60, 25);

  doc.setFontSize(5);
  if (name) doc.text(`Name: ${name}`, 2, 30);
  if (color) doc.text(`Color: ${color}`, 2, 33);
  if (size) doc.text(`Size: ${size}`, 2, 36);
  if (sku) doc.text(`SKU: ${sku}`, 2, 39);

  doc.save('product_info.pdf');
}
