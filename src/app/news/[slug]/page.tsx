import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const f = createUploadthing();

export const ourFileRouter = {
  // For news post cover images and inline images
  postImage: f({ image: { maxFileSize: '8MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      const role = (session?.user as any)?.role;
      if (!session || (role !== 'ADMIN' && role !== 'MODERATOR')) {
        throw new Error('Unauthorized');
      }
      return { userId: (session.user as any).id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete by user', metadata.userId, '→', file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
