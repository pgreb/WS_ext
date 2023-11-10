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
            cells.forEach((cell) => {
                const columnName = cell.getAttribute('data-column-name');
                const cellValue = cell.textContent.trim();
                console.log(`${columnName}: ${cellValue}`);
            });

            // Теперь вы можете использовать полученные значения для дополнительной обработки или передать их в функцию генерации PDF
            // const barcode = '2038898078267'; // Пример для штрих-кода, замените на реальные данные
            // generatePDF(barcode, ...); // Передаем значения в функцию генерации PDF
        } else {
            console.error('Current row not found.');
        }
    });
    // // Обработчик нажатия на кнопку
    // button.addEventListener('click', () => {
    //     // Тестовые данные
    //     const barcode = '2038898078267';
    //     const name = 'Test Product';
    //     const color = 'Red';
    //     const size = 'Red size';
    //     const sku = 'ABC123';

    //     // Вызываем функцию генерации PDF
    //     generatePDF(barcode, name, color, size, sku);
    // });

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
                //console.log(`Table not found. Retrying... (Attempt ${attemptNumber})`);
                setTimeout(() => tryAddingButton(attemptNumber + 1), 500); // Повторяем через 300 мс
            }
        } else {
            //console.log(`Parent div not found. Retrying... (Attempt ${attemptNumber})`);
            setTimeout(() => tryAddingButton(attemptNumber + 1), 700); // Повторяем через 300 мс
        }
    };

    tryAddingButton(1);
}

// Добавляем обработчик события после загрузки всех ресурсов страницы
window.addEventListener('load', addButtonAfterLoad);

// Функция для генерации изображения штрих-кода Code 128
function generateBarcodeImage(barcode) {
    // Используем библиотеку JsBarcode для генерации штрих-кода
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, barcode, { format: 'CODE128', displayValue: true });

    return canvas.toDataURL('image/png');  // Преобразуем изображение в формат PNG
}

// Функция для генерации PDF
function generatePDF(barcode, name, color, size, sku) {
    // Создаем новый документ PDF
    const doc = new jsPDF({
        orientation: 'landscape', // Устанавливаем альбомную ориентацию
        unit: 'mm',
        format: [174, 120], // Размеры PDF: 174 мм x 120 мм
    });

    // Генерируем изображение штрих-кода
    const barcodeImage = generateBarcodeImage(barcode);

    // Размещаем изображение штрих-кода
    doc.addImage(barcodeImage, 'PNG', 1, 2, 60, 25); // Параметры: x, y, width, height

    // Размещаем данные
    doc.setFontSize(5); // Устанавливаем размер шрифта 5 по классификации MS Word

    // Добавляем текстовые параметры, если они заданы
    if (name) {
        doc.text(`Name: ${name}`, 2, 30); // Параметры: текст, x, y
    }

    if (color) {
        doc.text(`Color: ${color}`, 2, 33);
    }

    if (size) {
        doc.text(`Size: ${size}`, 2, 36);
    }

    if (sku) {
        doc.text(`SKU: ${sku}`, 2, 39);
    }

    // Сохраняем PDF
    doc.save('product_info.pdf');
}
