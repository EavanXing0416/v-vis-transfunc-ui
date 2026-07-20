import type { PartitionFormState } from '../../../features/partition/partition.types';

interface CommentEditorProps {
  form: PartitionFormState;
  onChange: (nextForm: PartitionFormState) => void;
}

export function CommentEditor({ form, onChange }: CommentEditorProps) {
  function update<K extends keyof PartitionFormState>(key: K, value: PartitionFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  return (
    <div className="stack">
      <div className="field">
        <label htmlFor="comment-summary">Comment summary</label>
        <input
          id="comment-summary"
          onChange={(event) => update('commentSummary', event.target.value)}
          placeholder="Example: Baseline split for initial training"
          value={form.commentSummary}
        />
      </div>

      <div className="field">
        <label htmlFor="comment-details">Comment details</label>
        <textarea
          id="comment-details"
          onChange={(event) => update('commentDetails', event.target.value)}
          placeholder="Why is this partition needed, and what downstream task will use it?"
          value={form.commentDetails}
        />
      </div>
    </div>
  );
}
