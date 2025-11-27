/**
 * Test file for thumbnail resolver functionality
 * This file contains test cases to verify the hierarchical thumbnail resolution logic
 */

import { 
  resolveThumbnail, 
  resolveThumbnailSync, 
  extractVideoFromContent,
  extractVideoInfo,
  getVideoThumbnail,
  extractIframeSources,
  extractImageSources
} from './thumbnailResolver';

// Test data
const testContent = {
  withYouTubeVideo: `
    <p>Check out this video:</p>
    <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" frameborder="0" allowfullscreen></iframe>
    <p>Great content!</p>
  `,
  
  withVimeoVideo: `
    <p>Vimeo video:</p>
    <iframe src="https://player.vimeo.com/video/123456789" width="640" height="360" frameborder="0" allowfullscreen></iframe>
  `,
  
  withImages: `
    <p>Here are some images:</p>
    <img src="https://example.com/image1.jpg" alt="First image" />
    <p>Some text</p>
    <img src="https://example.com/image2.png" alt="Second image" />
  `,
  
  withVideoAndImages: `
    <p>Mixed content:</p>
    <img src="https://example.com/image1.jpg" alt="First image" />
    <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" frameborder="0" allowfullscreen></iframe>
    <img src="https://example.com/image2.png" alt="Second image" />
  `,
  
  empty: '',
  
  textOnly: '<p>Just some text content without any media</p>'
};

// Test functions
export const runThumbnailTests = () => {
  console.log('🧪 Running Thumbnail Resolver Tests...\n');

  // Test 1: Extract video info
  console.log('Test 1: Extract Video Info');
  const youtubeInfo = extractVideoInfo('https://www.youtube.com/embed/dQw4w9WgXcQ');
  console.log('YouTube:', youtubeInfo);
  
  const vimeoInfo = extractVideoInfo('https://player.vimeo.com/video/123456789');
  console.log('Vimeo:', vimeoInfo);
  
  const invalidInfo = extractVideoInfo('https://example.com/not-a-video');
  console.log('Invalid URL:', invalidInfo);
  console.log('');

  // Test 2: Get video thumbnails
  console.log('Test 2: Get Video Thumbnails');
  if (youtubeInfo) {
    console.log('YouTube thumbnail:', getVideoThumbnail(youtubeInfo));
  }
  if (vimeoInfo) {
    console.log('Vimeo thumbnail:', getVideoThumbnail(vimeoInfo));
  }
  console.log('');

  // Test 3: Extract iframe sources
  console.log('Test 3: Extract Iframe Sources');
  console.log('YouTube content:', extractIframeSources(testContent.withYouTubeVideo));
  console.log('Vimeo content:', extractIframeSources(testContent.withVimeoVideo));
  console.log('Mixed content:', extractIframeSources(testContent.withVideoAndImages));
  console.log('');

  // Test 4: Extract image sources
  console.log('Test 4: Extract Image Sources');
  console.log('Images content:', extractImageSources(testContent.withImages));
  console.log('Mixed content:', extractImageSources(testContent.withVideoAndImages));
  console.log('Text only:', extractImageSources(testContent.textOnly));
  console.log('');

  // Test 5: Extract video from content
  console.log('Test 5: Extract Video from Content');
  console.log('YouTube content:', extractVideoFromContent(testContent.withYouTubeVideo));
  console.log('Vimeo content:', extractVideoFromContent(testContent.withVimeoVideo));
  console.log('Images only:', extractVideoFromContent(testContent.withImages));
  console.log('');

  // Test 6: Synchronous thumbnail resolution
  console.log('Test 6: Synchronous Thumbnail Resolution');
  
  // Priority 1: Manual thumbnail
  console.log('Manual thumbnail:', resolveThumbnailSync({
    manualThumbnail: 'https://example.com/manual-thumb.jpg',
    content: testContent.withYouTubeVideo
  }));
  
  // Priority 2: Video thumbnail
  console.log('Video thumbnail:', resolveThumbnailSync({
    manualThumbnail: '',
    content: testContent.withYouTubeVideo
  }));
  
  // Priority 3: First image
  console.log('First image:', resolveThumbnailSync({
    manualThumbnail: '',
    content: testContent.withImages
  }));
  
  // Priority 4: Default
  console.log('Default thumbnail:', resolveThumbnailSync({
    manualThumbnail: '',
    content: testContent.textOnly
  }));
  console.log('');

  console.log('✅ All tests completed!');
};

// Test scenarios for different content types
export const testScenarios = [
  {
    name: 'Manual Thumbnail Priority',
    data: {
      manualThumbnail: 'https://example.com/manual-thumb.jpg',
      content: testContent.withYouTubeVideo
    },
    expectedPriority: 1,
    description: 'Should use manual thumbnail even when video is present'
  },
  
  {
    name: 'Video Thumbnail Priority',
    data: {
      manualThumbnail: '',
      content: testContent.withYouTubeVideo
    },
    expectedPriority: 2,
    description: 'Should extract YouTube video thumbnail'
  },
  
  {
    name: 'First Image Priority',
    data: {
      manualThumbnail: '',
      content: testContent.withImages
    },
    expectedPriority: 3,
    description: 'Should use first image from content'
  },
  
  {
    name: 'Default Thumbnail Fallback',
    data: {
      manualThumbnail: '',
      content: testContent.textOnly
    },
    expectedPriority: 4,
    description: 'Should use default thumbnail when no media found'
  },
  
  {
    name: 'Mixed Content - Video Priority',
    data: {
      manualThumbnail: '',
      content: testContent.withVideoAndImages
    },
    expectedPriority: 2,
    description: 'Should prioritize video over images in mixed content'
  }
];

// Run tests in browser console
if (typeof window !== 'undefined') {
  window.testThumbnailResolver = runThumbnailTests;
  window.thumbnailTestScenarios = testScenarios;
}

export default {
  runThumbnailTests,
  testScenarios,
  testContent
};
