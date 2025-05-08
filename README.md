# Defund Fascists Browser Extension

A Chrome browser extension that warns users before supporting companies that fund right-wing political causes or advertise on problematic platforms.

## Overview

This extension helps consumers make informed decisions by detecting product brands on e-commerce sites and warning users if those brands have been flagged for supporting problematic causes. It currently works on:

- Amazon.com
- Walmart.com  
- Target.com

## Features

- **Brand Detection**: Automatically identifies product brands on supported e-commerce sites
- **Visual Warnings**: Displays clear warnings for products from flagged companies
- **Daily Updates**: Refreshes its database daily to ensure up-to-date information
- **Toggle On/Off**: Easily enable or disable the extension as needed

## Installation

### From Chrome Web Store
*Coming soon*

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the directory containing the extension files
5. The extension should now be installed and active

## How It Works

1. The extension scans product pages on supported e-commerce sites
2. It extracts brand information from the page
3. It checks the brand against a database of flagged companies
4. If a match is found, it displays a warning with information about why the company was flagged

## Database

The extension uses a curated database of companies that have:
- Funded right-wing political causes
- Advertised on platforms known for spreading misinformation
- Supported politicians or policies associated with authoritarianism

The database is updated regularly and stored as a JSON file.

## Privacy

This extension:
- Does NOT track your browsing history
- Does NOT collect personal information
- Does NOT send your shopping habits to third parties
- Only processes information locally on your device

## Contributing

Contributions are welcome! There are several ways to help:

### Report Companies
If you know of a company that should be added to our database, please submit an issue with:
- Company/brand name
- Evidence of problematic support/funding
- Sources for verification

### Improve the Code
- Fork the repository
- Make your changes
- Submit a pull request

## License

This project is licensed under the Mozilla Public License 2.0 (MPL-2.0) - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This extension is provided for informational purposes only. The creators make no guarantees about the accuracy of the information provided. Users should verify information independently before making purchasing decisions. 