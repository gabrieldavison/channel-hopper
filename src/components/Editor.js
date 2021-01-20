import { h } from "https://unpkg.com/preact?module";
import { useRef, useEffect } from "https://cdn.skypack.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";
const html = htm.bind(h);

const Editor = ({ editorContent, handleChangeEditorContent, editorRef }) => {
  return html`
    <textarea
      ref=${editorRef}
      value=${editorContent}
      onInput=${(e) => handleChangeEditorContent(e.target.value)}
    ></textarea>
  `;
};

export default Editor;
