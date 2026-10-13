// Shared GeoJSON formatting so era files stay hand-editable: one feature per block, geometry on one line.

export function formatFeatureCollection(fc) {
  const { features, ...rest } = fc;
  const head = JSON.stringify(rest, null, 2).replace(/\n}$/, '');
  const body = features.map((f) => {
    const props = JSON.stringify(f.properties, null, 2).replace(/\n/g, '\n      ');
    return `    {\n      "type": "Feature",\n      "properties": ${props},\n      "geometry": ${JSON.stringify(f.geometry)}\n    }`;
  });
  return `${head},\n  "features": [\n${body.join(',\n')}\n  ]\n}\n`;
}
