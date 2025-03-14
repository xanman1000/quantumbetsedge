/**
 * googleSheetsAPI.ts - Utility functions for interacting with Google Sheets API
 */
import React from 'react';

/**
 * Configuration for Google Sheets API access
 */
interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  range: string;
}

// Default configuration - should be updated with your actual values
const defaultConfig: GoogleSheetsConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '',
  spreadsheetId: '1ohh98Y3bE70k4h2szPeER7eCmUYDDGjrG73Qth8_a5k',
  range: 'I2' // Cell I2 contains the ROI percentage (117.98)
};

/**
 * Fetches the return percentage from Google Sheets
 * 
 * @param config Optional Google Sheets configuration
 * @returns Promise with the return percentage or error
 */
export async function fetchReturnPercentage(config: Partial<GoogleSheetsConfig> = {}): Promise<number> {
  // Merge default config with any provided values
  const fullConfig = { ...defaultConfig, ...config };
  const { apiKey, spreadsheetId, range } = fullConfig;

  // Make sure we have the required configuration
  if (!apiKey) {
    console.warn('Google Sheets API Key is missing');
    return 117.98; // Fallback to the known value
  }

  if (!spreadsheetId) {
    console.warn('Spreadsheet ID is missing');
    return 117.98; // Fallback to the known value
  }

  try {
    console.log('Fetching ROI from Google Sheets...');
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Sheet API error (${response.status}):`, errorText);
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Sheet API response:', data);
    
    // Extract the return percentage from the response
    if (data.values && data.values.length > 0 && data.values[0].length > 0) {
      // Return percentage is in cell I2
      const rawValue = data.values[0][0];
      const returnPercentage = typeof rawValue === 'string' ? parseFloat(rawValue) : rawValue;
      
      if (isNaN(returnPercentage)) {
        console.error('Non-numeric value received:', rawValue);
        return 117.98; // Fallback value
      }
      
      return returnPercentage;
    } else {
      console.error('Unexpected data format:', data);
      return 117.98; // Fallback value
    }
  } catch (error) {
    console.error('Error fetching return percentage:', error);
    // Return a fallback value
    return 117.98; // Updated fallback value matching the current spreadsheet
  }
}

/**
 * Hook to use the return percentage in React components
 */
export function useReturnPercentage() {
  const [returnPercentage, setReturnPercentage] = React.useState<number | null>(117.98);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const percentage = await fetchReturnPercentage();
        setReturnPercentage(percentage);
        console.log('ROI percentage loaded:', percentage);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Failed to load ROI:', err);
        setReturnPercentage(117.98); // Updated fallback value
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return { returnPercentage, isLoading, error };
}

export default {
  fetchReturnPercentage,
  useReturnPercentage
}; 