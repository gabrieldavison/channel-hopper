import { h } from 'https://unpkg.com/preact?module';
import { useRef, useEffect } from 'https://cdn.skypack.dev/preact/hooks';
import htm from 'https://unpkg.com/htm?module';
const html = htm.bind(h);

const HydraCanvas = () => {
  const hydraCanvasRef = useRef(null)


  useEffect(() => {
    const hydra = new Hydra({
      canvas: hydraCanvasRef.current,
    });

    osc(105)
    .color(0.5, 0.1, 0.8)
    .rotate(0.11, 0.1)
    .modulate(osc(10).rotate(0.3).add(o0, 0.1))
    .add(osc(20, 0.01, 1).color(0, 0.8, 1))
    .out(o0);
  osc(50, 0.05, 0.7).color(1, 0.7, 0.5).diff(o0).modulate(o1, 0.05).out(o1);
  render(o1);
  }, [])

  return html`<canvas ref=${hydraCanvasRef} id="hydra-canvas"></canvas>`
}

export default HydraCanvas