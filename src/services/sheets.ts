const SHEET_ID = 'ohh98Y3bE70k4h2szPeER7eCmUYDDGjrG73Qth8_a5k';
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY; // You'll need to add this to your .env file

export const fetchROIPercentage = async (): Promise<string> => {
  try {
    console.log('Fetching ROI from Google Sheets...');
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/I2?key=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Sheet API error (${response.status}):`, errorText);
      throw new Error(`Failed to fetch ROI data: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Sheet API response:', data);
    
    if (!data.values || !data.values[0] || !data.values[0][0]) {
      console.error('Unexpected data format:', data);
      return '117.98';
    }
    
    // Format the number to handle decimal places appropriately
    const rawValue = data.values[0][0];
    const numericValue = typeof rawValue === 'string' ? parseFloat(rawValue) : rawValue;
    
    if (isNaN(numericValue)) {
      console.error('Non-numeric value received:', rawValue);
      return '117.98';
    }
    
    return numericValue.toString();
  } catch (error) {
    console.error('Error fetching ROI:', error);
    return '68'; // Fallback value if fetch fails
  }
}; 