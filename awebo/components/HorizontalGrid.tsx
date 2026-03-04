'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface AppProject {
  _id: string;
  title?: string | null;
  slug?: string | null;
  imageUrl?: string | null;
}

interface HorizontalGridProps {
  items: number;
  className?: string;
  projects?: AppProject[] | null;
}

export default function HorizontalGrid({ items, className = '', projects }: HorizontalGridProps) {
  const [gridCols, setGridCols] = useState('repeat(4, minmax(0, 1fr))');
  const list = projects && projects.length > 0 ? projects.slice(0, items) : null;
  const count = list ? list.length : items;

  useEffect(() => {
    const updateGrid = () => {
      if (window.innerWidth >= 1024) {
        setGridCols(`repeat(${count}, minmax(0, 1fr))`);
      } else if (window.innerWidth >= 768) {
        setGridCols('repeat(4, minmax(0, 1fr))');
      } else if (window.innerWidth >= 640) {
        setGridCols('repeat(3, minmax(0, 1fr))');
      } else {
        setGridCols('repeat(2, minmax(0, 1fr))');
      }
    };

    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, [count]);

  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{ gridTemplateColumns: gridCols }}
    >
      {list
        ? list.map((project) => (
            <Link
              key={project._id}
              href={project.slug ? `/creator/${project.slug}` : '#'}
              className="bg-gray-100 rounded-lg h-24 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity"
            >
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={project.title || 'Project'}
                  width={200}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">{project.title || 'Project'}</span>
              )}
            </Link>
          ))
        : Array.from({ length: items }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg h-24 flex items-center justify-center"
            >
              <span className="text-gray-400 text-sm">{index + 1}</span>
            </div>
          ))}
    </div>
  );
}
