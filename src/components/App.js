import { h } from "https://cdn.skypack.dev/preact";
import {
  useState,
  useEffect,
  useRef,
} from "https://cdn.skypack.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";
import initialData from '../initialData.js'
//Components
import HydraCanvas from "./HydraCanvas.js";
import Editor from "./Editor.js";
import Keyboard from "./Keyboard.js";
import Modal from "./Modal.js";

const html = htm.bind(h);

const App = () => {
  // const [presetState, setPresetState] = useState({ 1: "" });
  const [presetState, setPresetState] = useState(initialData);

  const [autoEval, setAutoEval] = useState(true);
  const [keysHeld, setKeysHeld] = useState({});
  const [activeKey, setActiveKey] = useState("1");
  const [editorContent, setEditorContent] = useState(presetState["1"]);
  const [editorErrors, setEditorErrors] = useState("");
  const [displayState, setDisplayState] = useState("visibleFocusKeyboard");
  const [showModal, setShowModal] = useState(false);
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

  //Loads data from local storage
  useEffect(() => {
    const loadedData = JSON.parse(localStorage.getItem(`savedData`));
    if (loadedData) setPresetState(loadedData);
  }, []);

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
      handleKeyEnter(e);
    } else if (key === "Tab") {
      e.preventDefault();
      handleKeyTab();
    } else if (presetKeyRegex.test(key) && key.length === 1) {
      handleKeyPreset(key);
    }
  }
  function handleKeyTab() {
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    presetState[activeKey] =
      presetState[activeKey].substring(0, start) +
      "\t" +
      presetState[activeKey].substring(end);

    // put caret at right position again
    textarea.selectionStart = textarea.selectionEnd = start + 1;
  }

  function handleKeyEscape() {
    editorRef.current?.blur();
    if (showModal) {
      setShowModal(false);
    } else if (displayState === "visibleFocusKeyboard") {
      setDisplayState("hidden");
    } else {
      setDisplayState("visibleFocusKeyboard");
    }
  }

  function handleKeyEnter(e) {
    if (keysHeld["Control"] && keysHeld["Shift"]) {
      evalCode(presetState[activeKey]);
    } else if (keysHeld["Control"]) {
      evalCode(extractCurrentLine(presetState[activeKey]));
    } else if (displayState === "visibleFocusKeyboard") {
      e.preventDefault();
      setDisplayState("visibleFocusEditor");
      editorRef.current.focus();
    }
  }

  function handleKeyPreset(key) {
    if (displayState !== "visibleFocusEditor") {
      setActiveKey(key);
      if (presetState[key] && autoEval) {
        evalCode(presetState[key]);
      }
    }
  }

  const handleChangeEditorContent = (content) => {
    setEditorContent(content);
    const newPresetState = { ...presetState, [activeKey]: content };
    setPresetState(newPresetState);
    saveToLocalStorage(newPresetState);
  };

  function evalCode(code) {
    setEditorErrors("");
    hush();
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

  function toggleModal() {
    showModal ? setShowModal(false) : setShowModal(true);
  }
  function saveToLocalStorage(data) {
    localStorage.setItem("savedData", JSON.stringify(data));
  }
  function clearPresets() {
    setPresetState({});
    localStorage.removeItem("savedData");
  }
  function exportPresets() {
    const exportData = JSON.stringify(presetState);
    const dataBlob = new Blob([exportData], { type: "application/json" });
    const dataURL = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement("a");
    downloadLink.download = "hydramod-export.json";
    downloadLink.href = dataURL;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  function importPresets(e) {
    const importedFile = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(importedFile);
    fileReader.onload = async (e) => {
      let importedData = JSON.parse(e.target.result);
      setPresetState(importedData);
    };
  }

  return html`
    <${HydraCanvas} />
    ${displayState !== "hidden"
      ? html`
          <button onClick=${toggleModal} class="app__button">...</button>
          ${showModal
            ? html`<${Modal}
                clearPresets=${clearPresets}
                exportPresets=${exportPresets}
                importPresets=${importPresets}
                toggleModal=${toggleModal}
              />`
            : null}
          <${Editor}
            editorContent=${presetState[activeKey]}
            handleChangeEditorContent=${handleChangeEditorContent}
            editorRef=${editorRef}
            setDisplayState=${setDisplayState}
            editorErrors=${editorErrors}
          />

          <${Keyboard}
            setActiveKey=${setActiveKey}
            activeKey=${activeKey}
            autoEval=${autoEval}
            setAutoEval=${setAutoEval}
          />
        `
      : html`<div class="app__preset-indicator">${activeKey}</div>`}
  `;
};

export default App;
