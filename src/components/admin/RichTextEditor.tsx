'use client';

import { useEffect, useRef, useState } from 'react';
import 'ckeditor5/ckeditor5.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    let editor: any = null;

    async function initEditor() {
      try {
        const ckeditor5 = await import('ckeditor5');

        if (!editorContainerRef.current) return;

        const {
          ClassicEditor, Essentials, Bold, Italic, Underline, Strikethrough,
          Heading, Font, FontSize, FontFamily, FontColor, FontBackgroundColor,
          Alignment, List, Indent, IndentBlock,
          Link, Image, ImageInsert, ImageUpload, ImageResize, ImageStyle, ImageToolbar,
          BlockQuote, Table, TableToolbar, TableProperties, TableCellProperties,
          MediaEmbed, HtmlEmbed, CodeBlock, Code,
          HorizontalLine, SpecialCharacters, SpecialCharactersEssentials,
          Subscript, Superscript, RemoveFormat, FindAndReplace,
          SourceEditing, GeneralHtmlSupport, Paragraph,
          Undo, Clipboard, PasteFromOffice,
          Base64UploadAdapter
        } = ckeditor5;

        editor = await ClassicEditor.create(editorContainerRef.current, {
          plugins: [
            Essentials, Bold, Italic, Underline, Strikethrough,
            Heading, Font, FontSize, FontFamily, FontColor, FontBackgroundColor,
            Alignment, List, Indent, IndentBlock,
            Link, Image, ImageInsert, ImageUpload, ImageResize, ImageStyle, ImageToolbar,
            BlockQuote, Table, TableToolbar, TableProperties, TableCellProperties,
            MediaEmbed, HtmlEmbed, CodeBlock, Code,
            HorizontalLine, SpecialCharacters, SpecialCharactersEssentials,
            Subscript, Superscript, RemoveFormat, FindAndReplace,
            SourceEditing, GeneralHtmlSupport, Paragraph,
            Undo, Clipboard, PasteFromOffice,
            Base64UploadAdapter
          ],
          toolbar: {
            items: [
              'undo', 'redo',
              '|',
              'findAndReplace',
              '|',
              'heading',
              '|',
              'bold', 'italic', 'underline', 'strikethrough',
              'code', 'subscript', 'superscript', 'removeFormat',
              '|',
              'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
              '|',
              'alignment',
              '|',
              'bulletedList', 'numberedList', 'outdent', 'indent',
              '|',
              'link', 'insertImage', 'blockQuote', 'insertTable',
              'mediaEmbed', 'htmlEmbed', 'codeBlock',
              '|',
              'specialCharacters', 'horizontalLine',
              '|',
              'sourceEditing',
            ],
            shouldNotGroupWhenFull: true,
          },
          heading: {
            options: [
              { model: 'paragraph' as const, title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1' as const, view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2' as const, view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3' as const, view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4' as const, view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            ],
          },
          fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 24, 28, 32],
          },
          fontFamily: {
            options: [
              'default',
              'Arial, Helvetica, sans-serif',
              'Georgia, serif',
              'Times New Roman, Times, serif',
              'Courier New, Courier, monospace',
              'Verdana, Geneva, sans-serif',
            ],
          },
          image: {
            toolbar: [
              'imageStyle:inline', 'imageStyle:block', 'imageStyle:side',
              '|', 'imageTextAlternative',
            ],
          },
          table: {
            contentToolbar: [
              'tableColumn', 'tableRow', 'mergeTableCells',
              'tableProperties', 'tableCellProperties',
            ],
          },
          htmlSupport: {
            allow: [{ name: /.*/, attributes: true, classes: true, styles: true }],
          },
          placeholder: placeholder || 'Мақола матнини бу ерга киритинг...',
          licenseKey: 'GPL',
          initialData: value || '',
        });

        editorInstanceRef.current = editor;

        editor.model.document.on('change:data', () => {
          onChange(editor.getData());
        });

        setIsLoading(false);
      } catch (err: any) {
        console.error('CKEditor error:', err);
        setError(err.message || 'Муҳаррир юкланмади');
        setIsLoading(false);
      }
    }

    initEditor();

    return () => {
      if (editor) {
        editor.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes
  useEffect(() => {
    const ed = editorInstanceRef.current;
    if (ed && !isLoading) {
      const current = ed.getData();
      if (value !== current) {
        ed.setData(value || '');
      }
    }
  }, [value, isLoading]);

  // Fallback to textarea if error
  if (error) {
    return (
      <div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1e3a8a] min-h-[300px] font-sans"
          placeholder={placeholder}
        />
        <p className="text-xs text-red-500 mt-1">Муҳаррир юкланмади: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {isLoading && (
        <div className="flex items-center justify-center py-8 border border-[#e5e7eb] rounded-lg bg-[#f8fafc]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[#64748b]">Муҳаррир юкланмоқда...</span>
          </div>
        </div>
      )}
      <div ref={editorContainerRef} style={{ display: isLoading ? 'none' : 'block' }} />
      <style>{`
        .ck.ck-editor {
          border-radius: 8px !important;
          overflow: hidden;
          border: 1px solid #e5e7eb !important;
        }
        .ck.ck-editor__editable_inline {
          min-height: 320px !important;
          max-height: 600px !important;
          padding: 16px 20px !important;
          font-size: 1rem;
          line-height: 1.75;
        }
        .ck.ck-toolbar {
          background: #f8fafc !important;
          border-bottom: 1px solid #e5e7eb !important;
          padding: 4px !important;
          flex-wrap: wrap !important;
        }
        .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused {
          border-color: #1e3a8a !important;
          box-shadow: 0 0 0 2px rgba(30,58,138,0.12) !important;
        }
        .ck.ck-button.ck-on,
        .ck.ck-button:hover {
          background: rgba(30,58,138,0.08) !important;
        }
      `}</style>
    </div>
  );
}
