import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { FormField } from '../../type/form';

export const NoteEditorControl = ({ value, onChange }: FormField<string>) => {
  return (
    <CKEditor
      editor={ ClassicEditor }
      data={ value }
      onChange={ (_, editor) => onChange!(editor.getData()) }
    />
  )
}
