import { useState } from 'react';

interface ReadmePreviewButtonProps {
  content: string;
  title: string;
}

export function ReadmePreviewButton({ content, title }: ReadmePreviewButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label={`Open README for ${title}`}
        className="readme-info-button"
        onClick={() => setOpen(true)}
        type="button"
      >
        <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 16 16" width="14" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 7V11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
          <circle cx="8" cy="4.5" fill="currentColor" r="1" />
        </svg>
      </button>
      {open ? (
        <div className="readme-modal-backdrop" onClick={() => setOpen(false)} role="presentation">
          <div aria-modal="true" className="readme-modal" onClick={(event) => event.stopPropagation()} role="dialog">
            <div className="readme-modal__header">
              <strong>{title} README</strong>
              <button className="button button--secondary" onClick={() => setOpen(false)} type="button">
                Close
              </button>
            </div>
            <pre className="readme-modal__content">{content}</pre>
          </div>
        </div>
      ) : null}
    </>
  );
}
