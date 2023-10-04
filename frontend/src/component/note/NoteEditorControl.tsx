import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export const NoteEditorControl = ({ value, onChange }: { value?: string, onChange?: (value: string) => void }) => {
  return (
    <CKEditor
      editor={ ClassicEditor }
      data={ value }
      onChange={ (_, editor) => onChange!(editor.getData()) }
    />
  )
}
