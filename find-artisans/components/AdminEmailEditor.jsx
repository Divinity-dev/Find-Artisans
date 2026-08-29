'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaLink,
  FaListUl,
  FaListOl,
  FaUndo,
  FaRedo,
} from 'react-icons/fa'

const AdminEmailEditor = ({ value, onChange, disabled }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: value || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // Adds classes directly to the inner ProseMirror element
        class:
          'admin-email-editor focus:outline-none min-h-[350px] p-4 text-gray-900 cursor-text',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter the URL', previousUrl || 'https://')

    if (url === null) return
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white text-black shadow-sm flex flex-col">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-300 bg-gray-50 select-none">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={`p-2 rounded transition-colors hover:bg-gray-200 disabled:opacity-50 ${
            editor.isActive('bold') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
          }`}
          title="Bold"
        >
          <FaBold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={`p-2 rounded transition-colors hover:bg-gray-200 disabled:opacity-50 ${
            editor.isActive('italic') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
          }`}
          title="Italic"
        >
          <FaItalic className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
          className={`p-2 rounded transition-colors hover:bg-gray-200 disabled:opacity-50 ${
            editor.isActive('underline') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
          }`}
          title="Underline"
        >
          <FaUnderline className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`p-2 rounded transition-colors hover:bg-gray-200 disabled:opacity-50 ${
            editor.isActive('bulletList') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
          }`}
          title="Bullet list"
        >
          <FaListUl className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`p-2 rounded transition-colors hover:bg-gray-200 disabled:opacity-50 ${
            editor.isActive('orderedList') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
          }`}
          title="Numbered list"
        >
          <FaListOl className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={addLink}
          disabled={disabled}
          className={`p-2 rounded transition-colors hover:bg-gray-200 disabled:opacity-50 ${
            editor.isActive('link') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
          }`}
          title="Add link"
        >
          <FaLink className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().chain().focus().undo().run()}
          className="p-2 rounded text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-30"
          title="Undo"
        >
          <FaUndo className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().chain().focus().redo().run()}
          className="p-2 rounded text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-30"
          title="Redo"
        >
          <FaRedo className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* EDITOR INPUT AREA */}
      <div 
        className="flex-1 bg-white cursor-text" 
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default AdminEmailEditor