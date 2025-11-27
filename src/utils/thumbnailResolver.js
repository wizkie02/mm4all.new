/**
 * Hierarchical Thumbnail Resolution Utility
 * Resolves thumbnails based on priority order:
 * 1. Manual thumbnail URL (highest priority)
 * 2. Video thumbnail extraction from embedded videos
 * 3. First image from post content
 * 4. Default placeholder image (fallback)
 */

// Default placeholder image
const DEFAULT_THUMBNAIL = '/images/default-post-thumbnail.svg';

/**
 * Extract video ID and platform from various video URLs
 * @param {string} url - Video URL or embed URL
 * @returns {object|null} - {platform, videoId} or null if not a video
 */
const extractVideoInfo = (url) => {
  if (!url) return null;

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) {
      return { platform: 'youtube', videoId: match[1] };
    }
  }

  // Vimeo patterns
  const vimeoPatterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/
  ];

  for (const pattern of vimeoPatterns) {
    const match = url.match(pattern);
    if (match) {
      return { platform: 'vimeo', videoId: match[1] };
    }
  }

  // Dailymotion patterns
  const dailymotionPattern = /dailymotion\.com\/(?:video\/|embed\/video\/)([a-zA-Z0-9]+)/;
  const dailymotionMatch = url.match(dailymotionPattern);
  if (dailymotionMatch) {
    return { platform: 'dailymotion', videoId: dailymotionMatch[1] };
  }

  return null;
};

/**
 * Generate thumbnail URL from video info
 * @param {object} videoInfo - {platform, videoId}
 * @returns {string} - Thumbnail URL
 */
const getVideoThumbnail = (videoInfo) => {
  if (!videoInfo) return null;

  const { platform, videoId } = videoInfo;

  switch (platform) {
    case 'youtube':
      // Try high quality first, fallback to medium quality
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    case 'vimeo':
      // Vimeo requires API call, but we can use a common pattern
      // Note: This might need to be enhanced with actual API calls
      return `https://vumbnail.com/${videoId}.jpg`;
    
    case 'dailymotion':
      return `https://www.dailymotion.com/thumbnail/video/${videoId}`;
    
    default:
      return null;
  }
};

/**
 * Extract iframe sources from HTML content
 * @param {string} htmlContent - HTML content to parse
 * @returns {Array} - Array of iframe src URLs
 */
const extractIframeSources = (htmlContent) => {
  if (!htmlContent) return [];

  const iframeSources = [];
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const iframes = tempDiv.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    const src = iframe.getAttribute('src');
    if (src) {
      iframeSources.push(src);
    }
  });

  return iframeSources;
};

/**
 * Extract image sources from HTML content
 * @param {string} htmlContent - HTML content to parse
 * @returns {Array} - Array of image src URLs
 */
const extractImageSources = (htmlContent) => {
  if (!htmlContent) return [];

  const imageSources = [];
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const images = tempDiv.querySelectorAll('img');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('data:')) { // Skip base64 images
      imageSources.push(src);
    }
  });

  return imageSources;
};

/**
 * Validate if URL is a valid image
 * @param {string} url - Image URL to validate
 * @returns {Promise<boolean>} - True if valid image
 */
const isValidImageUrl = async (url) => {
  if (!url) return false;

  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && contentType && contentType.startsWith('image/');
  } catch (error) {
    console.warn('Error validating image URL:', url, error);
    return false;
  }
};

/**
 * Main thumbnail resolution function
 * @param {object} options - Resolution options
 * @param {string} options.manualThumbnail - Manual thumbnail URL (Priority 1)
 * @param {string} options.content - Post HTML content
 * @param {string} options.defaultThumbnail - Custom default thumbnail
 * @returns {Promise<string>} - Resolved thumbnail URL
 */
export const resolveThumbnail = async ({
  manualThumbnail,
  content,
  defaultThumbnail = DEFAULT_THUMBNAIL
}) => {
  // Priority 1: Manual thumbnail URL
  if (manualThumbnail && manualThumbnail.trim()) {
    const isValid = await isValidImageUrl(manualThumbnail.trim());
    if (isValid) {
      return manualThumbnail.trim();
    }
  }

  // Priority 2: Video thumbnail extraction
  if (content) {
    const iframeSources = extractIframeSources(content);
    
    for (const iframeUrl of iframeSources) {
      const videoInfo = extractVideoInfo(iframeUrl);
      if (videoInfo) {
        const videoThumbnail = getVideoThumbnail(videoInfo);
        if (videoThumbnail) {
          const isValid = await isValidImageUrl(videoThumbnail);
          if (isValid) {
            return videoThumbnail;
          }
        }
      }
    }
  }

  // Priority 3: First image from post content
  if (content) {
    const imageSources = extractImageSources(content);
    
    for (const imageUrl of imageSources) {
      const isValid = await isValidImageUrl(imageUrl);
      if (isValid) {
        return imageUrl;
      }
    }
  }

  // Priority 4: Default placeholder image
  return defaultThumbnail;
};

/**
 * Synchronous version for immediate use (without validation)
 * @param {object} options - Resolution options
 * @returns {string} - Resolved thumbnail URL (may not be validated)
 */
export const resolveThumbnailSync = ({
  manualThumbnail,
  content,
  defaultThumbnail = DEFAULT_THUMBNAIL
}) => {
  // Priority 1: Manual thumbnail URL
  if (manualThumbnail && manualThumbnail.trim()) {
    return manualThumbnail.trim();
  }

  // Priority 2: Video thumbnail extraction
  if (content) {
    const iframeSources = extractIframeSources(content);
    
    for (const iframeUrl of iframeSources) {
      const videoInfo = extractVideoInfo(iframeUrl);
      if (videoInfo) {
        const videoThumbnail = getVideoThumbnail(videoInfo);
        if (videoThumbnail) {
          return videoThumbnail;
        }
      }
    }
  }

  // Priority 3: First image from post content
  if (content) {
    const imageSources = extractImageSources(content);
    if (imageSources.length > 0) {
      return imageSources[0];
    }
  }

  // Priority 4: Default placeholder image
  return defaultThumbnail;
};

/**
 * Extract video info from content for preview purposes
 * @param {string} content - HTML content
 * @returns {object|null} - Video info or null
 */
export const extractVideoFromContent = (content) => {
  if (!content) return null;

  const iframeSources = extractIframeSources(content);
  
  for (const iframeUrl of iframeSources) {
    const videoInfo = extractVideoInfo(iframeUrl);
    if (videoInfo) {
      return {
        ...videoInfo,
        thumbnailUrl: getVideoThumbnail(videoInfo),
        embedUrl: iframeUrl
      };
    }
  }

  return null;
};

export default {
  resolveThumbnail,
  resolveThumbnailSync,
  extractVideoFromContent,
  extractVideoInfo,
  getVideoThumbnail,
  extractIframeSources,
  extractImageSources
};
