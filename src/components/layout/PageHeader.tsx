import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, meta }: PageHeaderProps) {
  return (
    <header className="page-hero">
      <div className="page-hero__copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {meta ? <div className="page-hero__meta">{meta}</div> : null}
    </header>
  );
}
