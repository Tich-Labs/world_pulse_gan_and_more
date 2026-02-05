# Google Apps Script Backend

This document provides guidance on setting up the Google Apps Script backend for WorldPulse.

## Overview

Google Apps Script (GAS) serves as a serverless REST-like API that connects to Google Sheets database. It eliminates the need for traditional backend infrastructure.

## Setup Instructions

### 1. Create a Google Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click "New project"
3. Name it "WorldPulse Backend"

### 2. Set Up Google Sheets Database

1. Create a new Google Sheet named "WorldPulse Data"
2. Create the following columns based on your data structure:
   - Column A: `id`
   - Column B: `title`
   - Column C: `description`
   - Column D: `timestamp`
   - Add more columns as needed

3. Get your Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### 3. Create Google Apps Script Code

Replace the default code in Apps Script with:

```javascript
// Configuration
const SHEET_NAME = 'Sheet1'; // Change if your sheet has a different name
const SPREADSHEET_ID = 'YOUR_SHEET_ID_HERE'; // Replace with your Google Sheet ID

// Main entry point for all requests
function doGet(e) {
  const action = e.parameter.action || 'getData';
  
  try {
    switch(action) {
      case 'getData':
        return getDataResponse();
      default:
        return createResponse({ error: 'Unknown action' }, 400);
    }
  } catch(error) {
    return createResponse({ error: error.toString() }, 500);
  }
}

// Handle POST requests
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  try {
    switch(action) {
      case 'addData':
        return addDataResponse(data);
      case 'updateData':
        return updateDataResponse(data);
      case 'deleteData':
        return deleteDataResponse(data);
      default:
        return createResponse({ error: 'Unknown action' }, 400);
    }
  } catch(error) {
    return createResponse({ error: error.toString() }, 500);
  }
}

// Get all data from sheet
function getDataResponse() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  // Skip header row and convert to objects
  const headers = data[0];
  const result = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
  
  return createResponse(result, 200);
}

// Add new data
function addDataResponse(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const newRow = [
    data.id || Utilities.getUuid(),
    data.title,
    data.description,
    new Date()
  ];
  
  sheet.appendRow(newRow);
  
  return createResponse({ success: true, message: 'Data added' }, 200);
}

// Update existing data
function updateDataResponse(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const allData = sheet.getDataRange().getValues();
  
  const rowIndex = allData.findIndex(row => row[0] === data.id);
  
  if (rowIndex === -1) {
    return createResponse({ error: 'Record not found' }, 404);
  }
  
  // Update the row (rowIndex + 1 because sheets are 1-indexed)
  sheet.getRange(rowIndex + 1, 2, 1, allData[0].length - 1)
    .setValues([allData[rowIndex].slice(1).map((_, i) => data[Object.keys(data)[i + 1]] || _)]);
  
  return createResponse({ success: true, message: 'Data updated' }, 200);
}

// Delete data
function deleteDataResponse(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const allData = sheet.getDataRange().getValues();
  
  const rowIndex = allData.findIndex(row => row[0] === data.id);
  
  if (rowIndex === -1) {
    return createResponse({ error: 'Record not found' }, 404);
  }
  
  sheet.deleteRow(rowIndex + 1);
  
  return createResponse({ success: true, message: 'Data deleted' }, 200);
}

// Helper function to create response
function createResponse(data, statusCode = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
```

### 4. Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Select "Web app" as the type
3. Execute as: Your account
4. Who has access: "Anyone" (for public access)
5. Click "Deploy"
6. Copy the deployment URL
7. Add it to your frontend's `js/main.js` as `API_BASE_URL`

## API Endpoints

### GET Request
```
https://script.google.com/.../usercontent.googleusercontent.com/...?action=getData
```

### POST Request
```javascript
{
  "action": "addData",
  "title": "Item Title",
  "description": "Item Description"
}
```

## Troubleshooting

- **CORS Issues**: The script headers handle CORS; ensure your deployment is public
- **Sheet Not Found**: Verify the SHEET_ID and SHEET_NAME match your actual Google Sheet
- **Authentication**: Public deployments don't require authentication for read operations

## Next Steps

- Extend the API with additional endpoints as needed
- Add data validation in Apps Script
- Implement error handling and logging
- Set up proper permissions in your Google Sheet
