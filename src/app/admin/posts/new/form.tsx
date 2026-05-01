'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RichEditor } from '@/components/rich-editor';
import { UploadDropzone } from '@/lib/uploadthing-client';

export function NewPostForm() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function save(publish: boolean) {
    if (!title || !body) {
      alert('Please add a title and some content before saving.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, body, coverImage, publish }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      router.push('/admin/posts');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-sage-900 mb-2">Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="A clear, descriptive title for your post"
          className="w-full px-4 py-3 bg-white border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500 text-2xl font-display"
        />
      </div>

      {/* Cover image */}
      <div>
        <label className="block text-sm font-medium text-sage-900 mb-2">Cover image</label>
        <p className="text-xs text-ink/60 mb-3">
          This is the big image that appears at the top of the post and on the news listing card.
        </p>
        {coverImage ? (
          <div className="relative">
            <img src={coverImage} alt="" className="w-full aspect-[16/9] object-cover rounded-md" />
            <button
              type="button"
              onClick={() => setCoverImage('')}
              className="absolute top-3 right-3 bg-cream-50 hover:bg-coral-100 text-sage-900 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm"
            >
              Replace image
            </button>
          </div>
        ) : (
          <UploadDropzone
            endpoint="postImage"
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) setCoverImage(res[0].url);
            }}
            onUploadError={(err) => alert('Upload failed: ' + err.message)}
            appearance={{
              container: 'border-2 border-dashed border-sage-900/20 rounded-md py-10 bg-cream-50 ut-uploading:bg-coral-100',
              button: 'bg-coral-500 ut-uploading:bg-coral-400 ut-readying:bg-sage-300 text-cream-50 px-5 py-2 rounded-full text-sm font-medium',
              label: 'text-sage-900 font-medium',
              allowedContent: 'text-xs text-ink/60 mt-2',
            }}
          />
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-sage-900 mb-2">Short summary</label>
        <p className="text-xs text-ink/60 mb-2">
          1-2 sentences. Shows on the news listing under the title.
        </p>
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          rows={2}
          placeholder="A short teaser to draw readers in..."
          className="w-full px-4 py-3 bg-white border border-sage-900/15 rounded-md outline-none focus:ring-2 focus:ring-coral-500"
        />
      </div>

      {/* Body — rich editor */}
      <div>
        <label className="block text-sm font-medium text-sage-900 mb-2">Post content</label>
        <p className="text-xs text-ink/60 mb-3">
          Use the toolbar to format. Click <strong>+ Image</strong> on the right to add photos anywhere in your post.
        </p>
        <RichEditor value={body} onChange={setBody} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-sage-900/10">
        <button
          onClick={() => save(false)}
          disabled={submitting}
          className="px-6 py-3 border border-sage-900 text-sage-900 rounded-full text-sm font-medium hover:bg-sage-900 hover:text-cream-50 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save as draft'}
        </button>
        <button
          onClick={() => save(true)}
          disabled={submitting}
          className="btn-coral px-6 py-3 text-sm font-medium disabled:opacity-50"
        >
          {submitting ? 'Publishing…' : 'Publish post'}
        </button>
      </div>
    </div>
  );
}
