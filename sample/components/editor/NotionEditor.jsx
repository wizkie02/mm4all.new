import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Image as TiptapImage } from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Typography from '@tiptap/extension-typography';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import ImageToolbar from './ImageToolbar';
import { 
  FaBold, FaItalic, FaUnderline, FaStrikethrough, FaHighlighter,
  FaListUl, FaListOl, FaQuoteRight, FaCode, FaImage, FaLink,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaHeading, FaRedo, FaUndo, FaSave, FaEye, FaPlus, FaTable,
  FaGripVertical, FaTimes, FaSearch, FaCalendarAlt, FaCheckSquare,
  FaVideo, FaMusic, FaFileAlt, FaCalculator, FaColumns, FaSubscript,
  FaSuperscript, FaPalette, FaFont, FaTextHeight, FaIndent, FaOutdent,
  FaCopy, FaCut, FaPaste, FaExpand, FaCompress, FaEllipsisH,
  FaBars, FaHome, FaFolder, FaTrash, FaCheck, FaArrowLeft
} from 'react-icons/fa';

// Custom TipTap extension for iframe/video embedding
const IframeExtension = Node.create({
  name: 'iframe',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => {
          if (!attributes.src) return {};
          return { src: attributes.src };
        },
      },
      width: {
        default: '560',
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          return { width: attributes.width };
        },
      },
      height: {
        default: '315',
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          return { height: attributes.height };
        },
      },
      frameborder: {
        default: '0',
        parseHTML: element => element.getAttribute('frameborder'),
        renderHTML: attributes => {
          return { frameborder: attributes.frameborder };
        },
      },
      allowfullscreen: {
        default: true,
        parseHTML: element => element.hasAttribute('allowfullscreen'),
        renderHTML: attributes => {
          if (attributes.allowfullscreen) {
            return { allowfullscreen: '' };
          }
          return {};
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes(HTMLAttributes, {
      class: 'editor-iframe',
      style: 'max-width: 100%; border-radius: 8px; margin: 16px 0;'
    })];
  },

  addCommands() {
    return {
      setIframe: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});

// CSS animations for image resize functionality - DISABLED
const globalStyles = `
  /* Resize animations disabled */
`;
// Inject global styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}
// Full-screen App Layout styled components
const AppContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  overflow: hidden;
`;
const AppHeader = styled.div`
  height: 48px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;
const AppLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #37352f;
  &::before {
    content: '📝';
    font-size: 20px;
  }
`;
const AppActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const LoadingSpinner = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid #f59e0b;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
const AppBody = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;
const Sidebar = styled.div`
  width: 260px;
  background: #f7f6f3;
  border-right: 1px solid #e1e5e9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  @media (max-width: 1024px) {
    width: 220px;
  }
  @media (max-width: 768px) {
    position: absolute;
    left: ${props => props.$isOpen ? '0' : '-260px'};
    top: 48px;
    bottom: 0;
    z-index: 999;
    transition: left 0.3s ease;
    box-shadow: ${props => props.$isOpen ? '2px 0 8px rgba(0,0,0,0.1)' : 'none'};
  }
`;
const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e1e5e9;
  background: #ffffff;
`;
const SidebarContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;
const SidebarSection = styled.div`
  margin-bottom: 24px;
  &:last-child {
    margin-bottom: 0;
  }
`;
const SidebarTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #9b9a97;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
`;
const SidebarItem = styled.div`
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #37352f;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  position: relative;
  &:hover {
    background: #e9e9e7;
    .delete-button {
      opacity: 1;
    }
  }
  &.active {
    background: #2383e2;
    color: white;
  }
  .icon {
    font-size: 16px;
    width: 16px;
    text-align: center;
  }
  .delete-button {
    opacity: 0;
    position: absolute;
    right: 8px;
    padding: 4px;
    border: none;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s ease;
    &:hover {
      background: #dc2626;
      transform: scale(1.1);
    }
    &:active {
      transform: scale(0.95);
    }
  }
`;
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
  position: relative;
`;
const NotionContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
`;
const RichToolbar = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e1e5e9;
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 8px;
  @media (max-width: 768px) {
    padding: 12px 20px;
    gap: 8px;
  }
`;
const ToolbarGroup = styled.div`
  display: flex;
  gap: 6px;
  padding-right: 16px;
  border-right: 1px solid #e9e9e7;
  align-items: center;
  &:last-child {
    border-right: none;
    padding-right: 0;
  }
`;
const ToolbarButton = styled.button`
  padding: 8px 10px;
  border: none;
  background: ${props => props.$active ? 
    'linear-gradient(135deg, #2383e2 0%, #1a6bb8 100%)' : 
    'transparent'};
  color: ${props => props.$active ? 'white' : '#37352f'};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 36px;
  height: 36px;
  font-size: 14px;
  box-shadow: ${props => props.$active ? '0 2px 4px rgba(35, 131, 226, 0.3)' : 'none'};
  &:hover {
    background: ${props => props.$active ? 
      'linear-gradient(135deg, #1a6bb8 0%, #125a9e 100%)' : 
      'linear-gradient(135deg, #f1f1ef 0%, #e9e9e7 100%)'};
    transform: translateY(-1px);
    box-shadow: ${props => props.$active ? 
      '0 4px 8px rgba(35, 131, 226, 0.4)' : 
      '0 2px 4px rgba(0, 0, 0, 0.1)'};
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
const ToolbarSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e9e9e7;
  border-radius: 6px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #37352f;
  cursor: pointer;
  font-size: 14px;
  min-width: 140px;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #2383e2;
    box-shadow: 0 0 0 3px rgba(35, 131, 226, 0.1);
  }
  &:hover {
    border-color: #2383e2;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;
const ColorPickerButton = styled.div`
  position: relative;
  display: inline-block;
  /* Add dropdown for common colors */
  &:hover .color-dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;
const ColorDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e9e9e7;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.2s ease;
  min-width: 240px;
  .color-section {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .section-title {
    font-size: 11px;
    font-weight: 600;
    color: #9b9a97;
    text-transform: uppercase;
    margin-bottom: 6px;
    letter-spacing: 0.5px;
  }
  .color-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 6px;
    margin-bottom: 8px;
  }
  .color-swatch {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    &:hover {
      border-color: #2383e2;
      transform: scale(1.1);
    }
  }
  .custom-color-input {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
    input {
      flex: 1;
      padding: 6px 8px;
      border: 1px solid #e9e9e7;
      border-radius: 4px;
      font-size: 12px;
      font-family: 'SFMono-Regular', Consolas, monospace;
      &:focus {
        outline: none;
        border-color: #2383e2;
        box-shadow: 0 0 0 2px rgba(35, 131, 226, 0.1);
      }
      &::placeholder {
        color: #9b9a97;
      }
    }
    button {
      padding: 6px 10px;
      background: #2383e2;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s ease;
      &:hover {
        background: #1a6bb8;
      }
      &:disabled {
        background: #9b9a97;
        cursor: not-allowed;
      }
    }
  }
  .color-reset {
    padding: 6px 8px;
    background: #f7f6f3;
    border: 1px solid #e9e9e7;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    color: #37352f;
    text-align: center;
    transition: all 0.2s ease;
    width: 100%;
    &:hover {
      background: #e9e9e7;
    }
  }
`;
const ColorPicker = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;
const ColorDisplay = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #e9e9e7;
  background: linear-gradient(135deg, #f1f1ef 0%, #e9e9e7 100%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease;
  /* Text color indicator */
  &::before {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 2px;
    right: 2px;
    height: 3px;
    background: ${props => props.color || '#37352f'};
    border-radius: 2px;
  }
  svg {
    color: #37352f;
    font-size: 14px;
  }
  &:hover {
    border-color: #2383e2;
    background: linear-gradient(135deg, #e9e9e7 0%, #d0d0ce 100%);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const NotionHeader = styled.div`
  padding: 24px 48px 20px;
  border-bottom: none;
  background: #ffffff;
  margin-top: 8px;
  @media (max-width: 768px) {
    padding: 20px 20px 16px;
  }
`;
const NotionTitle = styled.div`
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  color: #37352f;
  margin-bottom: 8px;
  outline: none;
  border: none;
  background: transparent;
  padding: 4px 0;
  cursor: text;
  &:empty::before {
    content: attr(data-placeholder);
    color: #9b9a97;
  }
  &:focus {
    outline: none;
  }
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;
const NotionContent = styled.div`
  flex: 1;
  padding: 0 48px 48px;
  overflow-y: auto;
  background: #ffffff;
  @media (max-width: 768px) {
    padding: 0 20px 24px;
  }
`;
const BlockContainer = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  margin: 1px 0;
  min-height: 28px;
  &:hover .block-handle {
    opacity: 1;
  }
  &:hover .plus-button {
    opacity: 1;
  }
`;
const BlockHandle = styled.div`
  position: absolute;
  left: -24px;
  top: 0;
  width: 18px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: grab;
  color: #9b9a97;
  &:hover {
    color: #37352f;
  }
  &:active {
    cursor: grabbing;
  }
`;
const PlusButton = styled.button`
  position: absolute;
  left: -48px;
  top: 0;
  width: 18px;
  height: 24px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
  color: #9b9a97;
  font-size: 14px;
  &:hover {
    color: #37352f;
    background: #f1f1ef;
    border-radius: 3px;
  }
`;
const SlashMenu = styled.div`
  position: absolute;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid #e9e9e7;
  padding: 8px 0;
  max-width: 300px;
  max-height: 400px;
  overflow-y: auto;
`;
const SlashMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #37352f;
  &:hover, &.selected {
    background: #f1f1ef;
  }
  .icon {
    margin-right: 12px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9b9a97;
  }
  .content {
    flex: 1;
  }
  .title {
    font-weight: 500;
    margin-bottom: 2px;
  }
  .description {
    font-size: 12px;
    color: #9b9a97;
  }
`;
const BubbleMenuContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid #e9e9e7;
  padding: 4px;
  display: flex;
  gap: 2px;
`;
const BubbleButton = styled.button`
  background: none;
  border: none;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #37352f;
  font-size: 14px;
  transition: background 0.2s;
  &:hover {
    background: #f1f1ef;
  }
  &.active {
    background: #2383e2;
    color: white;
  }
`;
const FloatingMenuContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-left: -2px;
`;
const FloatingButton = styled.button`
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  color: #9b9a97;
  font-size: 14px;
  transition: all 0.2s;
  &:hover {
    background: #f1f1ef;
    color: #37352f;
  }
`;
const NotionEditorContent = styled(EditorContent)`
  .ProseMirror {
    outline: none;
    font-size: 16px;
    line-height: 1.6;
    color: #37352f;
    /* Basic block styling */
    > * {
      margin: 1px 0;
      position: relative;
    }
    /* Headings */
    h1 {
      font-size: 32px;
      font-weight: 700;
      line-height: 1.2;
      margin: 32px 0 16px 0;
      color: #37352f;
    }
    h2 {
      font-size: 24px;
      font-weight: 600;
      line-height: 1.3;
      margin: 24px 0 12px 0;
      color: #37352f;
    }
    h3 {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.4;
      margin: 20px 0 8px 0;
      color: #37352f;
    }
    /* Paragraphs */
    p {
      margin: 1px 0;
      padding: 3px 2px;
      min-height: 28px;
      &.is-editor-empty:first-child::before {
        content: 'Type \'/\' for commands...';
        color: #9b9a97;
        float: left;
        height: 0;
        pointer-events: none;
      }
    }
    /* Lists */
    ul, ol {
      margin: 1px 0;
      padding-left: 26px;
    }
    li {
      margin: 1px 0;
      padding: 1px 0;
      p {
        margin: 0;
        padding: 1px 0;
      }
    }
    /* Blockquotes */
    blockquote {
      border-left: 3px solid #e9e9e7;
      padding-left: 16px;
      margin: 8px 0;
      color: #37352f;
      font-style: normal;
    }
    /* Code blocks */
    pre {
      background: #f7f6f3;
      border-radius: 3px;
      padding: 16px;
      margin: 8px 0;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 14px;
      line-height: 1.4;
      color: #37352f;
      border: 1px solid #e9e9e7;
      code {
        background: none;
        padding: 0;
        font-size: inherit;
        color: inherit;
      }
    }
    /* Inline code */
    code {
      background: #f7f6f3;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 85%;
      color: #eb5757;
    }
    /* Links */
    a {
      color: #2383e2;
      text-decoration: underline;
      text-decoration-color: rgba(35, 131, 226, 0.4);
      transition: text-decoration-color 0.2s;
      &:hover {
        text-decoration-color: #2383e2;
      }
    }
    /* Images */
    img {
      max-width: 100%;
      height: auto;
      border-radius: 3px;
      margin: 8px 0;
      cursor: pointer;
      transition: all 0.2s ease;
      display: block;
      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      &.editor-image {
        border: 2px solid transparent;
        border-radius: 6px;
        &:hover {
          border-color: #2383e2;
          box-shadow: 0 4px 12px rgba(35, 131, 226, 0.15);
          transform: translateY(-1px);
        }
      }
    }
    /* Image alignment through paragraph text-align */
    p[data-text-align="left"] img {
      margin-left: 0;
      margin-right: auto;
    }
    p[data-text-align="center"] img {
      margin-left: auto;
      margin-right: auto;
    }
    p[data-text-align="right"] img {
      margin-left: auto;
      margin-right: 0;
    }
    /* Image alignment classes */
    .image-left {
      text-align: left;
    }
    .image-center {
      text-align: center;
    }
    .image-right {
      text-align: right;
    }
    /* Notion-style resizable image container */
    .image-container {
      position: relative;
      display: inline-block;
      margin: 8px 0;
      border: 2px solid transparent;
      border-radius: 6px;
      transition: all 0.2s ease;
      max-width: 100%;
      cursor: pointer;

      img {
        display: block;
        margin: 0;
        border-radius: 4px;
        max-width: 100%;
        height: auto;
        transition: all 0.2s ease;
        user-select: none;
        -webkit-user-drag: none;
        position: relative;
        z-index: 1;
      }
    }

    .image-container:hover {
      border-color: #3b82f6;
      box-shadow: 0 0 0 1px #3b82f6;
    }

    .image-container.selected {
      border-color: #3b82f6;
      box-shadow: 0 0 0 1px #3b82f6;
    }

    /* Notion-style resize handles */
    .image-container.selected::after {
      content: '';
      position: absolute;
      right: -6px;
      bottom: -6px;
      width: 12px;
      height: 12px;
      background: #3b82f6;
      border: 2px solid white;
      border-radius: 50%;
      cursor: nw-resize;
      z-index: 10;
    }

    .image-container.selected .resize-handle {
      position: absolute;
      background: #3b82f6;
      border: 2px solid white;
      border-radius: 50%;
      width: 12px;
      height: 12px;
      z-index: 10;
      opacity: 1;
      display: block;
    }

    .image-container.selected .resize-handle.right {
      right: -6px;
      top: 50%;
      transform: translateY(-50%);
      cursor: ew-resize;
    }

    .image-container.selected .resize-handle.left {
      left: -6px;
      top: 50%;
      transform: translateY(-50%);
      cursor: ew-resize;
    }

    /* Size indicator during resize */
    .resize-size-indicator {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .resize-size-indicator.show {
      opacity: 1;
    }

    /* Video iframe styles */
    .editor-iframe {
      display: block;
      max-width: 100%;
      width: 100%;
      height: auto;
      aspect-ratio: 16/9;
      border: none;
      border-radius: 8px;
      margin: 16px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }

    .editor-iframe:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    /* Responsive iframe container */
    .iframe-container {
      position: relative;
      width: 100%;
      margin: 16px 0;
      border: 2px solid transparent;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .iframe-container:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
    }

    .iframe-container.selected {
      border-color: #3b82f6;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);
    }

    .iframe-container iframe {
      width: 100%;
      height: 100%;
      border: none;
      pointer-events: auto;
    }

    /* Video selection indicator */
    .iframe-container.selected::after {
      content: 'Press Delete to remove video';
      position: absolute;
      top: -30px;
      left: 0;
      background: #3b82f6;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
      white-space: nowrap;
      z-index: 10;
      opacity: 0.9;
    }

    /* Video delete overlay when selected */
    .iframe-container.selected::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(59, 130, 246, 0.1);
      z-index: 5;
      pointer-events: none;
    }

    /* Tables */
    table {
      border-collapse: collapse;
      margin: 16px 0;
      width: 100%;
      border: 1px solid #e9e9e7;
      border-radius: 3px;
      overflow: hidden;
    }
    th, td {
      border: 1px solid #e9e9e7;
      padding: 8px 12px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f7f6f3;
      font-weight: 600;
    }
    /* Selection */
    ::selection {
      background: rgba(35, 131, 226, 0.28);
    }
    /* Placeholder styling */
    .is-empty::before {
      color: #9b9a97;
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }
  }
`;
const ActionBar = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  gap: 6px;
  align-items: center;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    bottom: 16px;
    right: 16px;
    padding: 6px;
  }
`;
const StatusBar = styled.div`
  background: #f7f6f3;
  border-top: 1px solid #e1e5e9;
  padding: 8px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #9b9a97;
  @media (max-width: 768px) {
    padding: 6px 16px;
    font-size: 11px;
  }
`;
const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  @media (max-width: 768px) {
    gap: 12px;
  }
`;
const ActionButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-size: 14px;
  &.primary {
    background: linear-gradient(135deg, #2383e2 0%, #1a6bb8 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(35, 131, 226, 0.3);
    &:hover {
      background: linear-gradient(135deg, #1a6bb8 0%, #125a9e 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(35, 131, 226, 0.4);
    }
  }
  &.secondary {
    background: linear-gradient(135deg, #f1f1ef 0%, #e9e9e7 100%);
    color: #37352f;
    border: 1px solid #e9e9e7;
    &:hover {
      background: linear-gradient(135deg, #e9e9e7 0%, #d0d0ce 100%);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
  &.outline {
    background: transparent;
    border: 1px solid #e9e9e7;
    color: #37352f;
    &:hover {
      background: linear-gradient(135deg, #f1f1ef 0%, #e9e9e7 100%);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Notification = styled.div`
  background: ${props => 
    props.type === 'success' ? '#10b981' :
    props.type === 'error' ? '#ef4444' :
    props.type === 'warning' ? '#f59e0b' : '#3b82f6'
  };
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 500;
  min-width: 300px;
  animation: slideIn 0.3s ease-out;
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
const NotionEditor = ({
  initialContent = '',
  onSave,
  onChange,
  onRequestPublish, // parent should open modal
  onPublish, // direct publish function (optional)
  title = '',
  onTitleChange,
  showNotification, // use parent's notification system
  onBack // callback to go back to dashboard
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [lastPublished, setLastPublished] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [documentTitle, setDocumentTitle] = useState(title);
  const [customColor, setCustomColor] = useState('');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ x: 0, y: 0 });
  const [slashMenuSelected, setSlashMenuSelected] = useState(0);
  // Removed sidebar-related states
  const [imageToolbar, setImageToolbar] = useState({
    show: false,
    position: { x: 0, y: 0 },
    imageNode: null
  });
  const titleRef = useRef(null);
  // Enhanced slash command options
  const slashCommands = [
    {
      title: 'Text',
      description: 'Just start writing with plain text.',
      icon: <FaFileAlt />,
      command: () => editor?.chain().focus().setParagraph().run()
    },
    {
      title: 'Heading 1',
      description: 'Big section heading.',
      icon: <FaHeading />,
      command: () => editor?.chain().focus().toggleHeading({ level: 1 }).run()
    },
    {
      title: 'Heading 2',
      description: 'Medium section heading.',
      icon: <FaHeading />,
      command: () => editor?.chain().focus().toggleHeading({ level: 2 }).run()
    },
    {
      title: 'Heading 3',
      description: 'Small section heading.',
      icon: <FaHeading />,
      command: () => editor?.chain().focus().toggleHeading({ level: 3 }).run()
    },
    {
      title: 'Bulleted list',
      description: 'Create a simple bulleted list.',
      icon: <FaListUl />,
      command: () => editor?.chain().focus().toggleBulletList().run()
    },
    {
      title: 'Numbered list',
      description: 'Create a list with numbering.',
      icon: <FaListOl />,
      command: () => editor?.chain().focus().toggleOrderedList().run()
    },
    {
      title: 'Quote',
      description: 'Capture a quote.',
      icon: <FaQuoteRight />,
      command: () => editor?.chain().focus().toggleBlockquote().run()
    },
    {
      title: 'Code block',
      description: 'Capture a code snippet.',
      icon: <FaCode />,
      command: () => editor?.chain().focus().toggleCodeBlock().run()
    },
    {
      title: 'Table',
      description: 'Add a table.',
      icon: <FaTable />,
      command: () => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    },
    {
      title: 'Divider',
      description: 'Visually divide blocks.',
      icon: <FaColumns />,
      command: () => editor?.chain().focus().setHorizontalRule().run()
    },
    {
      title: 'Video',
      description: 'Embed a video from YouTube or Vimeo.',
      icon: <FaVideo />,
      command: () => addVideoEmbed()
    }
  ];
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      IframeExtension,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`;
          }
          return "Type '/' for commands...";
        },
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
        inline: false,
        allowBase64: true,
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: null,
              renderHTML: attributes => {
                if (!attributes.width) return {};
                return {
                  width: attributes.width,
                }
              },
              parseHTML: element => element.getAttribute('width'),
            },
            height: {
              default: null, 
              renderHTML: attributes => {
                if (!attributes.height) return {};
                return {
                  height: attributes.height,
                }
              },
              parseHTML: element => element.getAttribute('height'),
            },
            alt: {
              default: null,
              renderHTML: attributes => {
                if (!attributes.alt) return {};
                return {
                  alt: attributes.alt,
                }
              },
              parseHTML: element => element.getAttribute('alt'),
            },
          }
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Underline,
      Subscript,
      Superscript,
      Typography,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      const chars = text.length;
      setWordCount(words);
      setCharCount(chars);
      
      // Call onChange with current content if provided
      if (onChange && typeof onChange === 'function') {
        onChange(editor.getHTML());
      }
      
      // Check for slash command
      const { selection } = editor.state;
      const { $from } = selection;
      const textBefore = $from.nodeBefore?.textContent || '';
      if (textBefore.endsWith('/')) {
        const coords = editor.view.coordsAtPos($from.pos);
        setSlashMenuPos({ x: coords.left, y: coords.bottom });
        setShowSlashMenu(true);
        setSlashMenuSelected(0);
      } else {
        setShowSlashMenu(false);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Hide slash menu when selection changes
      setShowSlashMenu(false);
    },
  });
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);
  // Auto-wrap images in containers for resize functionality
  useEffect(() => {
    if (!editor) return;
    const wrapImagesInContainers = () => {
      const editorElement = editor.view.dom;
      const images = editorElement.querySelectorAll('img.editor-image');
      images.forEach(img => {
        // Skip if already wrapped
        if (img.closest('.image-container')) return;
        // Create container
        const container = document.createElement('div');
        container.className = 'image-container';
        // Insert container before image
        img.parentNode.insertBefore(container, img);
        // Move image into container
        container.appendChild(img);
        });
    };
    // Wrap existing images
    setTimeout(wrapImagesInContainers, 100);
    // Watch for new images
    const observer = new MutationObserver((mutations) => {
      let hasNewImages = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const newImages = node.querySelectorAll ? node.querySelectorAll('img.editor-image') : [];
            if (newImages.length > 0 || (node.tagName === 'IMG' && node.classList.contains('editor-image'))) {
              hasNewImages = true;
            }
          }
        });
      });
      if (hasNewImages) {
        setTimeout(wrapImagesInContainers, 50);
      }
    });
    const editorElement = editor.view.dom;
    if (editorElement) {
      observer.observe(editorElement, {
        childList: true,
        subtree: true
      });
    }
    return () => {
      observer.disconnect();
    };
  }, [editor]);
  // Handle image clicks to show toolbar
  useEffect(() => {
    if (!editor) return;
    const handleImageClick = (event) => {
      const target = event.target;
      if (target.tagName === 'IMG' && target.classList.contains('editor-image')) {
        event.preventDefault();
        event.stopPropagation();
        // Get image position for toolbar placement
        const rect = target.getBoundingClientRect();
        const editorRect = editor.view.dom.getBoundingClientRect();
        const position = {
          x: rect.left + rect.width / 2 - 160, // Center toolbar horizontally
          y: rect.bottom + 10 // Position below image
        };
        setImageToolbar({
          show: true,
          position: position,
          imageNode: target.closest('p') || target.parentNode
        });
      } else {
        }
    };
    const editorElement = editor.view.dom;
    editorElement.addEventListener('click', handleImageClick);
    return () => {
      editorElement.removeEventListener('click', handleImageClick);
    };
  }, [editor]);
  // Hide image toolbar when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (imageToolbar.show && !event.target.closest('.image-toolbar')) {
        setImageToolbar(prev => ({ ...prev, show: false }));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [imageToolbar.show]);
  // Initialize title content when component mounts or title prop changes
  useEffect(() => {
    if (titleRef.current && title && titleRef.current.textContent !== title) {
      titleRef.current.textContent = title;
      setDocumentTitle(title);
    }
  }, [title]);
  // Handle keyboard navigation in slash menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSlashMenu) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSlashMenuSelected(prev => 
          prev < slashCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSlashMenuSelected(prev => 
          prev > 0 ? prev - 1 : slashCommands.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeSlashCommand(slashMenuSelected);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowSlashMenu(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSlashMenu, slashMenuSelected]);
  // Update title content when documentTitle changes (but not during typing)
  useEffect(() => {
    if (titleRef.current && titleRef.current.textContent !== documentTitle) {
      // Only update if the user is not currently typing in the title
      const isTyping = document.activeElement === titleRef.current;
      if (!isTyping) {
        titleRef.current.textContent = documentTitle || '';
      }
    }
  }, [documentTitle]);
  const executeSlashCommand = (index) => {
    if (editor && slashCommands[index]) {
      // Remove the '/' character
      const { selection } = editor.state;
      const { $from } = selection;
      editor.chain()
        .deleteRange({ from: $from.pos - 1, to: $from.pos })
        .run();
      // Execute the command
      slashCommands[index].command();
      setShowSlashMenu(false);
    }
  };
  const handleSave = async () => {
    if (!editor || !onSave) {
      return;
    }

    setIsSaving(true);
    try {
      const content = editor.getHTML();

      // Prepare thumbnail data (base64 or file)
      let thumbnailData = '';
      await onSave({ content, title: documentTitle, category: '', thumbnail: thumbnailData });
      setLastSaved(new Date());
      if (showNotification) {
        showNotification('Document saved successfully!', 'success');
      }
    } catch (error) {
      if (showNotification) {
        showNotification('Error saving document: ' + error.message, 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };
  const handlePublish = async (event) => {
    // Prevent event bubbling and form submission
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (onRequestPublish) {
      // Pass current content and title to parent to open modal
      onRequestPublish({
        content: editor.getHTML(),
        title: documentTitle
      });
      return;
    }

    setIsPublishing(true);
    const content = editor.getHTML();
    try {
      let thumbnailData = '';
      if (onPublish) {
        await onPublish({ content, title: documentTitle, category: '', thumbnail: thumbnailData });
      } else {
        // Default publish action - simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setLastPublished(new Date());
      if (showNotification) {
        showNotification('Document published successfully!', 'success');
      }
    } catch (error) {
      if (showNotification) {
        showNotification('Error publishing document.', 'error');
      }
    } finally {
      setIsPublishing(false);
    }
  };
  const handleTitleChange = (e) => {
    // Lưu vị trí cursor hiện tại
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const cursorPosition = range.startOffset;
    const newTitle = e.target.textContent;
    setDocumentTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
    // Khôi phục vị trí cursor sau khi state update
    setTimeout(() => {
      if (titleRef.current) {
        const textNode = titleRef.current.firstChild;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          const newRange = document.createRange();
          const newSelection = window.getSelection();
          const maxPosition = Math.min(cursorPosition, textNode.textContent.length);
          newRange.setStart(textNode, maxPosition);
          newRange.setEnd(textNode, maxPosition);
          newSelection.removeAllRanges();
          newSelection.addRange(newRange);
        }
      }
    }, 0);
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    // cancelled
    if (url === null) {
      return;
    }
    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };
  const setTextColor = (color) => {
    editor.chain().focus().setColor(color).run();
  };
  const validateAndApplyCustomColor = () => {
    let colorToApply = customColor.trim();
    // Add # if missing for hex colors
    if (colorToApply.match(/^[0-9a-fA-F]{3,6}$/)) {
      colorToApply = '#' + colorToApply;
    }
    // Validate common color formats
    const isValidColor = (color) => {
      return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color) || // Hex
             /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color) || // RGB
             /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(color) || // RGBA
             /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(color) || // HSL
             /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/.test(color) || // HSLA
             ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white', 'gray', 'grey'].includes(color.toLowerCase()); // Named colors
    };
    if (isValidColor(colorToApply)) {
      setTextColor(colorToApply);
      setCustomColor('');
      showNotification(`Applied color: ${colorToApply}`, 'success');
    } else {
      showNotification('Invalid color format. Use hex (#ff0000), rgb(255,0,0), or color names.', 'error');
    }
  };
  const setHeading = (level) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };
  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };
  const addVideoEmbed = () => {
    const url = prompt('Enter YouTube or Vimeo URL:');
    if (url && editor) {
      // Convert to embed URL
      let embedUrl = url;
      let width = '560';
      let height = '315';

      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      } else if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1].split('?')[0];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      } else if (url.includes('dailymotion.com/video/')) {
        const videoId = url.split('dailymotion.com/video/')[1].split('?')[0];
        embedUrl = `https://www.dailymotion.com/embed/video/${videoId}`;
      } else {
        // For other URLs, try to use them directly
        embedUrl = url;
      }

      // Use the iframe extension to insert the video
      editor.chain().focus().setIframe({
        src: embedUrl,
        width: width,
        height: height,
        frameborder: '0',
        allowfullscreen: true
      }).run();

      if (showNotification) {
        showNotification('Video embedded successfully!', 'success');
      }
    }
  };
  const copyFormatting = () => {
    // Store current formatting for copy/paste
    const attributes = editor.getAttributes();
    window.copiedFormatting = attributes;
  };
  const pasteFormatting = () => {
    if (window.copiedFormatting && editor) {
      // Apply copied formatting
      Object.entries(window.copiedFormatting).forEach(([key, value]) => {
        if (key === 'bold' && value) editor.chain().focus().setBold().run();
        if (key === 'italic' && value) editor.chain().focus().setItalic().run();
        if (key === 'underline' && value) editor.chain().focus().setUnderline().run();
        // Add more formatting options as needed
      });
    }
  };
  const clearFormatting = () => {
    editor.chain().focus().unsetAllMarks().run();
  };
  // Notion-style image resize functionality
  useEffect(() => {
    if (!editor) return;

    let isResizing = false;
    let currentImageContainer = null;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let resizeHandle = null;

    const sizeIndicator = document.createElement('div');
    sizeIndicator.className = 'resize-size-indicator';
    document.body.appendChild(sizeIndicator);

    const showSizeIndicator = (width, height) => {
      sizeIndicator.textContent = `${Math.round(width)} × ${Math.round(height)}`;
      sizeIndicator.classList.add('show');
    };

    const hideSizeIndicator = () => {
      sizeIndicator.classList.remove('show');
    };

    const handleMouseDown = (e) => {
      if (e.target.classList.contains('resize-handle') ||
          e.target.closest('.image-container.selected')?.querySelector('::after, ::before')) {
        e.preventDefault();
        e.stopPropagation();

        isResizing = true;
        currentImageContainer = e.target.closest('.image-container');
        const img = currentImageContainer.querySelector('img');

        startX = e.clientX;
        startY = e.clientY;
        startWidth = img.offsetWidth;
        startHeight = img.offsetHeight;
        resizeHandle = e.target.classList.contains('resize-handle') ? e.target : 'corner';

        showSizeIndicator(startWidth, startHeight);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseMove = (e) => {
      if (!isResizing || !currentImageContainer) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const img = currentImageContainer.querySelector('img');

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (resizeHandle === 'corner' || resizeHandle.classList?.contains('right')) {
        newWidth = Math.max(100, startWidth + deltaX);
        // Maintain aspect ratio
        const aspectRatio = startHeight / startWidth;
        newHeight = newWidth * aspectRatio;
      }

      // Apply new size
      img.style.width = `${newWidth}px`;
      img.style.height = `${newHeight}px`;

      showSizeIndicator(newWidth, newHeight);
    };

    const handleMouseUp = () => {
      if (!isResizing || !currentImageContainer) return;

      isResizing = false;
      const img = currentImageContainer.querySelector('img');

      // Update TipTap node attributes
      try {
        const pos = editor.view.posAtDOM(currentImageContainer, 0);
        if (pos >= 0 && pos < editor.state.doc.content.size) {
          const node = editor.state.doc.nodeAt(pos);
          if (node && node.type.name === 'image') {
            editor.chain().focus().updateAttributes('image', {
              width: img.style.width,
              height: img.style.height
            }).run();
          }
        }
      } catch (error) {
        // Silent error handling
      }

      hideSizeIndicator();
      currentImageContainer = null;
      resizeHandle = null;

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('mousedown', handleMouseDown);

    return () => {
      editorElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (sizeIndicator.parentNode) {
        sizeIndicator.parentNode.removeChild(sizeIndicator);
      }
    };
  }, [editor]);

  // Auto-wrap images and iframes in containers
  useEffect(() => {
    if (!editor) return;

    const wrapImagesInContainers = () => {
      const editorElement = editor.view.dom;
      const images = editorElement.querySelectorAll('img.editor-image');

      images.forEach(img => {
        // Skip if already wrapped
        if (img.closest('.image-container')) return;

        // Create container
        const container = document.createElement('div');
        container.className = 'image-container';

        // Create resize handles
        const rightHandle = document.createElement('div');
        rightHandle.className = 'resize-handle right';

        const leftHandle = document.createElement('div');
        leftHandle.className = 'resize-handle left';

        // Insert container before image
        img.parentNode.insertBefore(container, img);
        // Move image into container
        container.appendChild(img);
        container.appendChild(rightHandle);
        container.appendChild(leftHandle);

        // Add click handler to select image
        container.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Remove selected class from other images
          editorElement.querySelectorAll('.image-container.selected').forEach(c => {
            c.classList.remove('selected');
          });

          // Add selected class to clicked image
          container.classList.add('selected');
        });
      });
    };

    const wrapIframesInContainers = () => {
      const editorElement = editor.view.dom;
      const iframes = editorElement.querySelectorAll('iframe.editor-iframe');

      iframes.forEach(iframe => {
        // Skip if already wrapped
        if (iframe.closest('.iframe-container')) return;

        // Create responsive container
        const container = document.createElement('div');
        container.className = 'iframe-container';
        container.setAttribute('data-type', 'video');

        // Insert container before iframe
        iframe.parentNode.insertBefore(container, iframe);
        // Move iframe into container
        container.appendChild(iframe);

        // Make iframe responsive
        iframe.style.width = '100%';
        iframe.style.height = '315px'; // Default height
        iframe.style.aspectRatio = '16/9';

        // Add click handler to select video
        container.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Remove selected class from other videos and images
          editorElement.querySelectorAll('.iframe-container.selected, .image-container.selected').forEach(c => {
            c.classList.remove('selected');
          });

          // Add selected class to clicked video
          container.classList.add('selected');

          // Focus the editor to enable keyboard events
          editor.commands.focus();
        });
      });
    };

    // Handle clicks outside images and videos to deselect
    const handleClickOutside = (e) => {
      if (!e.target.closest('.image-container') && !e.target.closest('.iframe-container')) {
        editor.view.dom.querySelectorAll('.image-container.selected, .iframe-container.selected').forEach(c => {
          c.classList.remove('selected');
        });
      }
    };

    // Wrap existing images and iframes
    setTimeout(() => {
      wrapImagesInContainers();
      wrapIframesInContainers();
    }, 100);

    // Watch for new images and iframes
    const observer = new MutationObserver((mutations) => {
      let hasNewContent = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const newImages = node.querySelectorAll ? node.querySelectorAll('img.editor-image') : [];
            const newIframes = node.querySelectorAll ? node.querySelectorAll('iframe.editor-iframe') : [];

            if (newImages.length > 0 || (node.tagName === 'IMG' && node.classList.contains('editor-image'))) {
              hasNewContent = true;
            }
            if (newIframes.length > 0 || (node.tagName === 'IFRAME' && node.classList.contains('editor-iframe'))) {
              hasNewContent = true;
            }
          }
        });
      });
      if (hasNewContent) {
        setTimeout(() => {
          wrapImagesInContainers();
          wrapIframesInContainers();
        }, 50);
      }
    });

    const editorElement = editor.view.dom;
    if (editorElement) {
      observer.observe(editorElement, {
        childList: true,
        subtree: true
      });
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClickOutside);
    };
  }, [editor]);
  // Keyboard shortcuts and video deletion
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Handle video deletion first (works regardless of focus)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedVideo = editor?.view.dom.querySelector('.iframe-container.selected');
        if (selectedVideo) {
          e.preventDefault();
          e.stopPropagation();

          // Find the iframe position in TipTap
          const iframe = selectedVideo.querySelector('iframe');
          if (iframe) {
            try {
              const pos = editor.view.posAtDOM(selectedVideo, 0);
              if (pos >= 0 && pos < editor.state.doc.content.size) {
                const node = editor.state.doc.nodeAt(pos);
                if (node && node.type.name === 'iframe') {
                  // Delete the iframe node
                  editor.chain().focus().deleteRange({
                    from: pos,
                    to: pos + node.nodeSize
                  }).run();

                  if (showNotification) {
                    showNotification('Video deleted', 'success');
                  }
                  return;
                }
              }
            } catch (error) {
              // Fallback: remove the container directly
              selectedVideo.remove();
              if (showNotification) {
                showNotification('Video deleted', 'success');
              }
            }
          }
          return;
        }
      }

      // Handle Escape key to deselect videos and images
      if (e.key === 'Escape') {
        const selectedElements = editor?.view.dom.querySelectorAll('.iframe-container.selected, .image-container.selected');
        if (selectedElements && selectedElements.length > 0) {
          e.preventDefault();
          selectedElements.forEach(el => el.classList.remove('selected'));
          return;
        }
      }

      // Only handle other shortcuts when editor is focused or when not in input fields
      const activeElement = document.activeElement;
      const isInputField = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        (activeElement.contentEditable === 'true' && activeElement !== titleRef.current)
      );
      // Skip if we're in a regular input field (but allow title field and editor)
      if (isInputField && activeElement !== titleRef.current) {
        return;
      }
      // Debug log
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            // Debug log
            editor?.chain().focus().toggleBold().run();
            break;
          case 'i':
            e.preventDefault();
            // Debug log
            editor?.chain().focus().toggleItalic().run();
            break;
          case 'd':
            e.preventDefault();
            // Debug log
            editor?.chain().focus().toggleUnderline().run();
            break;
          case 'k':
            e.preventDefault();
            // Debug log
            addLink();
            break;
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              // Debug log
              editor?.chain().focus().redo().run();
            } else {
              e.preventDefault();
              // Debug log
              editor?.chain().focus().undo().run();
            }
            break;
          case 'y':
            e.preventDefault();
            // Debug log
            editor?.chain().focus().redo().run();
            break;
          case 'm':
            e.preventDefault();
            // Debug log
            editor?.chain().focus().toggleHighlight().run();
            break;
          case '`':
            e.preventDefault();
            // Debug log
            editor?.chain().focus().toggleCode().run();
            break;
          case 'enter':
            if (e.shiftKey) {
              e.preventDefault();
              editor?.chain().focus().setHardBreak().run();
            }
            break;
          case 'l':
            if (e.shiftKey) {
              e.preventDefault();
              // Debug log
              editor?.chain().focus().toggleBulletList().run();
            }
            break;
          case 'o':
            if (e.shiftKey) {
              e.preventDefault();
              // Debug log
              editor?.chain().focus().toggleOrderedList().run();
            }
            break;
          case 'q':
            if (e.shiftKey) {
              e.preventDefault();
              // Debug log
              editor?.chain().focus().toggleBlockquote().run();
            }
            break;
          case 's':
            if (e.shiftKey) {
              e.preventDefault();
              // Debug log
              editor?.chain().focus().toggleStrike().run();
            } else {
              e.preventDefault();
              // Debug log
              handleSave();
            }
            break;
          case 'x':
            // Don't prevent default for Ctrl+X (let it work as Cut)
            break;
          case '\\':
            e.preventDefault();
            // Debug log
            clearFormatting();
            break;
        }
      }
      // Alt key combinations
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            // Debug log
            editor?.chain().focus().toggleHeading({ level: 1 }).run();
            break;
          case '2':
            e.preventDefault();
            // Debug log
            editor?.chain().focus().toggleHeading({ level: 2 }).run();
            break;
          case '3':
            e.preventDefault();
            // Debug log
            editor?.chain().focus().toggleHeading({ level: 3 }).run();
            break;
          case '0':
            e.preventDefault();
            // Debug log
            editor?.chain().focus().setParagraph().run();
            break;
        }
      }
    };
    // Attach to document and also to editor specifically
    document.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [editor, handleSave, addLink, clearFormatting]);
  // Removed sidebar functionality


  // Auto-save functionality - DISABLED
  // Users must manually save using Save button or Ctrl+S
  /*
  useEffect(() => {
    if (!editor) return;
    const autoSaveInterval = setInterval(() => {
      if (editor.getHTML() !== initialContent) {
        handleSave();
      }
    }, 30000); // Auto-save every 30 seconds
    return () => clearInterval(autoSaveInterval);
  }, [editor, initialContent]);
  */
  // Document title auto-update
  useEffect(() => {
    if (documentTitle) {
      document.title = `${documentTitle} - MM4All Editor`;
    } else {
      document.title = 'MM4All Editor';
    }
  }, [documentTitle]);
  // Use parent's notification system or fallback to silent
  const notify = (message, type = 'info') => {
    if (showNotification) {
      showNotification(message, type);
    }
  };

  if (!editor) {
    return (
      <AppContainer>
        <div style={{ padding: '64px', textAlign: 'center', color: '#9b9a97' }}>
          Loading editor...
        </div>
      </AppContainer>
    );
  }
  return (
    <AppContainer>

      {/* App Header */}
      <AppHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ToolbarButton
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                showNotification('Back function not available', 'warning');
              }
            }}
            title="Back to Dashboard"
          >
            <FaArrowLeft />
          </ToolbarButton>
          <AppLogo>MM4All Editor</AppLogo>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Save Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9b9a97' }}>
            {isSaving && (
              <div style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LoadingSpinner />
                Saving...
              </div>
            )}
            {isPublishing && (
              <div style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LoadingSpinner />
                Publishing...
              </div>
            )}
            {lastSaved && !isSaving && !isPublishing && (
              <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaCheck style={{ fontSize: '10px' }} />
                Saved {lastSaved.toLocaleTimeString()}
              </div>
            )}
            {lastPublished && !isPublishing && (
              <div style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaCheck style={{ fontSize: '10px' }} />
                Published {lastPublished.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
        <AppActions>
          <ActionButton 
            className="outline"
            onClick={() => {
              const content = editor.getHTML();
              const previewWindow = window.open('', '_blank');
              previewWindow.document.write(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>${documentTitle || 'Untitled'}</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                      body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        max-width: 900px;
                        margin: 0 auto;
                        padding: 64px 96px;
                        line-height: 1.6;
                        color: #37352f;
                        background: white;
                      }
                      h1 { font-size: 32px; font-weight: 700; margin: 32px 0 16px 0; }
                      h2 { font-size: 24px; font-weight: 600; margin: 24px 0 12px 0; }
                      h3 { font-size: 20px; font-weight: 600; margin: 20px 0 8px 0; }
                      p { margin: 8px 0; }
                      blockquote { border-left: 3px solid #e9e9e7; padding-left: 16px; margin: 16px 0; }
                      code { background: #f7f6f3; padding: 2px 4px; border-radius: 3px; font-size: 85%; }
                      pre { background: #f7f6f3; padding: 16px; border-radius: 3px; overflow-x: auto; }
                      img { max-width: 100%; border-radius: 3px; }
                      table { border-collapse: collapse; width: 100%; margin: 16px 0; }
                      th, td { border: 1px solid #e9e9e7; padding: 8px 12px; text-align: left; }
                      th { background: #f7f6f3; font-weight: 600; }
                      iframe {
                        max-width: 100%;
                        width: 100%;
                        height: 315px;
                        aspect-ratio: 16/9;
                        border: none;
                        border-radius: 8px;
                        margin: 16px 0;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                      }
                    </style>
                  </head>
                  <body>
                    <h1>${documentTitle || 'Untitled'}</h1>
                    ${content}
                  </body>
                </html>
              `);
            }}
            title="Preview"
          >
            <FaEye />
            Preview
          </ActionButton>
          <ActionButton
            type="button"
            className="secondary"
            onClick={handleSave}
            disabled={isSaving}
            title="Save Document"
          >
            <FaSave />
            Save
          </ActionButton>
          <ActionButton
            type="button"
            className="primary"
            onClick={handlePublish}
            disabled={isPublishing}
            title="Publish Document"
          >
            {isPublishing ? <LoadingSpinner /> : 'Publish'}
          </ActionButton>
        </AppActions>
      </AppHeader>
      {/* App Body */}
      <AppBody>
        {/* Main Content - Full Width */}
        <MainContent style={{ marginLeft: 0, width: '100%' }}>
          <NotionContainer>
            {/* Rich Toolbar */}
            <RichToolbar>
              {/* Text Styles */}
              <ToolbarGroup>
                <ToolbarSelect
                  value={
                    editor.isActive('heading', { level: 1 }) ? 'h1' :
                    editor.isActive('heading', { level: 2 }) ? 'h2' :
                    editor.isActive('heading', { level: 3 }) ? 'h3' :
                    editor.isActive('heading', { level: 4 }) ? 'h4' :
                    editor.isActive('heading', { level: 5 }) ? 'h5' :
                    editor.isActive('heading', { level: 6 }) ? 'h6' : 'p'
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'p') {
                      setHeading(0);
                    } else {
                      setHeading(parseInt(value.replace('h', '')));
                    }
                  }}
                >
                  <option value="p">Paragraph</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                  <option value="h4">Heading 4</option>
                  <option value="h5">Heading 5</option>
                  <option value="h6">Heading 6</option>
                </ToolbarSelect>
              </ToolbarGroup>
              {/* Basic Formatting */}
              <ToolbarGroup>
                <ToolbarButton
                  $active={editor.isActive('bold')}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  title="Bold (Ctrl+B)"
                >
                  <FaBold />
                </ToolbarButton>
                <ToolbarButton
                  $active={editor.isActive('italic')}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  title="Italic (Ctrl+I)"
                >
                  <FaItalic />
                </ToolbarButton>
                <ToolbarButton
                  $active={editor.isActive('underline')}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  title="Underline (Ctrl+D)"
                >
                  <FaUnderline />
                </ToolbarButton>
                <ToolbarButton
                  $active={editor.isActive('strike')}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  title="Strikethrough (Ctrl+Shift+S)"
                >
                  <FaStrikethrough />
                </ToolbarButton>
              </ToolbarGroup>
              {/* Text Effects */}
              <ToolbarGroup>
                <ToolbarButton
                  $active={editor.isActive('highlight')}
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                  title="Highlight (Ctrl+M)"
                >
                  <FaHighlighter />
                </ToolbarButton>
                <ToolbarButton
                  $active={editor.isActive('subscript')}
                  onClick={() => editor.chain().focus().toggleSubscript().run()}
                  title="Subscript"
                >
                  <FaSubscript />
                </ToolbarButton>
                <ToolbarButton
                  $active={editor.isActive('superscript')}
                  onClick={() => editor.chain().focus().toggleSuperscript().run()}
                  title="Superscript"
                >
                  <FaSuperscript />
                </ToolbarButton>
                <ToolbarButton
                  $active={editor.isActive('code')}
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  title="Inline Code (Ctrl+`)"
                >
                  <FaCode />
                </ToolbarButton>
              </ToolbarGroup>
              {/* Text Color */}
              <ToolbarGroup>
                <ColorPickerButton>
                  <ColorDisplay 
                    color={editor.getAttributes('textStyle').color}
                    title="Text Color"
                  >
                    <FaPalette />
                  </ColorDisplay>
                  <ColorPicker
                    type="color"
                    onChange={(e) => setTextColor(e.target.value)}
                    title="Choose Text Color"
                    value={editor.getAttributes('textStyle').color || '#37352f'}
                  />
                  <ColorDropdown className="color-dropdown">
                    <div className="color-section">
                      <div className="section-title">Basic Colors</div>
                      <div className="color-grid">
                        {[
                          '#37352f', '#e03e3e', '#d9730d', '#dfab01', 
                          '#0f7b0f', '#0b6e99', '#6940a5', '#ad1a72'
                        ].map(color => (
                          <div
                            key={color}
                            className="color-swatch"
                            style={{ background: color }}
                            onClick={() => setTextColor(color)}
                            title={`Set color to ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="color-section">
                      <div className="section-title">Light Colors</div>
                      <div className="color-grid">
                        {[
                          '#f87171', '#fb923c', '#fbbf24', '#34d399',
                          '#60a5fa', '#a78bfa', '#f472b6', '#94a3b8'
                        ].map(color => (
                          <div
                            key={color}
                            className="color-swatch"
                            style={{ background: color }}
                            onClick={() => setTextColor(color)}
                            title={`Set color to ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="color-section">
                      <div className="section-title">Dark Colors</div>
                      <div className="color-grid">
                        {[
                          '#991b1b', '#ea580c', '#d97706', '#059669',
                          '#1d4ed8', '#7c3aed', '#be185d', '#374151'
                        ].map(color => (
                          <div
                            key={color}
                            className="color-swatch"
                            style={{ background: color }}
                            onClick={() => setTextColor(color)}
                            title={`Set color to ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="color-section">
                      <div className="section-title">Custom Color</div>
                      <div className="custom-color-input">
                        <input
                          type="text"
                          placeholder="#ff0000, rgb(255,0,0), red..."
                          value={customColor}
                          onChange={(e) => setCustomColor(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              validateAndApplyCustomColor();
                            }
                          }}
                        />
                        <button 
                          onClick={validateAndApplyCustomColor}
                          disabled={!customColor.trim()}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                    <div 
                      className="color-reset"
                      onClick={() => editor.chain().focus().unsetColor().run()}
                    >
                      Reset to default
                    </div>
                  </ColorDropdown>
                </ColorPickerButton>
              </ToolbarGroup>
              {/* Text Alignment */}
              <ToolbarGroup>
                <ToolbarButton
                  $active={editor.isActive({ textAlign: 'left' })}
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  title="Align Left"
                >
                  <FaAlignLeft />
                </ToolbarButton>
                <ToolbarButton
                  $active={editor.isActive({ textAlign: 'center' })}
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  title="Align Center"
                >
                  <FaAlignCenter />
                </ToolbarButton>
                <ToolbarButton
                  $active={editor.isActive({ textAlign: 'right' })}
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  title="Align Right"
                >
                  <FaAlignRight />
                </ToolbarButton>
                <ToolbarButton
                  $active={editor.isActive({ textAlign: 'justify' })}
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                  title="Justify"
                >
                  <FaAlignJustify />
                </ToolbarButton>
              </ToolbarGroup>
              {/* Lists */}
              <ToolbarGroup>
                <ToolbarButton
                  $active={editor.isActive('bulletList')}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  title="Bullet List (Ctrl+Shift+L)"
                >
                  <FaListUl />
                </ToolbarButton>
                <ToolbarButton
                  $active={editor.isActive('orderedList')}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  title="Numbered List (Ctrl+Shift+O)"
                >
                  <FaListOl />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
                  disabled={!editor.can().sinkListItem('listItem')}
                  title="Indent"
                >
                  <FaIndent />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().liftListItem('listItem').run()}
                  disabled={!editor.can().liftListItem('listItem')}
                  title="Outdent"
                >
                  <FaOutdent />
                </ToolbarButton>
              </ToolbarGroup>
              {/* Blocks */}
              <ToolbarGroup>
                <ToolbarButton
                  $active={editor.isActive('blockquote')}
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  title="Quote (Ctrl+Shift+Q)"
                >
                  <FaQuoteRight />
                </ToolbarButton>
                <ToolbarButton
                  $active={editor.isActive('codeBlock')}
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  title="Code Block"
                >
                  <FaCode />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  title="Horizontal Rule"
                >
                  <FaColumns />
                </ToolbarButton>
              </ToolbarGroup>
              {/* Media & Links */}
              <ToolbarGroup>
                <ToolbarButton onClick={addLink} title="Add/Edit Link (Ctrl+K)">
                  <FaLink />
                </ToolbarButton>
                <ToolbarButton onClick={addVideoEmbed} title="Embed Video">
                  <FaVideo />
                </ToolbarButton>
              </ToolbarGroup>
              {/* Table */}
              <ToolbarGroup>
                <ToolbarButton onClick={insertTable} title="Insert Table">
                  <FaTable />
                </ToolbarButton>
              </ToolbarGroup>
              {/* Undo/Redo */}
              <ToolbarGroup>
                <ToolbarButton
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  title="Undo (Ctrl+Z)"
                >
                  <FaUndo />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  title="Redo (Ctrl+Y)"
                >
                  <FaRedo />
                </ToolbarButton>
                <ToolbarButton
                  onClick={copyFormatting}
                  title="Copy Formatting"
                >
                  <FaCopy />
                </ToolbarButton>
                <ToolbarButton
                  onClick={pasteFormatting}
                  title="Paste Formatting"
                >
                  <FaPaste />
                </ToolbarButton>
                <ToolbarButton
                  onClick={clearFormatting}
                  title="Clear Formatting (Ctrl+\)"
                >
                  <FaTimes />
                </ToolbarButton>
              </ToolbarGroup>
            </RichToolbar>
            <NotionHeader>
              {/* Title */}
              <NotionTitle
                ref={titleRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleTitleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    editor.commands.focus();
                  }
                }}
                data-placeholder="Untitled"
              />
            </NotionHeader>
            <NotionContent>
              {/* Bubble Menu for text selection */}
              {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ 
                  duration: 100,
                  appendTo: document.body
                }}>
                  <BubbleMenuContainer>
                    <BubbleButton
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={editor.isActive('bold') ? 'active' : ''}
                    >
                      <FaBold />
                    </BubbleButton>
                    <BubbleButton
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={editor.isActive('italic') ? 'active' : ''}
                    >
                      <FaItalic />
                    </BubbleButton>
                    <BubbleButton
                      onClick={() => editor.chain().focus().toggleUnderline().run()}
                      className={editor.isActive('underline') ? 'active' : ''}
                    >
                      <FaUnderline />
                    </BubbleButton>
                    <BubbleButton
                      onClick={() => editor.chain().focus().toggleStrike().run()}
                      className={editor.isActive('strike') ? 'active' : ''}
                    >
                      <FaStrikethrough />
                    </BubbleButton>
                    <BubbleButton
                      onClick={() => editor.chain().focus().toggleHighlight().run()}
                      className={editor.isActive('highlight') ? 'active' : ''}
                    >
                      <FaHighlighter />
                    </BubbleButton>
                    <BubbleButton onClick={addLink}>
                      <FaLink />
                    </BubbleButton>
                  </BubbleMenuContainer>
                </BubbleMenu>
              )}
              {/* Floating Menu for empty lines */}
              {editor && (
                <FloatingMenu 
                  editor={editor} 
                  tippyOptions={{ 
                    duration: 100,
                    offset: [0, 10], /* Tạo khoảng cách 10px */
                    placement: 'bottom', /* Di chuyển xuống dưới dòng trống */
                    appendTo: document.body
                  }}
                >
                  <FloatingMenuContainer>
                    <FloatingButton
                      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    >
                      H1
                    </FloatingButton>
                    <FloatingButton
                      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    >
                      H2
                    </FloatingButton>
                    <FloatingButton
                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                    >
                      <FaListUl />
                    </FloatingButton>

                    <FloatingButton onClick={insertTable}>
                      <FaTable />
                    </FloatingButton>
                  </FloatingMenuContainer>
                </FloatingMenu>
              )}
              {/* Main Editor Content */}
              <NotionEditorContent editor={editor} />
              {/* Slash Command Menu */}
              {showSlashMenu && (
                <SlashMenu
                  style={{
                    position: 'fixed',
                    left: slashMenuPos.x,
                    top: slashMenuPos.y + 10,
                    zIndex: 1000
                  }}
                >
                  {slashCommands.map((command, index) => (
                    <SlashMenuItem
                      key={index}
                      className={index === slashMenuSelected ? 'selected' : ''}
                      onClick={() => executeSlashCommand(index)}
                    >
                      <div className="icon">{command.icon}</div>
                      <div className="content">
                        <div className="title">{command.title}</div>
                        <div className="description">{command.description}</div>
                      </div>
                    </SlashMenuItem>
                  ))}
                </SlashMenu>
              )}

              {/* Image Toolbar */}
              {imageToolbar.show && (
                <div className="image-toolbar">
                  {}
                  <ImageToolbar
                    editor={editor}
                    imageNode={imageToolbar.imageNode}
                    position={imageToolbar.position}
                    onClose={() => setImageToolbar(prev => ({ ...prev, show: false }))}
                    showNotification={showNotification}
                  />
                </div>
              )}
            </NotionContent>
            {/* Status Bar */}
            <StatusBar>
              <StatusGroup>
                <div>{wordCount} words</div>
                <div>•</div>
                <div>{charCount} characters</div>
              </StatusGroup>
            </StatusBar>

          </NotionContainer>
        </MainContent>
      </AppBody>
    </AppContainer>
  );
};
export default NotionEditor;
