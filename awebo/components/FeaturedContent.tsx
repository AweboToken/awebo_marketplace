import Link from 'next/link';

interface FeaturedContentProps {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
}

export default function FeaturedContent({
  title,
  description,
  imageUrl,
  ctaText,
  ctaLink,
}: FeaturedContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-gray-100 rounded-lg h-64 flex items-center justify-center overflow-hidden min-h-[16rem]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">Featured Image</span>
        )}
      </div>
      <div className="space-y-4">
        {title && <div className="font-semibold text-lg">{title}</div>}
        {description && <p className="text-gray-600 text-sm">{description}</p>}
        {!title && !description && (
          <>
            <div className="bg-gray-100 rounded-lg h-8"></div>
            <div className="bg-gray-100 rounded-lg h-6"></div>
            <div className="space-y-2">
              <div className="bg-gray-100 rounded-lg h-4"></div>
              <div className="bg-gray-100 rounded-lg h-4"></div>
              <div className="bg-gray-100 rounded-lg h-4 w-3/4"></div>
            </div>
          </>
        )}
        <div className="flex gap-2">
          {ctaText && ctaLink ? (
            <Link
              href={ctaLink}
              className="inline-flex items-center justify-center rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
            >
              {ctaText}
            </Link>
          ) : (
            <>
              <div className="bg-gray-100 rounded-lg h-10 w-20"></div>
              <div className="bg-gray-100 rounded-lg h-10 w-20"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
