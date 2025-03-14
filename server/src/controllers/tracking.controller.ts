import { Request, Response } from 'express';
import { trackOpen, trackClick } from '../services/delivery.service';

/**
 * Track email opens
 */
export const trackEmailOpen = async (req: Request, res: Response) => {
  try {
    const { trackingId } = req.params;
    
    if (!trackingId) {
      // Return a 1x1 transparent pixel without any status indication
      return sendTrackingPixel(res);
    }
    
    // Track the open event asynchronously without waiting
    trackOpen(trackingId).catch(error => {
      console.error(`Error tracking open for ${trackingId}:`, error);
    });
    
    // Return a 1x1 transparent pixel to the email client
    return sendTrackingPixel(res);
  } catch (error) {
    console.error('Error in trackEmailOpen:', error);
    // Still return a tracking pixel to avoid errors in email clients
    return sendTrackingPixel(res);
  }
};

/**
 * Track email link clicks
 */
export const trackEmailClick = async (req: Request, res: Response) => {
  try {
    const { trackingId } = req.params;
    const { url } = req.query;
    
    if (!trackingId || !url) {
      return res.status(400).json({
        success: false,
        message: 'Missing tracking ID or URL'
      });
    }
    
    // Track the click event asynchronously without waiting
    trackClick(trackingId).catch(error => {
      console.error(`Error tracking click for ${trackingId}:`, error);
    });
    
    // Redirect to the original URL
    return res.redirect(url as string);
  } catch (error) {
    console.error('Error in trackEmailClick:', error);
    
    // If there's an error, redirect to the site's homepage
    const fallbackUrl = process.env.SITE_URL || 'https://quantumbets.com';
    return res.redirect(fallbackUrl);
  }
};

/**
 * Helper function to send a 1x1 transparent tracking pixel
 */
const sendTrackingPixel = (res: Response) => {
  // Define a 1x1 transparent GIF
  const transparentPixel = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );
  
  // Set headers
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Send the pixel
  return res.end(transparentPixel);
};

export default {
  trackEmailOpen,
  trackEmailClick
}; 