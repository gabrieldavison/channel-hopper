import { h } from "https://unpkg.com/preact?module";
import { useRef, useEffect } from "https://cdn.skypack.dev/preact/hooks";
import htm from "https://unpkg.com/htm?module";
const html = htm.bind(h);

const HydraCanvas = () => {
  const hydraCanvasRef = useRef(null);
  const hydraRef = useRef(null);

  useEffect(() => {
    hydraRef.current = new Hydra({
      canvas: hydraCanvasRef.current,
    });

    hydraRef.current.setResolution(1280, 720);
    osc(10).out(o0);
    render(o0);
  }, []);

  return html` <canvas
    class="hydra-canvas"
    ref=${hydraCanvasRef}
    id="hydra-canvas"
  ></canvas>`;
};

export default HydraCanvas;
