interface BannerProps {
  height?: string;
  className?: string;
  imageUrl?: string | null;
  alt?: string;
}

export default function Banner({ height = 'h-48', className = '', imageUrl, alt }: BannerProps) {
  const content = imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={alt || ''}
      className="w-full h-full object-cover rounded-lg"
    />
  ) : (
    <span className="text-gray-400">Banner</span>
  );
  return (
    <div className={`w-full ${height} bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden ${className}`}>
      {content}
    </div>
  );
}
