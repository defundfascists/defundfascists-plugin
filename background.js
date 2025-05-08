// URL to fetch the latest flagged companies data
const DATA_URL = 'https://raw.githubusercontent.com/defundfascists/defundfascists-plugin/main/flagged_companies.json';
// How often to update the data (in milliseconds) - 24 hours
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000;

// Initial setup when extension is installed or updated
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Defund Fascists extension installed');
  
  // Load initial data from local file
  const localData = await fetch(chrome.runtime.getURL('flagged_companies.json'))
    .then(response => response.json())
    .catch(error => {
      console.error('Error loading initial data:', error);
      return { brands: {} };
    });
  
  // Store initial data
  await chrome.storage.local.set({ flaggedCompanies: localData });
  
  // Set last update time
  await chrome.storage.local.set({ lastUpdate: Date.now() });
  
  // Set default enabled state
  await chrome.storage.local.set({ isEnabled: true });
  
  // Fetch fresh data from remote source
  updateFlaggedCompanies();
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getFlaggedCompanies') {
    chrome.storage.local.get(['flaggedCompanies', 'isEnabled'], result => {
      sendResponse({ 
        data: result.flaggedCompanies,
        isEnabled: result.isEnabled 
      });
    });
    return true; // Required for async response
  }
  
  if (message.action === 'manualUpdate') {
    updateFlaggedCompanies()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Required for async response
  }
  
  if (message.action === 'openInfoPage') {
    chrome.tabs.create({
      url: `https://github.com/defundfascists/defundfascists-plugin/wiki/Companies/${encodeURIComponent(message.brand)}`
    });
  }
});

// Update the flagged companies data from remote source
async function updateFlaggedCompanies() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Add version if not present
    if (!data.version) {
      data.version = '1.0';
    }
    
    // Store updated data
    await chrome.storage.local.set({ flaggedCompanies: data });
    await chrome.storage.local.set({ lastUpdate: Date.now() });
    
    console.log('Flagged companies data updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating flagged companies data:', error);
    throw error;
  }
}

// Schedule periodic updates
function scheduleUpdates() {
  // Check if we need to update the data
  chrome.storage.local.get(['lastUpdate'], ({ lastUpdate }) => {
    const currentTime = Date.now();
    
    if (!lastUpdate || (currentTime - lastUpdate > UPDATE_INTERVAL)) {
      console.log('Data needs updating');
      updateFlaggedCompanies();
    } else {
      // Schedule the next update
      const timeToNextUpdate = UPDATE_INTERVAL - (currentTime - lastUpdate);
      setTimeout(updateFlaggedCompanies, timeToNextUpdate);
    }
  });
}

// Check for updates when the browser starts
chrome.runtime.onStartup.addListener(() => {
  scheduleUpdates();
});
