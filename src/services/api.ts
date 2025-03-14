import axios from 'axios';

// API base URL - use environment variable in production
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Determine if we should use mock data (when API server is not available)
const useMockApi = true; // Set to false when your backend is running

// API instance with default config
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests when available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock data for development
const mockData = {
  latestNewsletter: {
    id: 'nl-2023-11-10',
    title: 'QuantumBets Edge: Week 10 NFL Insights',
    date: '2023-11-10T08:00:00Z',
    summary: 'Our proprietary algorithm has identified high-value opportunities in this week\'s NFL matchups.',
    content: `
      <h2>Week 10 NFL Analysis</h2>
      <p>Welcome to your QuantumBets Edge newsletter. Our AI has analyzed thousands of data points to identify the highest probability outcomes for this weekend's games.</p>
      <h3>Top Picks This Week:</h3>
      <ul>
        <li>Kansas City Chiefs -7.5 (85% confidence)</li>
        <li>Dallas Cowboys ML (72% confidence)</li>
        <li>Buffalo Bills/Denver Broncos Under 49.5 (78% confidence)</li>
      </ul>
      <p>For full analysis and additional picks, check your premium dashboard.</p>
    `,
    previewContent: `
      <h2>Week 10 NFL Analysis</h2>
      <p>Welcome to your QuantumBets Edge newsletter. Our AI has analyzed thousands of data points to identify the highest probability outcomes...</p>
      <p><strong>Subscribe to view the full content including our top picks with confidence ratings!</strong></p>
    `
  },
  newsletterArchive: [
    {
      id: 'nl-2023-11-10',
      title: 'QuantumBets Edge: Week 10 NFL Insights',
      date: '2023-11-10T08:00:00Z',
      summary: 'Our proprietary algorithm has identified high-value opportunities in this week\'s NFL matchups.'
    },
    {
      id: 'nl-2023-11-03',
      title: 'QuantumBets Edge: Week 9 NFL Predictions',
      date: '2023-11-03T08:00:00Z',
      summary: 'Detailed analysis of key matchups and value betting opportunities for NFL Week 9.'
    },
    {
      id: 'nl-2023-10-27',
      title: 'QuantumBets Edge: NBA Opening Week Special',
      date: '2023-10-27T08:00:00Z',
      summary: 'Special edition covering NBA season openers with advanced statistical projections.'
    }
  ]
};

// Newsletter API functions
export const newsletterApi = {
  // Get the latest newsletter content (sample or full based on subscription)
  getLatestNewsletter: async (includeFullContent = false) => {
    try {
      if (useMockApi) {
        // Return mock data
        return {
          success: true,
          data: {
            ...mockData.latestNewsletter,
            content: includeFullContent ? mockData.latestNewsletter.content : mockData.latestNewsletter.previewContent
          }
        };
      }
      
      const response = await api.get('/content', {
        params: { full: includeFullContent }
      });
      return response.data;
    } catch (error) {
      if (useMockApi) {
        console.warn('Using mock data due to API error');
        return {
          success: true,
          data: {
            ...mockData.latestNewsletter,
            content: includeFullContent ? mockData.latestNewsletter.content : mockData.latestNewsletter.previewContent
          }
        };
      }
      console.error('Error fetching latest newsletter:', error);
      throw error;
    }
  },

  // Get newsletters for the archive
  getNewsletterArchive: async (params = {}) => {
    try {
      if (useMockApi) {
        return {
          success: true,
          data: mockData.newsletterArchive
        };
      }
      
      const response = await api.get('/content/archive', { params });
      return response.data;
    } catch (error) {
      if (useMockApi) {
        console.warn('Using mock data due to API error');
        return {
          success: true,
          data: mockData.newsletterArchive
        };
      }
      console.error('Error fetching newsletter archive:', error);
      throw error;
    }
  },

  // Get a specific newsletter by ID
  getNewsletterById: async (id) => {
    try {
      if (useMockApi) {
        const newsletter = mockData.newsletterArchive.find(item => item.id === id);
        return {
          success: true,
          data: newsletter || mockData.latestNewsletter
        };
      }
      
      const response = await api.get(`/content/${id}`);
      return response.data;
    } catch (error) {
      if (useMockApi) {
        console.warn('Using mock data due to API error');
        const newsletter = mockData.newsletterArchive.find(item => item.id === id);
        return {
          success: true,
          data: newsletter || mockData.latestNewsletter
        };
      }
      console.error(`Error fetching newsletter with ID ${id}:`, error);
      throw error;
    }
  },

  // Subscribe to the newsletter
  subscribe: async (email, name, phone, subscriptionTier) => {
    try {
      if (useMockApi) {
        return {
          success: true,
          message: `Subscription successful for ${email}`,
          data: { email, name, phone, subscriptionTier, status: 'active' }
        };
      }
      
      const response = await api.post('/subscribers', {
        email,
        name,
        phone,
        subscriptionTier
      });
      return response.data;
    } catch (error) {
      if (useMockApi) {
        console.warn('Using mock data due to API error');
        return {
          success: true,
          message: `Subscription successful for ${email}`,
          data: { email, name, phone, subscriptionTier, status: 'active' }
        };
      }
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  },

  // Update subscription preferences
  updateSubscription: async (email, preferences) => {
    try {
      if (useMockApi) {
        return {
          success: true,
          message: `Subscription updated for ${email}`,
          data: { email, ...preferences, status: 'active' }
        };
      }
      
      const response = await api.patch('/subscribers', {
        email,
        ...preferences
      });
      return response.data;
    } catch (error) {
      if (useMockApi) {
        console.warn('Using mock data due to API error');
        return {
          success: true,
          message: `Subscription updated for ${email}`,
          data: { email, ...preferences, status: 'active' }
        };
      }
      console.error('Error updating subscription:', error);
      throw error;
    }
  },

  // Unsubscribe from newsletter
  unsubscribe: async (email) => {
    try {
      if (useMockApi) {
        return {
          success: true,
          message: `Successfully unsubscribed ${email}`,
          data: { email, status: 'unsubscribed' }
        };
      }
      
      const response = await api.delete('/subscribers', {
        data: { email }
      });
      return response.data;
    } catch (error) {
      if (useMockApi) {
        console.warn('Using mock data due to API error');
        return {
          success: true,
          message: `Successfully unsubscribed ${email}`,
          data: { email, status: 'unsubscribed' }
        };
      }
      console.error('Error unsubscribing from newsletter:', error);
      throw error;
    }
  }
};

export default api; 