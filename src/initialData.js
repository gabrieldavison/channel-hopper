const initialData = {
  1: `osc(10).out(o0)`,
  2: `osc(100).out(o0)`,
  3: `osc(1000).out(o0)`,
  4: `osc(10000).out(o0)`,
  5: `osc(1000).modulate(osc(10)).out(o0)`,
  6: `osc(1000).modulate(osc(100)).out(o0)`,
  7: `voronoi(10).out(o0)`,
  8: `voronoi(10).modulate(osc(100)).out(o0)`,
  9: `voronoi(10).modulate(osc(1000)).blend(o0).out(o0)`,
  0: `voronoi(10).modulate(osc(1000)).colorama(2).out(o0)`
}

export default initialData