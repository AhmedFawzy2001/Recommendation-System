const fs = require('fs');
const xml2js = require('xml2js');
const ExcelJS = require('exceljs');

const convertReportsToExcel = async () => {
    try {
        const xmlFilePath = './reports/test-results.xml';

        // Check if the XML file exists
        if (!fs.existsSync(xmlFilePath)) {
            throw new Error(`XML report file '${xmlFilePath}' not found.`);
        }

        // Parse the XML file
        const xmlData = fs.readFileSync(xmlFilePath, 'utf-8');
        const parsedData = await xml2js.parseStringPromise(xmlData);

        // Add your Excel conversion logic here...

        console.log('Conversion completed successfully.');
    } catch (error) {
        console.error('Error converting reports to Excel:', error.message);
    }
};

convertReportsToExcel();
