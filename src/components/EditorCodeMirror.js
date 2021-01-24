import { h } from "https://unpkg.com/preact?module";
import { useRef, useEffect } from "https://cdn.skypack.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";
const html = htm.bind(h);

const Editor = ({
  // editorContent,
  // handleChangeEditorContent,
  // editorRef,
  // setDisplayState,
  initCodemirror,
}) => {
  // Need a ref for the editor container
  const codemirrorContainer = useRef(null);
  useEffect(() => {
    if (codemirrorContainer.current) {
      initCodemirror(codemirrorContainer.current);
    }
  }, [codemirrorContainer]);

  // Need a ref for the codeMirror object?
  // Need a useEffect that depends on editor container ref that creates the codeMirror object when the ref !== null
  return html` <div ref=${codemirrorContainer}></div> `;
};

export default Editor;
