import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiTrash2, FiAlignLeft, FiAlignCenter, FiAlignRight, FiImage, FiCheck, FiX } from 'react-icons/fi';
// Error Boundary cho ImageToolbar
class ImageToolbarErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '12px',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#dc2626',
          fontSize: '12px'
        }}>
          Something went wrong with the image toolbar.
        </div>
      );
    }
    return this.props.children;
  }
}
const ToolbarContainer = styled.div`
  position: absolute;
  z-index: 1000;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 12px;
  min-width: 320px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background: white;
    border: 1px solid #e1e5e9;
    border-bottom: none;
    border-right: none;
    transform: translateX(-50%) rotate(45deg);
  }
`;
const ToolbarSection = styled.div`
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
`;
const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;
const PresetButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
    border-color: ${props => props.active ? '#2563eb' : '#d1d5db'};
  }
`;
const AlignButton = styled.button`
  padding: 8px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
    border-color: ${props => props.active ? '#2563eb' : '#d1d5db'};
  }
`;
const ActionButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${props => props.danger ? '#dc2626' : '#e1e5e9'};
  border-radius: 4px;
  background: ${props => props.danger ? '#dc2626' : 'white'};
  color: ${props => props.danger ? 'white' : '#374151'};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover {
    background: ${props => props.danger ? '#b91c1c' : '#f9fafb'};
    border-color: ${props => props.danger ? '#b91c1c' : '#d1d5db'};
  }
`;

const ZoomButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 10px;
  background: ${props => props.active ? '#3b82f6' : '#f8fafc'};
  color: ${props => props.active ? 'white' : '#374151'};
  border: 1px solid ${props => props.active ? '#3b82f6' : '#d1d5db'};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 50px;

  &:hover {
    background: ${props => props.active ? '#2563eb' : '#e2e8f0'};
    border-color: ${props => props.active ? '#2563eb' : '#94a3b8'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ZoomSlider = styled.input`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
  margin: 8px 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  &::-webkit-slider-thumb:hover {
    background: #2563eb;
    transform: scale(1.1);
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: none;
  }
`;
const CustomSizeSection = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
const SizeInput = styled.input`
  width: 60px;
  padding: 4px 6px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;
const AltTextInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  font-size: 12px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;
const PRESET_SIZES = [
  { label: 'Tiny', width: 150, icon: '🔍' },
  { label: 'Small', width: 250, icon: '📱' },
  { label: 'Medium', width: 400, icon: '💻' },
  { label: 'Large', width: 600, icon: '🖥️' },
  { label: 'X-Large', width: 800, icon: '📺' },
  { label: 'Full', width: 1000, icon: '🖼️' },
  { label: 'Original', width: null, icon: '🔄' }
];

// Quick zoom actions
const ZOOM_ACTIONS = [
  { label: 'Zoom Out', factor: 0.8, icon: '🔍-' },
  { label: 'Zoom In', factor: 1.2, icon: '🔍+' },
  { label: '50%', factor: 0.5, icon: '½' },
  { label: '100%', factor: 1.0, icon: '1:1' },
  { label: '150%', factor: 1.5, icon: '1.5x' },
  { label: '200%', factor: 2.0, icon: '2x' }
];
const ALIGNMENTS = [
  { label: 'Left', value: 'left', icon: FiAlignLeft },
  { label: 'Center', value: 'center', icon: FiAlignCenter },
  { label: 'Right', value: 'right', icon: FiAlignRight }
];
export const ImageToolbar = ({
  editor,
  imageNode,
  position,
  onClose,
  showNotification // Add notification support
}) => {
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [altText, setAltText] = useState('');
  const [currentAlignment, setCurrentAlignment] = useState('left');
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [sliderValue, setSliderValue] = useState(100);
  const toolbarRef = useRef(null);
  useEffect(() => {
    if (imageNode && editor) {
      try {
        // Get the position of the image node in TipTap
        const pos = editor.view.posAtDOM(imageNode, 0);
        // Validate position
        if (pos < 0 || pos >= editor.state.doc.content.size) {
          return;
        }
        const node = editor.state.doc.nodeAt(pos);
        if (node && node.type.name === 'image') {
          const attrs = node.attrs;
          // Set size from TipTap node attributes
          const width = attrs.width ? parseInt(attrs.width) : '';
          const height = attrs.height ? parseInt(attrs.height) : '';
          setCustomWidth(width);
          setCustomHeight(height);
          setAltText(attrs.alt || '');
          // Detect alignment from parent paragraph
          try {
            const $pos = editor.state.doc.resolve(pos);
            const parentPos = $pos.start() - 1;
            if (parentPos >= 0 && parentPos < editor.state.doc.content.size) {
              const parentNode = editor.state.doc.nodeAt(parentPos);
              if (parentNode && parentNode.attrs && parentNode.attrs.textAlign) {
                setCurrentAlignment(parentNode.attrs.textAlign);
              } else {
                setCurrentAlignment('left');
              }
            } else {
              setCurrentAlignment('left');
            }
          } catch (alignError) {
            setCurrentAlignment('left');
          }
        }
      } catch (error) {
        // Fallback: try to get info from DOM element
        const img = imageNode.querySelector('img');
        if (img) {
          setCustomWidth(img.width || '');
          setCustomHeight(img.height || '');
          setAltText(img.alt || '');
          setCurrentAlignment('left');
        }
      }
    }
  }, [imageNode, editor]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  const getCurrentImageSize = () => {
    if (!imageNode || !editor) return { width: null, height: null };
    try {
      // Get size from TipTap node attributes
      const pos = editor.view.posAtDOM(imageNode, 0);
      // Validate position
      if (pos < 0 || pos >= editor.state.doc.content.size) {
        return { width: null, height: null };
      }
      const node = editor.state.doc.nodeAt(pos);
      if (!node || node.type.name !== 'image') return { width: null, height: null };
      const attrs = node.attrs;
      return {
        width: attrs.width ? parseInt(attrs.width) : null,
        height: attrs.height ? parseInt(attrs.height) : null
      };
    } catch (error) {
      return { width: null, height: null };
    }
  };
  const applyPresetSize = (presetWidth) => {
    if (!editor || !imageNode) return;
    const img = imageNode.querySelector('img');
    if (!img) return;
    try {
      // Get the position of the image node in TipTap
      const pos = editor.view.posAtDOM(imageNode, 0);
      // Validate position
      if (pos < 0 || pos >= editor.state.doc.content.size) {
        return;
      }
      const node = editor.state.doc.nodeAt(pos);
      if (!node || node.type.name !== 'image') return;
      if (presetWidth === null) {
        // Original size - remove size attributes
        editor.chain().focus().updateAttributes('image', {
          width: null,
          height: null
        }).run();
        // Update UI
        setCustomWidth('');
        setCustomHeight('');
        if (showNotification) {
          showNotification('Image reset to original size', 'success');
        }
      } else {
        // Calculate proportional height
        const naturalWidth = img.naturalWidth || img.width || 400;
        const naturalHeight = img.naturalHeight || img.height || 300;
        const aspectRatio = naturalHeight / naturalWidth;
        const newHeight = Math.round(presetWidth * aspectRatio);
        // Update TipTap node attributes
        editor.chain().focus().updateAttributes('image', {
          width: `${presetWidth}px`,
          height: `${newHeight}px`
        }).run();
        // Update UI
        setCustomWidth(presetWidth);
        setCustomHeight(newHeight);
        if (showNotification) {
          const sizeName = PRESET_SIZES.find(s => s.width === presetWidth)?.label || 'Custom';
          showNotification(`Image resized to ${sizeName} (${presetWidth}×${newHeight}px)`, 'success');
        }
      }
    } catch (error) {
      if (showNotification) {
        showNotification('Error resizing image', 'error');
      }
    }
  };
  // Apply zoom factor to current image size
  const applyZoomFactor = (factor) => {
    if (!editor || !imageNode) return;

    try {
      const pos = editor.view.posAtDOM(imageNode, 0);
      if (pos < 0 || pos >= editor.state.doc.content.size) return;

      const node = editor.state.doc.nodeAt(pos);
      if (!node || node.type.name !== 'image') return;

      // Get current size or use natural size
      const img = imageNode.querySelector('img');
      if (!img) return;

      const currentWidth = parseInt(customWidth) || img.naturalWidth || 400;
      const currentHeight = parseInt(customHeight) || img.naturalHeight || 300;

      // Apply zoom factor
      const newWidth = Math.round(currentWidth * factor);
      const newHeight = Math.round(currentHeight * factor);

      // Ensure minimum size
      const finalWidth = Math.max(50, newWidth);
      const finalHeight = Math.max(50, newHeight);

      // Update TipTap node
      editor.chain().focus().updateAttributes('image', {
        width: `${finalWidth}px`,
        height: `${finalHeight}px`
      }).run();

      // Update UI
      setCustomWidth(finalWidth);
      setCustomHeight(finalHeight);

      if (showNotification) {
        const percentage = Math.round(factor * 100);
        showNotification(`Image ${factor > 1 ? 'zoomed in' : 'zoomed out'} to ${percentage}% (${finalWidth}×${finalHeight}px)`, 'success');
      }
    } catch (error) {
      if (showNotification) {
        showNotification('Error zooming image', 'error');
      }
    }
  };

  const applyCustomSize = () => {
    if (!editor || !imageNode) return;
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);
    if (!width || width <= 0) {
      if (showNotification) {
        showNotification('Please enter a valid width', 'error');
      } else {
        alert('Please enter a valid width');
      }
      return;
    }
    try {
      // Get the position of the image node in TipTap
      const pos = editor.view.posAtDOM(imageNode, 0);
      // Validate position
      if (pos < 0 || pos >= editor.state.doc.content.size) {
        return;
      }
      const node = editor.state.doc.nodeAt(pos);
      if (!node || node.type.name !== 'image') return;
      // Calculate height if not provided
      let finalHeight = height;
      if (!height || height <= 0) {
        const img = imageNode.querySelector('img');
        if (img) {
          const naturalWidth = img.naturalWidth || img.width || 400;
          const naturalHeight = img.naturalHeight || img.height || 300;
          const aspectRatio = naturalHeight / naturalWidth;
          finalHeight = Math.round(width * aspectRatio);
        } else {
          finalHeight = Math.round(width * 0.75); // Default aspect ratio
        }
      }
      // Update TipTap node attributes
      editor.chain().focus().updateAttributes('image', {
        width: `${width}px`,
        height: `${finalHeight}px`
      }).run();
      // Update UI
      setCustomHeight(finalHeight);
      if (showNotification) {
        showNotification(`Image resized to ${width}×${finalHeight}px`, 'success');
      }
    } catch (error) {
      if (showNotification) {
        showNotification('Error resizing image', 'error');
      }
    }
  };
  const applyAlignment = (alignment) => {
    if (!editor || !imageNode) return;
    try {
      // Get the position of the image node in TipTap
      const pos = editor.view.posAtDOM(imageNode, 0);
      // Validate position
      if (pos < 0 || pos >= editor.state.doc.content.size) {
        return;
      }
      const node = editor.state.doc.nodeAt(pos);
      if (!node || node.type.name !== 'image') return;
      // Update the paragraph containing the image
      const $pos = editor.state.doc.resolve(pos);
      const parentPos = $pos.start() - 1;
      if (parentPos >= 0 && parentPos < editor.state.doc.content.size) {
        const parentNode = editor.state.doc.nodeAt(parentPos);
        if (parentNode && parentNode.type.name === 'paragraph') {
          // Update paragraph alignment
          editor.chain().focus().setTextAlign(alignment).run();
        }
      }
      setCurrentAlignment(alignment);
    } catch (error) {
      setCurrentAlignment(alignment);
    }
  };
  const updateAltText = () => {
    if (!editor || !imageNode) return;
    try {
      // Get the position of the image node in TipTap
      const pos = editor.view.posAtDOM(imageNode, 0);
      // Validate position
      if (pos < 0 || pos >= editor.state.doc.content.size) {
        return;
      }
      const node = editor.state.doc.nodeAt(pos);
      if (!node || node.type.name !== 'image') return;
      // Update TipTap node attributes
      editor.chain().focus().updateAttributes('image', {
        alt: altText
      }).run();
      if (showNotification) {
        showNotification('Alt text updated', 'success');
      }
    } catch (error) {
      if (showNotification) {
        showNotification('Error updating alt text', 'error');
      }
    }
  };
  const deleteImage = () => {
    if (!editor || !imageNode) return;
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      // Get the position of the image node in TipTap
      const pos = editor.view.posAtDOM(imageNode, 0);
      // Validate position
      if (pos < 0 || pos >= editor.state.doc.content.size) {
        return;
      }
      const node = editor.state.doc.nodeAt(pos);
      if (!node || node.type.name !== 'image') return;
      // Delete the image node
      editor.chain().focus().deleteRange({ 
        from: pos, 
        to: pos + node.nodeSize 
      }).run();
      onClose();
      if (showNotification) {
        showNotification('Image deleted', 'success');
      }
    } catch (error) {
      if (showNotification) {
        showNotification('Error deleting image', 'error');
      }
    }
  };
  const isPresetActive = (presetWidth) => {
    const currentSize = getCurrentImageSize();
    if (presetWidth === null) {
      return !currentSize.width && !currentSize.height;
    }
    return currentSize.width === presetWidth;
  };
  if (!position) return null;
  return (
    <ToolbarContainer
      ref={toolbarRef}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <ToolbarSection>
        <SectionLabel>Preset Sizes</SectionLabel>
        <ButtonGroup>
          {PRESET_SIZES.map((preset) => (
            <PresetButton
              key={preset.label}
              active={isPresetActive(preset.width)}
              onClick={() => applyPresetSize(preset.width)}
              title={`Resize to ${preset.label}${preset.width ? ` (${preset.width}px)` : ''}`}
            >
              <span style={{ marginRight: '4px' }}>{preset.icon}</span>
              {preset.label}
            </PresetButton>
          ))}
        </ButtonGroup>
      </ToolbarSection>

      <ToolbarSection>
        <SectionLabel>Quick Zoom</SectionLabel>
        <ButtonGroup>
          {ZOOM_ACTIONS.map((zoom) => (
            <ZoomButton
              key={zoom.label}
              onClick={() => applyZoomFactor(zoom.factor)}
              title={`${zoom.label} - ${zoom.factor === 1 ? 'Original size' : `${Math.round(zoom.factor * 100)}% of current size`}`}
            >
              <span style={{ marginRight: '2px' }}>{zoom.icon}</span>
              {zoom.label}
            </ZoomButton>
          ))}
        </ButtonGroup>
      </ToolbarSection>
      <ToolbarSection>
        <SectionLabel>Custom Size</SectionLabel>
        <CustomSizeSection>
          <SizeInput
            type="number"
            placeholder="Width"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
          />
          <span style={{ fontSize: '12px', color: '#6b7280' }}>×</span>
          <SizeInput
            type="number"
            placeholder="Height"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
          />
          <ActionButton onClick={applyCustomSize}>
            <FiCheck size={12} />
            Apply
          </ActionButton>
        </CustomSizeSection>
      </ToolbarSection>
      <ToolbarSection>
        <SectionLabel>Alignment</SectionLabel>
        <ButtonGroup>
          {ALIGNMENTS.map((align) => {
            const Icon = align.icon;
            return (
              <AlignButton
                key={align.value}
                active={currentAlignment === align.value}
                onClick={() => applyAlignment(align.value)}
                title={align.label}
              >
                <Icon size={14} />
              </AlignButton>
            );
          })}
        </ButtonGroup>
      </ToolbarSection>
      <ToolbarSection>
        <SectionLabel>Alt Text</SectionLabel>
        <div style={{ display: 'flex', gap: '8px' }}>
          <AltTextInput
            type="text"
            placeholder="Describe this image..."
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && updateAltText()}
          />
          <ActionButton onClick={updateAltText}>
            <FiCheck size={12} />
          </ActionButton>
        </div>
      </ToolbarSection>
      <ToolbarSection>
        <ActionButton danger onClick={deleteImage}>
          <FiTrash2 size={12} />
          Delete Image
        </ActionButton>
      </ToolbarSection>
    </ToolbarContainer>
  );
};
export default function ImageToolbarWithErrorBoundary(props) {
  return (
    <ImageToolbarErrorBoundary>
      <ImageToolbar {...props} />
    </ImageToolbarErrorBoundary>
  );
}
