'use client';

export default function BackgroundRadialSlate() {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_560px_at_50%_200px,#525252,transparent)]" />
    </div>
  );
}
