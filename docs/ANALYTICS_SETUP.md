# Analytics Setup with Looker Studio

This guide explains how to connect your Google Sheets database to Looker Studio for real-time analytics and dashboards.

## Overview

Looker Studio provides free, interactive dashboards that can directly connect to your Google Sheets data source.

## Setup Instructions

### 1. Create a New Report

1. Go to [looker.studio](https://looker.studio)
2. Click "Create" → "Report"
3. Name your report (e.g., "WorldPulse Analytics")

### 2. Add Google Sheets as Data Source

1. In Looker Studio, click "Create new data source"
2. Select "Google Sheets" as the connector
3. Choose your "WorldPulse Data" spreadsheet
4. Select the sheet containing your data
5. Click "Create" and then "Add to report"

### 3. Create Visualizations

Looker Studio provides various chart types:

- **Scorecards**: Display key metrics
- **Time Series Charts**: Track data over time
- **Tables**: Show raw data
- **Pie Charts**: Display distribution
- **Bar Charts**: Compare values
- **Maps**: Visualize geographic data

### 4. Build Your Dashboard

Example dashboard structure:

```
┌─────────────────────────────────────┐
│        Key Metrics (Scorecards)     │
│  Total Records | Avg Value | Status │
├─────────────────────────────────────┤
│  Data Trends (Time Series Chart)    │
│  [Graph showing data over time]     │
├──────────────────┬──────────────────┤
│ Top Categories   │ Recent Data      │
│ (Pie Chart)      │ (Table)          │
└──────────────────┴──────────────────┘
```

### 5. Add Filters

Enable viewers to filter data:

1. Click "Add a filter"
2. Select dimension to filter by
3. Configure filter options
4. Apply to relevant charts

## Automatic Updates

Since Looker Studio connects directly to Google Sheets:
- Reports update in real-time as data changes
- No manual refresh needed
- Historical data automatically tracked

## Sharing Your Dashboard

1. Click "Share" (top right)
2. Choose sharing settings:
   - **Anyone with the link**: Share via URL
   - **Specific people**: Add email addresses
   - **Public**: Make it discoverable

3. Set permissions:
   - **Viewer**: Can view reports only
   - **Editor**: Can edit reports

## Best Practices

1. **Data Quality**: Clean and validate data before visualization
2. **Naming**: Use clear, consistent column names
3. **Formatting**: Format dates and numbers appropriately
4. **Partitioning**: Create separate sheets for different data types
5. **Backup**: Keep your Google Sheet backed up
6. **Performance**: Archive old data if sheet grows very large

## Advanced Features

### Calculated Metrics
Create custom metrics using functions:
```
SUM(field)
AVERAGE(field)
COUNT(field)
PERCENT_OF_TOTAL(field)
```

### Cohort Analysis
Track user groups over time:
- First seen date
- Activity levels
- Retention metrics

### Alerts
Set up email alerts for key metrics:
1. Click "Add alert" in chart menu
2. Define threshold and conditions
3. Set notification recipients

## Limitations

- Free version limited to 10 reports and 100K rows
- Real-time updates: 30-minute refresh cycle
- Complex calculations may be slow

## Next Steps

- Connect additional data sources
- Create custom metrics for KPIs
- Set up scheduled email reports
- Embed dashboards on your website (with paid version)
