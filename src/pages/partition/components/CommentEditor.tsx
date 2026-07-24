import type { PartitionFormState } from '../../../features/partition/partition.types';

interface CommentEditorProps {
  form: PartitionFormState;
  onChange: (nextForm: PartitionFormState) => void;
}

export function CommentEditor({ form, onChange }: CommentEditorProps) {
  function update(value: string) {
    onChange({
      ...form,
      comments: value,
    });
  }

  return (
    <div className="field">
      <textarea
        id="comments"
        onChange={(event) => update(event.target.value)}
        placeholder="Please leave your user comment, for example the purpose of this partition or how the outputs will be used."
        value={form.comments}
      />
    </div>
  );
}
