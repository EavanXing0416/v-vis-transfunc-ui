interface CommentableFormState {
  comments: string;
}

interface CommentEditorProps<TForm extends CommentableFormState> {
  form: TForm;
  onChange: (nextForm: TForm) => void;
}

export function CommentEditor<TForm extends CommentableFormState>({ form, onChange }: CommentEditorProps<TForm>) {
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
        placeholder="Please leave your user comment, for example the purpose of this transformation or how the outputs will be used."
        value={form.comments}
      />
    </div>
  );
}
