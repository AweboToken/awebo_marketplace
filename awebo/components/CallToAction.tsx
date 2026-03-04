import Link from 'next/link';

interface CallToActionProps {
  title?: string | null;
  buttonText?: string | null;
  link?: string | null;
}

export default function CallToAction({ title, buttonText, link }: CallToActionProps) {
  const hasContent = title || buttonText;
  return (
    <div className="w-full bg-gray-100 rounded-lg min-h-[8rem] flex flex-col items-center justify-center gap-4 p-6">
      {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
      {buttonText && link ? (
        <Link
          href={link}
          className="inline-flex items-center justify-center rounded-lg bg-gray-800 px-6 py-3 font-medium text-white hover:bg-gray-700"
        >
          {buttonText}
        </Link>
      ) : !hasContent ? (
        <span className="text-gray-400">Call to Action</span>
      ) : null}
    </div>
  );
}
