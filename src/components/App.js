import { h } from "https://cdn.skypack.dev/preact";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "https://cdn.skypack.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";
// import { Codemirror } from "https://cdn.skypack.dev/@mischnic/codemirror-preact";

import HydraCanvas from "./HydraCanvas.js";
import Editor from "./Editor.js";
import Keyboard from "./Keyboard.js";

const html = htm.bind(h);

const App = () => {
  const [keyState, setKeyState] = useState({ 1: "" });
  const [keysHeld, setKeysHeld] = useState({});
  const [activeKey, setActiveKey] = useState("1");
  const [editorContent, setEditorContent] = useState(keyState["1"]);
  const [editorErrors, setEditorErrors] = useState("");
  const [displayState, setDisplayState] = useState("visibleFocusKeyboard");
  const editorRef = useRef(null);

  //Adds key event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keyup", handleKeyup);
    };
  });

  function handleKeyup(e) {
    setKeysHeld({ ...keysHeld, [e.key]: false });
  }

  function handleKeydown(e) {
    setKeysHeld({ ...keysHeld, [e.key]: true });
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
    if (keysHeld["Control"] && keysHeld["Shift"]) {
      evalCode(keyState[activeKey]);
    } else if (keysHeld["Control"]) {
      evalCode(extractCurrentLine(keyState[activeKey]));
    } else if (displayState === "visibleFocusKeyboard") {
      setDisplayState("visibleFocusEditor");
      editorRef.current.focus();
    }
  }

  function handleKeyPreset(key) {
    if (displayState !== "visibleFocusEditor") {
      setActiveKey(key);
      if (keyState[key]) {
        evalCode(keyState[key]);
      }
    }
  }

  const handleChangeEditorContent = (content) => {
    setEditorContent(content);
    setKeyState({ ...keyState, [activeKey]: content });
  };

  function evalCode(code) {
    setEditorErrors("");
    try {
      eval(code);
    } catch (e) {
      console.log(e);
      setEditorErrors(e.message);
    }
  }

  function extractCurrentLine() {
    const textArea = editorRef.current;
    const lineNo = editorContent
      .substr(0, textArea.selectionStart)
      .split(/\r?\n|\r/).length;
    const lineContent = editorContent.split(/\r?\n|\r/)[lineNo - 1];
    return lineContent;
  }

  // function evalCurrentLine() {
  //   // Get the current line from textarea
  //   const textArea = editorRef.current;
  //   const lineNo = editorContent
  //     .substr(0, textArea.selectionStart)
  //     .split(/\r?\n|\r/).length;
  //   const lineContent = editorContent.split(/\r?\n|\r/)[lineNo - 1];
  //   setEditorErrors("");
  //   try {
  //     eval(lineContent);
  //   } catch (e) {
  //     console.log(e);
  //     setEditorErrors(e.message);
  //   }
  // }

  return html`
    <h1>${activeKey}</h1>
    <${HydraCanvas} />
    ${displayState !== "hidden"
      ? html`
          <${Editor}
            editorContent=${keyState[activeKey]}
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
