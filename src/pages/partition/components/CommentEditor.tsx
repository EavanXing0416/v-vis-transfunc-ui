import type { PartitionFormState } from '../../../features/partition/partition.types';

interface CommentEditorProps {
  form: PartitionFormState;
  onChange: (nextForm: PartitionFormState) => void;
}

const MAX_SUMMARY_LENGTH = 120;

export function CommentEditor({ form, onChange }: CommentEditorProps) {
  function update<K extends keyof PartitionFormState>(key: K, value: PartitionFormState[K]) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  return (
    <div className="stack--tight">
      <div className="field">
        <label htmlFor="comment-summary">Comment summary</label>
        <input
          id="comment-summary"
          maxLength={MAX_SUMMARY_LENGTH}
          onChange={(event) => update('commentSummary', event.target.value)}
          placeholder="Baseline split for initial training"
          value={form.commentSummary}
        />
        <span className="field-hint field-hint--meta">
          {form.commentSummary.length}/{MAX_SUMMARY_LENGTH} characters
        </span>
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
