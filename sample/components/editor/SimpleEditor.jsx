import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Image as TiptapImage } from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { 
  FaBold, FaItalic, FaUnderline, FaStrikethrough,
  FaListUl, FaListOl, FaQuoteRight, FaCode, FaImage, FaLink,
  FaHeading, FaRedo, FaUndo
} from 'react-icons/fa';

const EditorContainer = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  min-height: 400px;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 8px 8px 0 0;
  flex-wrap: wrap;
`;

const ToolbarButton = styled.button`
  padding: 8px;
  border: none;
  border-radius: 4px;
  background: ${props => props.$active ? '#667eea' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#4a5568'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#5a67d8' : '#e2e8f0'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ToolbarGroup = styled.div`
  display: flex;
  gap: 4px;
  padding-right: 8px;
  margin-right: 8px;
  border-right: 1px solid #e2e8f0;

  &:last-child {
    border-right: none;
    margin-right: 0;
    padding-right: 0;
  }
`;

const EditorContent_Styled = styled(EditorContent)`
  .ProseMirror {
    padding: 16px;
    outline: none;
    min-height: 350px;
    font-size: 16px;
    line-height: 1.6;
    color: #2d3748;

    h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 24px 0 16px 0;
    }

    h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 20px 0 12px 0;
    }

    h3 {
      font-size: 20px;
      font-weight: 600;
      margin: 16px 0 8px 0;
    }

    p {
      margin: 8px 0;
    }

    ul, ol {
      margin: 8px 0;
      padding-left: 24px;
    }

    li {
      margin: 4px 0;
    }

    blockquote {
      border-left: 3px solid #e2e8f0;
      padding-left: 16px;
      margin: 16px 0;
      color: #718096;
      font-style: italic;
    }

    code {
      background: #f7fafc;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 14px;
    }

    pre {
      background: #f7fafc;
      padding: 16px;
      border-radius: 6px;
      margin: 16px 0;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 14px;
      overflow-x: auto;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      margin: 8px 0;
    }

    a {
      color: #667eea;
      text-decoration: underline;
    }

    .is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: #a0aec0;
      float: left;
      height: 0;
      pointer-events: none;
    }
  }
`;

const SimpleEditor = ({ 
  initialContent = '', 
  onChange,
  placeholder = 'Start typing...'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  const addImage = useCallback(() => {
    const url = prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    if (url === null) {
      return;
    }
    
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <EditorContainer>
        <div style={{ padding: '20px', textAlign: 'center', color: '#a0aec0' }}>
          Loading editor...
        </div>
      </EditorContainer>
    );
  }

  return (
    <EditorContainer>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarButton
            $active={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Heading 1"
          >
            <FaHeading />
            <span style={{ fontSize: '10px', marginLeft: '2px' }}>1</span>
          </ToolbarButton>
          <ToolbarButton
            $active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
          >
            <FaHeading />
            <span style={{ fontSize: '10px', marginLeft: '2px' }}>2</span>
          </ToolbarButton>
          <ToolbarButton
            $active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Heading 3"
          >
            <FaHeading />
            <span style={{ fontSize: '10px', marginLeft: '2px' }}>3</span>
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton
            $active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <FaBold />
          </ToolbarButton>
          <ToolbarButton
            $active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <FaItalic />
          </ToolbarButton>
          <ToolbarButton
            $active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <FaStrikethrough />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton
            $active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <FaListUl />
          </ToolbarButton>
          <ToolbarButton
            $active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            <FaListOl />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton
            $active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Quote"
          >
            <FaQuoteRight />
          </ToolbarButton>
          <ToolbarButton
            $active={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Inline Code"
          >
            <FaCode />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton onClick={addImage} title="Add Image">
            <FaImage />
          </ToolbarButton>
          <ToolbarButton onClick={addLink} title="Add Link">
            <FaLink />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <FaUndo />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <FaRedo />
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>

      <EditorContent_Styled editor={editor} />
    </EditorContainer>
  );
};

export default SimpleEditor;
