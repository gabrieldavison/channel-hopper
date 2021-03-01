import { h } from "https://unpkg.com/preact?module";
import htm from "https://unpkg.com/htm?module";
const html = htm.bind(h);

const Modal = ({ clearPresets, exportPresets, importPresets, toggleModal }) => {
  return html`
    <div class="modal">
      <div className="modal__button-container">
        <button class="modal__button" onClick=${exportPresets}>
          export presets
        </button>
        <label class="modal__file-label" for="import-file">
          import presets
          <input
            onChange=${importPresets}
            class="modal__file-input"
            id="import-file"
            type="file"
          />
        </label>
        <!-- <button onClick=${importPresets}>import presets</button> -->
        <button class="modal__button" onClick=${clearPresets}>
          clear presets
        </button>
        <button class="modal__button" onClick=${toggleModal}>close</button>
      </div>
    </div>
  `;
};

export default Modal;
