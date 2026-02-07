<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { watch, onBeforeUnmount } from 'vue'

import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  ListBulletIcon,
  QueueListIcon,
  LinkIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Start writing...'
  },
  editable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  editable: props.editable,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4]
      }
    }),
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-forest-600 underline hover:text-forest-800',
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue, false)
  }
})

// Watch for editable changes
watch(() => props.editable, (newValue) => {
  if (editor.value) {
    editor.value.setEditable(newValue)
  }
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})

function setLink() {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('Enter URL', previousUrl)
  
  if (url === null) return
  
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function insertText(text) {
  editor.value?.chain().focus().insertContent(text).run()
}

defineExpose({
  insertText,
  getHTML: () => editor.value?.getHTML(),
  getEditor: () => editor.value,
})
</script>

<template>
  <div class="rich-text-editor border border-sand-300 rounded-lg overflow-hidden bg-white">
    <!-- Toolbar -->
    <div v-if="editor && editable" class="editor-toolbar flex flex-wrap items-center gap-1 p-2 border-b border-sand-200 bg-sand-50">
      <!-- Text Style Dropdown -->
      <select
        @change="(e) => {
          const value = e.target.value
          if (value === 'p') editor.chain().focus().setParagraph().run()
          else editor.chain().focus().toggleHeading({ level: parseInt(value) }).run()
          e.target.value = editor.isActive('heading', { level: 1 }) ? '1' : 
                           editor.isActive('heading', { level: 2 }) ? '2' :
                           editor.isActive('heading', { level: 3 }) ? '3' :
                           editor.isActive('heading', { level: 4 }) ? '4' : 'p'
        }"
        class="toolbar-select text-sm px-2 py-1 rounded border border-sand-300 bg-white"
      >
        <option value="p">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
      </select>
      
      <div class="w-px h-6 bg-sand-300 mx-1"></div>
      
      <!-- Basic Formatting -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive('bold') }]"
        title="Bold"
      >
        <BoldIcon class="w-4 h-4" />
      </button>
      
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive('italic') }]"
        title="Italic"
      >
        <ItalicIcon class="w-4 h-4" />
      </button>
      
      <button
        type="button"
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive('underline') }]"
        title="Underline"
      >
        <UnderlineIcon class="w-4 h-4" />
      </button>
      
      <button
        type="button"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive('strike') }]"
        title="Strikethrough"
      >
        <StrikethroughIcon class="w-4 h-4" />
      </button>
      
      <div class="w-px h-6 bg-sand-300 mx-1"></div>
      
      <!-- Alignment -->
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive({ textAlign: 'left' }) }]"
        title="Align Left"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h14" />
        </svg>
      </button>
      
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive({ textAlign: 'center' }) }]"
        title="Align Center"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M5 18h14" />
        </svg>
      </button>
      
      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive({ textAlign: 'right' }) }]"
        title="Align Right"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 12h10M6 18h14" />
        </svg>
      </button>
      
      <div class="w-px h-6 bg-sand-300 mx-1"></div>
      
      <!-- Lists -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive('bulletList') }]"
        title="Bullet List"
      >
        <ListBulletIcon class="w-4 h-4" />
      </button>
      
      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive('orderedList') }]"
        title="Numbered List"
      >
        <QueueListIcon class="w-4 h-4" />
      </button>
      
      <div class="w-px h-6 bg-sand-300 mx-1"></div>
      
      <!-- Link -->
      <button
        type="button"
        @click="setLink"
        :class="['toolbar-btn', { 'is-active': editor.isActive('link') }]"
        title="Insert Link"
      >
        <LinkIcon class="w-4 h-4" />
      </button>
      
      <!-- Quote & Code -->
      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="['toolbar-btn', { 'is-active': editor.isActive('blockquote') }]"
        title="Quote"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </button>
      
      <button
        type="button"
        @click="editor.chain().focus().setHorizontalRule().run()"
        title="Horizontal Rule"
        class="toolbar-btn"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16" />
        </svg>
      </button>
      
      <div class="w-px h-6 bg-sand-300 mx-1"></div>
      
      <!-- Undo/Redo -->
      <button
        type="button"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        class="toolbar-btn"
        title="Undo"
      >
        <ArrowUturnLeftIcon class="w-4 h-4" />
      </button>
      
      <button
        type="button"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        class="toolbar-btn"
        title="Redo"
      >
        <ArrowUturnRightIcon class="w-4 h-4" />
      </button>
    </div>
    
    <!-- Editor Content -->
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<style scoped>
.toolbar-btn {
  @apply p-2 rounded hover:bg-sand-100 text-charcoal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors;
}

.toolbar-btn.is-active {
  @apply bg-forest-100 text-forest-700;
}

.toolbar-select {
  @apply focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent;
}

.editor-content {
  @apply min-h-[300px] max-h-[500px] overflow-y-auto;
}

.editor-content :deep(.tiptap) {
  @apply p-4 outline-none;
}

.editor-content :deep(.tiptap p) {
  @apply my-2;
}

.editor-content :deep(.tiptap h1) {
  @apply text-3xl font-bold my-4;
}

.editor-content :deep(.tiptap h2) {
  @apply text-2xl font-bold my-3;
}

.editor-content :deep(.tiptap h3) {
  @apply text-xl font-semibold my-3;
}

.editor-content :deep(.tiptap h4) {
  @apply text-lg font-semibold my-2;
}

.editor-content :deep(.tiptap ul) {
  @apply list-disc ml-6 my-2;
}

.editor-content :deep(.tiptap ol) {
  @apply list-decimal ml-6 my-2;
}

.editor-content :deep(.tiptap li) {
  @apply my-1;
}

.editor-content :deep(.tiptap blockquote) {
  @apply border-l-4 border-sand-300 pl-4 my-3 italic text-charcoal-600;
}

.editor-content :deep(.tiptap hr) {
  @apply my-4 border-sand-300;
}

.editor-content :deep(.tiptap a) {
  @apply text-forest-600 underline hover:text-forest-800;
}

.editor-content :deep(.tiptap p.is-editor-empty:first-child::before) {
  @apply text-charcoal-400;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Table styles if needed later */
.editor-content :deep(.tiptap table) {
  @apply border-collapse w-full my-4;
}

.editor-content :deep(.tiptap th),
.editor-content :deep(.tiptap td) {
  @apply border border-sand-300 p-2 text-left;
}

.editor-content :deep(.tiptap th) {
  @apply bg-sand-100 font-semibold;
}
</style>
