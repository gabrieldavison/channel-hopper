import { h } from "https://unpkg.com/preact?module";
import { useRef, useEffect } from "https://cdn.skypack.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";
const html = htm.bind(h);

const Editor = ({
  editorContent,
  handleChangeEditorContent,
  editorRef,
  setDisplayState,
  editorErrors,
}) => {
  return html`
    <textarea
      class="editor"
      ref=${editorRef}
      value=${editorContent ? editorContent : ""}
      onInput=${(e) => handleChangeEditorContent(e.target.value)}
      onFocus=${() => setDisplayState("visibleFocusEditor")}
      onBlur=${() => setDisplayState("visibleFocusKeyboard")}
    >
    </textarea>
    <div class="editor__errors">${editorErrors}</div>
  `;
};

export default Editor;
