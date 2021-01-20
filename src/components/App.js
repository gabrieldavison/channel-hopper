import { h } from "https://cdn.skypack.dev/preact";
import {
  useState,
  useEffect,
  useRef,
} from "https://cdn.skypack.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";
import HydraCanvas from "./HydraCanvas.js";
import Editor from "./Editor.js";
import Keyboard from "./Keyboard.js";

const html = htm.bind(h);

const App = () => {
  const [keyState, setKeyState] = useState({ 1: "" });
  const [activeKey, setActiveKey] = useState("1");
  const [editorContent, setEditorContent] = useState(keyState["1"]);
  const [displayState, setDisplayState] = useState("visibleFocusKeyboard");
  const [focusState, setFocusState] = useState("keyboard");
  const editorRef = useRef(null);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  function handleKeydown(e) {
    switch (e.key) {
      case "Escape":
        handleKeyEscape();
        break;
      case "Enter":
        handleKeyEnter();
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

  const handleChangeEditorContent = (content) => {
    setEditorContent(content);
    setKeyState({ ...keyState, [activeKey]: content });
  };

  // Sets editor content and evals code when activeKey changes
  useEffect(() => {
    if (keyState[activeKey]) {
      setEditorContent(keyState[activeKey]);
      eval(keyState[activeKey]);
    } else {
      setEditorContent("");
    }
  }, [activeKey]);

  return html`
    <h1>${activeKey}</h1>
    <${HydraCanvas} />
    ${displayState !== "hidden"
      ? html`
          <${Editor}
            editorContent=${editorContent}
            handleChangeEditorContent=${handleChangeEditorContent}
            editorRef=${editorRef}
          />
          <${Keyboard} setActiveKey=${setActiveKey} />
        `
      : null}
  `;
};

export default App;
