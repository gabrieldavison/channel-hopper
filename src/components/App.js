import { h } from "https://cdn.skypack.dev/preact";
import {
  useState,
  useEffect,
  useRef,
} from "https://cdn.skypack.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";
// import { Codemirror } from "https://cdn.skypack.dev/@mischnic/codemirror-preact";

import HydraCanvas from "./HydraCanvas.js";
import Editor from "./Editor.js";
import Keyboard from "./Keyboard.js";

const html = htm.bind(h);

const App = () => {
  const [keyState, setKeyState] = useState({ 1: "" });
  const [activeKey, setActiveKey] = useState("1");
  const [editorContent, setEditorContent] = useState(keyState["1"]);
  const [editorErrors, setEditorErrors] = useState("");
  const [displayState, setDisplayState] = useState("visibleFocusKeyboard");
  const editorRef = useRef(null);
  const codemirrorRef = useRef(null);

  //Adds key event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  function handleKeydown(e) {
    const presetKeyRegex = /([a-z0-9;,./])/g;
    const key = e.key;
    if (key === "Escape") {
      handleKeyEscape();
    } else if (key === "Enter") {
      handleKeyEnter();
    } else if (presetKeyRegex.test(key) && key.length === 1) {
      handleKeyPreset(key);
    }
  }

  //NEED TO ADD STATE THAT DECIDES WHEN TO BLOCK ENTER BUTTON DEFAULT BEHAVIOUR

  function handleKeyEscape() {
    editorRef.current?.blur();
    if (displayState === "visibleFocusKeyboard") {
      setDisplayState("hidden");
    } else {
      setDisplayState("visibleFocusKeyboard");
    }
  }

  function handleKeyEnter() {
    if (displayState === "visibleFocusKeyboard") {
      setDisplayState("visibleFocusEditor");
      editorRef.current.focus();
    }
  }

  function handleKeyPreset(key) {
    if (displayState !== "visibleFocusEditor") {
      setActiveKey(key);
    }
  }

  const handleChangeEditorContent = (content) => {
    setEditorContent(content);
    setKeyState({ ...keyState, [activeKey]: content });
  };

  // Sets editor content and evals code when activeKey changes
  useEffect(() => {
    setEditorErrors("");
    if (keyState[activeKey]) {
      setEditorContent(keyState[activeKey]);

      try {
        eval(keyState[activeKey]);
      } catch (e) {
        console.log(e);
        setEditorErrors(e.message);
      }
    } else {
      setEditorContent("");
    }
  }, [activeKey]);

  // function initCodemirror(container) {
  //   codemirrorRef.current = CodeMirror(container, {
  //     content: editorContent,
  //   });
  //   codemirrorRef.current.on("focus", () => {
  //     setDisplayState("visibleFocusEditor");
  //   });
  //   codemirrorRef.current.on("blur", () => {
  //     setDisplayState("visibleFocusKeyboard");
  //   });
  //   codemirrorRef.current.on("change", () => {
  //     handleChangeEditorContent(codemirrorRef.current.getValue());
  //   });
  // }

  return html`
    <h1>${activeKey}</h1>
    <${HydraCanvas} />
    ${displayState !== "hidden"
      ? html`
          <${Editor}
            editorContent=${editorContent}
            handleChangeEditorContent=${handleChangeEditorContent}
            editorRef=${editorRef}
            setDisplayState=${setDisplayState}
          />
          <div>${editorErrors}</div>
          <${Keyboard} setActiveKey=${setActiveKey} />
        `
      : null}
  `;
};

export default App;
