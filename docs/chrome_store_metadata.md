# Chrome Web Store Submission Guide

This document contains information needed for submitting the extension to the Chrome Web Store.

## Extension Details

### Basic Information

**Extension Name**  
Defund Fascists

**Summary**  
Warns users before supporting companies with right-wing political ties or advertising on problematic platforms.

**Description**  
```
Defund Fascists helps you make informed consumer choices by identifying companies that support right-wing political causes or advertise on platforms known for spreading misinformation.

HOW IT WORKS:
- Automatically detects brands while you browse major shopping sites (Amazon, Walmart, Target)
- Displays clear warnings when you view products from flagged companies
- Provides information about why a company has been flagged
- Updates its database daily to ensure you have the latest information
- 100% free and open source (Mozilla Public License 2.0)

PRIVACY:
- Does NOT track your browsing history
- Does NOT collect personal information
- Does NOT send your shopping habits to third parties
- Only processes information locally on your device

The extension helps you avoid unintentionally supporting companies that fund:
- Right-wing political causes
- Platforms promoting misinformation
- Politicians or policies associated with authoritarianism

For more information or to report companies that should be added to our database, visit our GitHub repository.
```

**Category**  
Shopping

**Language**  
English

### Detailed Information

**Website**  
https://github.com/defundfascists/defundfascists-plugin

**Version**  
1.0.0 (will be updated by build process)

### Visuals

**Icon**  
Use the 128x128 icon from the images/ directory

**Screenshots**  
Create 1280x800 screenshots showing:
1. The extension warning on an Amazon product page
2. The extension popup interface
3. A warning on search results

### Additional Information

**Single Purpose**  
This extension helps users identify companies that support right-wing causes or advertise on problematic platforms before making purchases, thereby enabling more informed consumer decisions.

**Permissions Justification**
- storage: Required to store the database of flagged companies locally
- activeTab: Required to read content from shopping websites to identify product brands
- host_permissions (amazon.com, walmart.com, target.com): Required to scan these shopping sites for product brands

## Checklist Before Submission

- [ ] Extension fully tested on Chrome
- [ ] Screenshots created
- [ ] Privacy policy linked
- [ ] Extension package (.zip) created using `./build.sh`
- [ ] All fields in the submission form filled out
- [ ] Draft saved before final submission 