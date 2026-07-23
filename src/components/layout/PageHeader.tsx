import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  meta?: ReactNode;
}

export function PageHeader({ title, description, meta }: PageHeaderProps) {
  return (
    <header className="page-hero">
      <div className="page-hero__copy">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {meta ? <div className="page-hero__meta">{meta}</div> : null}
    </header>
  );
}
