import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { 
  FaBold, FaItalic, FaUnderline, FaHeading, FaListUl, FaListOl, 
  FaLink, FaImage, FaQuoteLeft, FaCode, FaUndo, FaRedo 
} from 'react-icons/fa';

const SimpleRichEditor = ({ content = '', onChange, placeholder = 'Start writing...', onImageUpload }) => {
  const editorRef = useRef(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const fileInputRef = useRef(null);

  // Handle content change
  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Format commands
  const executeCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  // Toolbar actions
  const formatText = (command) => () => executeCommand(command);
  
  const insertHeading = () => executeCommand('formatBlock', 'H2');
  
  const insertList = (ordered) => () => {
    executeCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  };

  const insertLink = () => {
    const selection = window.getSelection();
    if (selection.toString()) {
      setIsLinkModalOpen(true);
    } else {
      alert('Please select text first to create a link');
    }
  };

  const handleLinkSubmit = () => {
    if (linkUrl) {
      executeCommand('createLink', linkUrl);
      setLinkUrl('');
      setIsLinkModalOpen(false);
    }
  };

  const insertImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && onImageUpload) {
      try {
        const imageUrl = await onImageUpload(file);
        if (imageUrl) {
          executeCommand('insertImage', imageUrl);
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
    // Reset input
    event.target.value = '';
  };

  const insertQuote = () => executeCommand('formatBlock', 'BLOCKQUOTE');
  
  const insertCode = () => {
    const selection = window.getSelection();
    if (selection.toString()) {
      executeCommand('insertHTML', `<code>${selection.toString()}</code>`);
    } else {
      executeCommand('insertHTML', '<code>code here</code>');
    }
  };

  // Initialize content
  React.useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <EditorContainer>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarButton onClick={formatText('bold')} title="Bold">
            <FaBold />
          </ToolbarButton>
          <ToolbarButton onClick={formatText('italic')} title="Italic">
            <FaItalic />
          </ToolbarButton>
          <ToolbarButton onClick={formatText('underline')} title="Underline">
            <FaUnderline />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ToolbarButton onClick={insertHeading} title="Heading">
            <FaHeading />
          </ToolbarButton>
          <ToolbarButton onClick={insertList(false)} title="Bullet List">
            <FaListUl />
          </ToolbarButton>
          <ToolbarButton onClick={insertList(true)} title="Numbered List">
            <FaListOl />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ToolbarButton onClick={insertLink} title="Insert Link">
            <FaLink />
          </ToolbarButton>
          <ToolbarButton onClick={insertImage} title="Insert Image">
            <FaImage />
          </ToolbarButton>
          <ToolbarButton onClick={insertQuote} title="Quote">
            <FaQuoteLeft />
          </ToolbarButton>
          <ToolbarButton onClick={insertCode} title="Inline Code">
            <FaCode />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarSeparator />

        <ToolbarGroup>
          <ToolbarButton onClick={formatText('undo')} title="Undo">
            <FaUndo />
          </ToolbarButton>
          <ToolbarButton onClick={formatText('redo')} title="Redo">
            <FaRedo />
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>

      <EditorContent
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={(e) => {
          // Simple paste handling - preserve basic formatting
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          executeCommand('insertText', text);
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />

      {isLinkModalOpen && (
        <LinkModal>
          <ModalOverlay onClick={() => setIsLinkModalOpen(false)} />
          <ModalContent>
            <h3>Insert Link</h3>
            <LinkInput
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLinkSubmit();
                }
              }}
              autoFocus
            />
            <ModalActions>
              <ModalButton onClick={handleLinkSubmit} primary>
                Insert Link
              </ModalButton>
              <ModalButton onClick={() => setIsLinkModalOpen(false)}>
                Cancel
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </LinkModal>
      )}
    </EditorContainer>
  );
};

const EditorContainer = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  overflow: hidden;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }

  &:active {
    background: #5a67d8;
  }

  svg {
    font-size: 0.875rem;
  }
`;

const ToolbarSeparator = styled.div`
  width: 1px;
  height: 24px;
  background: #e2e8f0;
  margin: 0 0.25rem;
`;

const EditorContent = styled.div`
  min-height: 300px;
  padding: 1.5rem;
  outline: none;
  line-height: 1.6;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  &[data-placeholder]:empty::before {
    content: attr(data-placeholder);
    color: #a0aec0;
    pointer-events: none;
  }

  /* Content styling */
  h1, h2, h3, h4, h5, h6 {
    margin: 1.5rem 0 0.5rem 0;
    font-weight: 600;
    line-height: 1.3;
  }

  h1 { font-size: 2rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }

  p {
    margin: 0.5rem 0;
  }

  ul, ol {
    margin: 0.5rem 0;
    padding-left: 2rem;
  }

  li {
    margin: 0.25rem 0;
  }

  blockquote {
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    border-left: 4px solid #667eea;
    background: #f7fafc;
    font-style: italic;
    color: #4a5568;
  }

  code {
    background: #f1f5f9;
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
  }

  a {
    color: #667eea;
    text-decoration: underline;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
  }

  /* Focus state */
  &:focus {
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const LinkModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: relative;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  margin: 1rem;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
  }
`;

const LinkInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: ${props => props.primary ? '#667eea' : 'white'};
  color: ${props => props.primary ? 'white' : '#4a5568'};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.primary ? '#5a67d8' : '#f8fafc'};
  }
`;

export default SimpleRichEditor;