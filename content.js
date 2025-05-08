// Main content script for Defund Fascists extension

// Store for our flagged companies data
let flaggedCompanies = {};
let isExtensionEnabled = true;

// Initialize the extension
async function init() {
  console.log('Defund Fascists: Content script loaded');
  
  // Get flagged companies data from background script
  await getFlaggedCompanies();
  
  // If extension is disabled, do nothing
  if (!isExtensionEnabled) {
    console.log('Defund Fascists: Extension is disabled');
    return;
  }
  
  // Determine which site we're on
  const domain = window.location.hostname;
  
  if (domain.includes('amazon.com')) {
    scanAmazonPage();
  } else if (domain.includes('walmart.com')) {
    scanWalmartPage();
  } else if (domain.includes('target.com')) {
    scanTargetPage();
  } else {
    console.log('Defund Fascists: Not on a supported e-commerce site');
  }
}

// Retrieve flagged companies data from storage
async function getFlaggedCompanies() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({action: 'getFlaggedCompanies'}, response => {
      if (response) {
        if (response.data) {
          flaggedCompanies = response.data;
          console.log('Flagged companies data loaded', flaggedCompanies);
        } else {
          console.error('Failed to get flagged companies data');
        }
        
        isExtensionEnabled = response.isEnabled !== false; // Default to true if not explicitly false
      }
      resolve();
    });
  });
}

// Check if a brand is flagged
function isBrandFlagged(brandName) {
  // If extension is disabled or no brand name provided, return not flagged
  if (!isExtensionEnabled || !brandName) {
    return { flagged: false };
  }
  
  // Normalize brand name for comparison (lowercase)
  const normalizedBrandName = brandName.toLowerCase().trim();
  
  // Check each brand in our flagged list
  for (const brand in flaggedCompanies.brands) {
    const normalizedFlaggedBrand = brand.toLowerCase().trim();
    if (normalizedBrandName === normalizedFlaggedBrand || 
        normalizedBrandName.includes(normalizedFlaggedBrand) || 
        normalizedFlaggedBrand.includes(normalizedBrandName)) {
      return {
        flagged: flaggedCompanies.brands[brand].flag,
        reason: flaggedCompanies.brands[brand].reason
      };
    }
  }
  
  return { flagged: false };
}

// Create and insert warning element
function insertWarning(element, brand, reason) {
  // If element doesn't exist or extension is disabled, do nothing
  if (!element || !isExtensionEnabled) return;
  
  // Check if warning is already inserted for this element
  const existingWarning = element.parentNode.querySelector('.defund-fascists-warning');
  if (existingWarning) return;
  
  // Create the warning element
  const warning = document.createElement('div');
  warning.className = 'defund-fascists-warning';
  warning.innerHTML = `
    <div class="warning-header">⚠️ Warning: Problematic Brand</div>
    <div class="warning-content">
      <strong>${brand}</strong> has been flagged for:
      <p>${reason}</p>
    </div>
    <div class="warning-footer">
      <a href="#" class="warning-more-info">More Info</a>
    </div>
  `;
  
  // Insert warning before the element
  element.parentNode.insertBefore(warning, element);
  
  // Add click handler for "More Info"
  warning.querySelector('.warning-more-info').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.sendMessage({action: 'openInfoPage', brand: brand});
  });
}

// Amazon-specific page scanning logic
function scanAmazonPage() {
  if (!isExtensionEnabled) return;
  
  console.log('Scanning Amazon page...');

  // Handle product pages
  if (window.location.pathname.includes('/dp/')) {
    // Get product brand
    const brandElement = document.querySelector('#bylineInfo');
    if (brandElement) {
      const brandText = brandElement.textContent.trim().replace('Brand: ', '').replace('Visit the ', '').replace(' Store', '');
      console.log('Detected brand:', brandText);
      
      const { flagged, reason } = isBrandFlagged(brandText);
      
      if (flagged) {
        console.log('Flagged brand detected:', brandText, reason);
        insertWarning(document.querySelector('#title_feature_div'), brandText, reason);
      }
    }
  }
  
  // Handle search results
  const searchResults = document.querySelectorAll('[data-component-type="s-search-result"]');
  searchResults.forEach(result => {
    const brandElement = result.querySelector('h5.s-line-clamp-1');
    if (brandElement) {
      const brandText = brandElement.textContent.trim();
      const { flagged, reason } = isBrandFlagged(brandText);
      
      if (flagged) {
        insertWarning(result.querySelector('h2'), brandText, reason);
      }
    }
  });
}

// Walmart-specific page scanning logic
function scanWalmartPage() {
  if (!isExtensionEnabled) return;
  
  console.log('Scanning Walmart page...');
  
  // Handle product pages
  if (document.querySelector('[data-testid="product-title"]')) {
    // Get product brand
    const brandElement = document.querySelector('[data-testid="product-details-brand"]');
    if (brandElement) {
      const brandText = brandElement.textContent.trim();
      console.log('Detected brand:', brandText);
      
      const { flagged, reason } = isBrandFlagged(brandText);
      
      if (flagged) {
        console.log('Flagged brand detected:', brandText, reason);
        insertWarning(document.querySelector('[data-testid="product-title"]'), brandText, reason);
      }
    }
  }
  
  // Handle search results
  const searchResults = document.querySelectorAll('[data-testid="search-result-gridview-item"]');
  searchResults.forEach(result => {
    const titleElement = result.querySelector('[data-testid="product-title"]');
    if (titleElement) {
      // Try to extract brand from title or other attributes
      const titleText = titleElement.textContent.trim();
      // This is a simplistic approach; actual implementation might need refinement
      const potentialBrand = titleText.split(' ')[0];
      
      const { flagged, reason } = isBrandFlagged(potentialBrand);
      
      if (flagged) {
        insertWarning(titleElement, potentialBrand, reason);
      }
    }
  });
}

// Target-specific page scanning logic
function scanTargetPage() {
  if (!isExtensionEnabled) return;
  
  console.log('Scanning Target page...');
  
  // Handle product pages
  const brandElement = document.querySelector('[data-test="product-brand"]');
  if (brandElement) {
    const brandText = brandElement.textContent.trim();
    console.log('Detected brand:', brandText);
    
    const { flagged, reason } = isBrandFlagged(brandText);
    
    if (flagged) {
      console.log('Flagged brand detected:', brandText, reason);
      insertWarning(document.querySelector('[data-test="product-title"]'), brandText, reason);
    }
  }
  
  // Handle search results
  const searchResults = document.querySelectorAll('[data-test="product-card"]');
  searchResults.forEach(result => {
    const brandElement = result.querySelector('[data-test="product-card-brand"]');
    if (brandElement) {
      const brandText = brandElement.textContent.trim();
      const { flagged, reason } = isBrandFlagged(brandText);
      
      if (flagged) {
        insertWarning(result.querySelector('[data-test="product-card-title"]'), brandText, reason);
      }
    }
  });
}

// Handle DOM changes for dynamic content (using MutationObserver)
function observeDOMChanges() {
  // Don't observe if extension is disabled
  if (!isExtensionEnabled) return;
  
  const observer = new MutationObserver(mutations => {
    // If extension becomes disabled, disconnect the observer
    if (!isExtensionEnabled) {
      observer.disconnect();
      return;
    }
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Re-scan the page when significant DOM changes occur
        const domain = window.location.hostname;
        
        if (domain.includes('amazon.com')) {
          scanAmazonPage();
        } else if (domain.includes('walmart.com')) {
          scanWalmartPage();
        } else if (domain.includes('target.com')) {
          scanTargetPage();
        }
      }
    });
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Listen for changes to extension enabled state
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.isEnabled) {
      isExtensionEnabled = changes.isEnabled.newValue;
      
      if (isExtensionEnabled) {
        // Re-initialize if extension was enabled
        init();
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        // Disconnect observer if extension was disabled
        observer.disconnect();
        
        // Remove any existing warnings
        document.querySelectorAll('.defund-fascists-warning').forEach(warning => {
          warning.remove();
        });
      }
    }
  });
}

// Start the extension
// Wait for the page to be fully loaded
window.addEventListener('load', () => {
  init();
  observeDOMChanges();
});

// Also run immediately in case the page is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
  observeDOMChanges();
}
  