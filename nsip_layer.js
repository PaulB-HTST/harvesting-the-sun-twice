const nsipStatusColors = {
  'pre_application':    '#9B59B6',
  'acceptance_pending': '#F39C12',
  'accepted':           '#3498DB',
  'pre_examination':    '#2980B9',
  'examination':        '#E74C3C',
  'decision':           '#27AE60',
  'approved':           '#1ABC9C',
  'withdrawn':          '#95A5A6',
  'default':            '#E67E22'
};
const nsipStatusLabels = {
  'pre_application':    'Pre-Application',
  'acceptance_pending': 'Acceptance Decision Pending',
  'accepted':           'Accepted — Pre-Examination',
  'pre_examination':    'Pre-Examination',
  'examination':        'In Examination',
  'decision':           'Decision Stage',
  'approved':           'Approved / Consented',
  'withdrawn':          'Withdrawn',
  'default':            'Unknown'
};
function getNsipMarkerStyle(feature) {
  const statusCode = feature.properties.status_code || 'default';
  const fillColor  = nsipStatusColors[statusCode] || nsipStatusColors['default'];
  const mw         = feature.properties.capacity_mw || 0;
  const radius     = Math.min(18, Math.max(14, 10 + Math.sqrt(mw / 50)));
  return {
    radius:      radius,
    fillColor:   fillColor,
    color:       '#FFFFFF',
    weight:      2.5,
    opacity:     1,
    fillOpacity: 0.88
  };
}
function buildNsipPopup(props) {
  const statusCode  = props.status_code || 'default';
  const statusColor = nsipStatusColors[statusCode] || nsipStatusColors['default'];
  const statusLabel = nsipStatusLabels[statusCode]  || props.status || 'Unknown';
  const pinsRef     = props.pins_ref || 'TBC';
  const pinsUrl     = props.pins_url || '#';
  const mw          = props.capacity_mw ? props.capacity_mw + ' MW' : 'TBC';
  const bmvNote     = '<span style="background:#FEF8A4;color:#333;font-size:0.78em;padding:1px 5px;border-radius:3px;border:1px solid #ccc;margin-left:4px;">BMV concern</span>';
  return `
    <div style="font-family:sans-serif;min-width:260px;max-width:320px;line-height:1.5;">
      <div style="background:#1a1a2e;color:#fff;padding:8px 10px;border-radius:4px 4px 0 0;margin:-1px -1px 8px -1px;">
        <strong style="font-size:1.05em;">${props.name || 'NSIP Project'}</strong>${bmvNote}
      </div>
      <table style="width:100%;font-size:0.88em;border-collapse:collapse;">
        <tr><td style="color:#666;padding:2px 6px 2px 0;white-space:nowrap;"><strong>Developer</strong></td><td>${props.developer || 'TBC'}</td></tr>
        <tr><td style="color:#666;padding:2px 6px 2px 0;white-space:nowrap;"><strong>Capacity</strong></td><td>${mw}</td></tr>
        <tr><td style="color:#666;padding:2px 6px 2px 0;white-space:nowrap;"><strong>Location</strong></td><td>${props.county || 'TBC'}</td></tr>
        <tr><td style="color:#666;padding:2px 6px 2px 0;white-space:nowrap;"><strong>Status</strong></td>
          <td><span style="background:${statusColor};color:#fff;font-size:0.82em;padding:1px 6px;border-radius:3px;font-weight:bold;">${statusLabel}</span></td></tr>
        <tr><td style="color:#666;padding:2px 6px 2px 0;white-space:nowrap;"><strong>PINS Ref</strong></td>
          <td>${pinsRef !== 'TBC' ? `<a href="${pinsUrl}" target="_blank" rel="noopener" style="color:#2980B9;">${pinsRef} ↗</a>` : 'TBC'}</td></tr>
      </table>
      ${props.notes ? `<div style="margin-top:7px;padding:6px 8px;background:#f5f5f5;border-left:3px solid ${statusColor};font-size:0.82em;color:#444;border-radius:0 3px 3px 0;">${props.notes}</div>` : ''}
      <div style="margin-top:6px;font-size:0.75em;color:#999;text-align:right;">NSIP layer · harvestingthesuntwice.org</div>
    </div>`;
}
let nsipLayerGroup = null;
function initNsipLayer(map) {
  fetch('nsip_projects.geojson')
    .then(function(r) {
      if (!r.ok) throw new Error('nsip_projects.geojson not found');
      return r.json();
    })
    .then(function(geojson) {
      nsipLayerGroup = L.geoJSON(geojson, {
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, getNsipMarkerStyle(feature));
        },
        onEachFeature: function(feature, layer) {
          const props = feature.properties;
          layer.bindPopup(buildNsipPopup(props), { maxWidth: 340 });
          layer.on('mouseover', function() {
            this.setStyle({ weight: 4, color: '#FFD700' });
            this.bringToFront();
          });
          layer.on('mouseout', function() { nsipLayerGroup.resetStyle(this); });
          layer.bindTooltip(
            '<strong>' + (props.name || 'NSIP Project') + '</strong><br>' +
            (props.capacity_mw ? props.capacity_mw + ' MW · ' : '') +
            (nsipStatusLabels[props.status_code] || props.status || ''),
            { sticky: true }
          );
        }
      });
      nsipLayerGroup.addTo(map);
      console.log('[HTST] NSIP layer loaded: ' + geojson.features.length + ' projects');
    })
    .catch(function(err) { console.error('[HTST] NSIP layer error:', err.message); });
}
function getNsipLegendHTML() {
  const entries = [
    ['pre_application',    'Pre-Application'],
    ['acceptance_pending', 'Acceptance Decision Pending'],
    ['pre_examination',    'Pre-Examination / Accepted'],
    ['examination',        'In Examination'],
    ['approved',           'Approved / Consented']
  ];
  const rows = entries.map(function(e) {
    const color = nsipStatusColors[e[0]];
    return `<div style="display:flex;align-items:center;margin-bottom:4px;">
      <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;outline:1px solid #999;margin-right:7px;flex-shrink:0;"></span>
      <span style="font-size:0.82em;">${e[1]}</span></div>`;
  }).join('');
  return `<div id="nsip-legend" style="margin-top:12px;padding:8px;border-top:1px solid #ddd;">
    <div style="font-weight:bold;font-size:0.85em;margin-bottom:6px;color:#333;">● NSIP Projects (not in REPD)</div>
    ${rows}
    <div style="font-size:0.75em;color:#888;margin-top:5px;">Larger markers · white border · ~3,150 MW total</div>
  </div>`;
}
