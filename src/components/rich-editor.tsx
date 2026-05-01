'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExt from '@tiptap/extension-image';
import LinkExt from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';
import { UploadButton } from '@/lib/uploadthing-client';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export function RichEditor({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      ImageExt.configure({ HTMLAttributes: { class: 'rounded-md my-6' } }),
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-coral-600 underline' },
      }),
      Placeholder.configure({
        placeholder: 'Write your post here. Click the buttons above to add headings, bold text, lists, links, or images…',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[400px] focus:outline-none px-5 py-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return <div className="text-ink/50 p-5">Loading editor…</div>;

  function addLink() {
    const url = prompt('Paste the link URL:');
    if (url) editor!.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="border border-sage-900/20 rounded-md bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-sage-900/10 bg-cream-100">
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
          Heading
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
          Subheading
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <em>I</em>
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          • List
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          1. List
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
          " Quote
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={addLink} active={editor.isActive('link')}>
          🔗 Link
        </ToolbarButton>

        {/* Image upload */}
        <div className="ml-auto">
          <UploadButton
            endpoint="postImage"
            onUploadBegin={() => setUploading(true)}
            onClientUploadComplete={(res) => {
              setUploading(false);
              if (res?.[0]?.url) {
                editor.chain().focus().setImage({ src: res[0].url }).run();
              }
            }}
            onUploadError={(err) => {
              setUploading(false);
              alert('Upload failed: ' + err.message);
            }}
            appearance={{
              button: 'bg-coral-500 hover:bg-coral-600 text-cream-50 px-3 py-1.5 rounded-md text-sm font-medium ut-uploading:bg-coral-400',
              container: 'inline-block',
              allowedContent: 'hidden',
            }}
            content={{
              button: ({ ready }) => (ready ? (uploading ? 'Uploading…' : '+ Image') : 'Loading…'),
            }}
          />
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-sm transition-colors ${active ? 'bg-sage-900 text-cream-50' : 'text-sage-900 hover:bg-sage-200'}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-sage-900/15 mx-1" />;
}
