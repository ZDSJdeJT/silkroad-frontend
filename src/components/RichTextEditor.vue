<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  text: {
    type: String,
    required: true,
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(['update:text']);

const editorRef = ref();

const insertHandler = (data: DataTransfer | null) => {
  if (!data) {
    return;
  }
  for (let i = 0; i < data.items.length; i++) {
    if (data.items[i].type === 'text/plain') {
      editorRef.value.runCmd('insertText', data.getData('text/plain'));
    } else if (data.items[i].type.startsWith('image/')) {
      const blob = data.items[i].getAsFile();
      if (blob) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          editorRef.value.runCmd('insertImage', base64data);
        };
      }
    }
  }
};

const pasteCapture = (evt: ClipboardEvent) => {
  evt.preventDefault();
  evt.stopPropagation();
  insertHandler(evt.clipboardData);
};

const dropCapture = (evt: DragEvent) => {
  evt.preventDefault();
  evt.stopPropagation();
  insertHandler(evt.dataTransfer);
};
</script>

<template>
  <q-editor
    ref="editorRef"
    :readonly="readonly"
    :model-value="text"
    @update:model-value="(val) => emit('update:text', val)"
    class="tw-w-full"
    :dense="$q.screen.lt.md"
    :placeholder="`${$t('forms.placeholders.richText')} *`"
    v-on:paste="(evt: ClipboardEvent) => pasteCapture(evt)"
    v-on:drop="(evt: DragEvent) => dropCapture(evt)"
    :toolbar="[
      [
        {
          label: $q.lang.editor.align,
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          options: ['left', 'center', 'right', 'justify'],
        },
      ],
      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
      ['token', 'hr', 'link', 'custom_btn'],
      ['print', 'fullscreen'],
      [
        {
          label: $q.lang.editor.formatting,
          icon: $q.iconSet.editor.formatting,
          list: 'no-icons',
          options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
        },
        {
          label: $q.lang.editor.fontSize,
          icon: $q.iconSet.editor.fontSize,
          fixedLabel: true,
          fixedIcon: true,
          list: 'no-icons',
          options: [
            'size-1',
            'size-2',
            'size-3',
            'size-4',
            'size-5',
            'size-6',
            'size-7',
          ],
        },
        {
          label: $q.lang.editor.defaultFont,
          icon: $q.iconSet.editor.font,
          fixedIcon: true,
          list: 'no-icons',
          options: [
            'default_font',
            'arial',
            'arial_black',
            'comic_sans',
            'courier_new',
            'impact',
            'lucida_grande',
            'times_new_roman',
            'verdana',
          ],
        },
        'removeFormat',
      ],
      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

      ['undo', 'redo'],
      ['viewsource'],
    ]"
    :fonts="{
      arial: 'Arial',
      arial_black: 'Arial Black',
      comic_sans: 'Comic Sans MS',
      courier_new: 'Courier New',
      impact: 'Impact',
      lucida_grande: 'Lucida Grande',
      times_new_roman: 'Times New Roman',
      verdana: 'Verdana',
    }"
  />
</template>
