import { h, render } from 'https://cdn.skypack.dev/preact'
import htm from 'https://unpkg.com/htm?module'
import App from './components/App.js'


const html = htm.bind(h);
// var html = window.htm.bind(h)


render(html`<${App} />`, document.body);

