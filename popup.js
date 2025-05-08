// Popup script for Defund Fascists extension

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const extensionToggle = document.getElementById('extensionToggle');
  const dbVersionElem = document.getElementById('dbVersion');
  const companiesCountElem = document.getElementById('companiesCount');
  const lastUpdatedElem = document.getElementById('lastUpdated');
  const updateDbButton = document.getElementById('updateDb');
  const reportCompanyButton = document.getElementById('reportCompany');
  const statusDiv = document.querySelector('.status');
  const statusIcon = document.querySelector('.status-icon');
  const statusText = document.querySelector('.status-text');
  
  // Load extension state
  const { isEnabled = true } = await chrome.storage.local.get('isEnabled');
  extensionToggle.checked = isEnabled;
  updateStatusDisplay(isEnabled);
  
  // Load data stats
  loadStats();
  
  // Event Listeners
  extensionToggle.addEventListener('change', async () => {
    const isEnabled = extensionToggle.checked;
    await chrome.storage.local.set({ isEnabled });
    updateStatusDisplay(isEnabled);
  });
  
  updateDbButton.addEventListener('click', async () => {
    updateDbButton.textContent = 'Updating...';
    updateDbButton.disabled = true;
    
    try {
      // Send message to background script to update data
      await chrome.runtime.sendMessage({ action: 'manualUpdate' });
      
      // Refresh stats
      await loadStats();
      
      updateDbButton.textContent = 'Updated!';
      setTimeout(() => {
        updateDbButton.textContent = 'Update database';
        updateDbButton.disabled = false;
      }, 2000);
    } catch (error) {
      updateDbButton.textContent = 'Error!';
      console.error('Failed to update database:', error);
      setTimeout(() => {
        updateDbButton.textContent = 'Update database';
        updateDbButton.disabled = false;
      }, 2000);
    }
  });
  
  reportCompanyButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/defundfascists/defundfascists-plugin/issues/new?template=company_report.md' });
  });
  
  // Helper functions
  function updateStatusDisplay(isEnabled) {
    if (isEnabled) {
      statusDiv.className = 'status active';
      statusIcon.textContent = '✓';
      statusText.textContent = 'Extension active';
    } else {
      statusDiv.className = 'status inactive';
      statusIcon.textContent = '✕';
      statusText.textContent = 'Extension disabled';
    }
  }
  
  async function loadStats() {
    try {
      // Get current data
      const { flaggedCompanies, lastUpdate } = await chrome.storage.local.get(['flaggedCompanies', 'lastUpdate']);
      
      if (flaggedCompanies && flaggedCompanies.brands) {
        // Count flagged companies
        const flaggedCount = Object.keys(flaggedCompanies.brands).filter(
          brand => flaggedCompanies.brands[brand].flag
        ).length;
        
        companiesCountElem.textContent = flaggedCount;
        
        // Get version if available
        if (flaggedCompanies.version) {
          dbVersionElem.textContent = flaggedCompanies.version;
        }
      } else {
        companiesCountElem.textContent = '0';
      }
      
      // Format last update time
      if (lastUpdate) {
        const date = new Date(lastUpdate);
        lastUpdatedElem.textContent = date.toLocaleString();
      } else {
        lastUpdatedElem.textContent = 'Never';
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      companiesCountElem.textContent = 'Error';
      lastUpdatedElem.textContent = 'Error';
    }
  }
}); 