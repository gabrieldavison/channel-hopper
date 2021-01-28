import { h } from "https://unpkg.com/preact?module";
import htm from "https://unpkg.com/htm?module";
const html = htm.bind(h);
// prettier-ignore
const allKeys = ['1','2','3','4','5','6','7','8','9','0',
                  'q','w','e','r','t','y','u','i','o','p',
                   'a','s','d','f','g','h','j','k','l',';',
                    'z','x','c','v','b','n','m',',','.','/']

const Keyboard = ({ setActiveKey, activeKey }) => {
  return html`
    <div class="keyboard">
      ${allKeys.map(
        (item) => html`
          <button
            class=${activeKey === item
              ? "keyboard__button keyboard__button--active "
              : "keyboard__button "}
            onClick=${() => setActiveKey(item)}
            key=${item}
          >
            ${item}
          </button>
        `
      )}
    </div>
  `;
};

export default Keyboard;
