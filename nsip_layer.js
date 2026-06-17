/**
 * nsip_layer.js
 * HTST Pipeline Map — NSIP Solar Projects Layer
 * Harvesting the Sun Twice (harvestingthesuntwice.org)
 *
 * Seven large NSIP solar projects absent from REPD Q1 2026.
 * Toggled separately from the main REPD dots layer.
 *
 * PINS status colour coding:
 *   Pre-Application  → #F59E0B  (amber)
 *   Accepted         → #3B82F6  (blue)
 *   In Examination   → #8B5CF6  (purple)
 *   Approved         → #10B981  (green)
 *   Withdrawn        → #6B7280  (grey)
 *
 * Generated: 17/06/2026
 * Sources: PINS, developer websites, official NSIP documentation
 *
 * ⚠️ COORDINATE NOTE: Centroids are approximate centre-of-site points
 * derived from village locations and planning documents. Sub-kilometre
 * accuracy sufficient for a pipeline-level map at this scale.
 *
 * ⚠️ REFERENCE NOTE: East Pye appears in PINS as EN0110014 (not EN010169
 * as initially logged). Briefing ref EN010169 retained as alias below
 * pending confirmation. Clean Air ref EN0110018 unconfirmed at PINS —
 * project is at pre-application stage; ref may not yet be assigned.
 * South Brooks confirmed as EN0110027.
 */

// ─────────────────────────────────────────────────────────────────────────────
// NSIP PROJECT DATA
// ─────────────────────────────────────────────────────────────────────────────

const nsipProjects = [
  {
    id: "lime-down",
    name: "Lime Down Solar Park",
    ref: "EN010168",
    developer: "Island Green Power",
    mw: 840,
    status: "In Examination",
    statusCode: "examination",
    location: "North of Hullavington, Wiltshire",
    county: "Wiltshire",
    lat: 51.552,
    lng: -2.123,
    pinsUrl: "https://national-infrastructure-consenting.planninginspectorate.gov.uk/projects/EN010168",
    notes: "Six dispersed solar PV sites ~2,000 acres. Grid connection to Melksham Substation. Wiltshire Council objection on landscape grounds.",
    htst_rep: "S62ECF076"
  },
  {
    id: "mylen-leah",
    name: "Mylen Leah Solar Farm",
    ref: "EN0110002",
    developer: "Statkraft",
    mw: 350,
    status: "Pre-Examination",
    statusCode: "pre-application",
    location: "Between Seaton Ross, Melbourne and Foggathorpe, East Riding of Yorkshire",
    county: "East Riding of Yorkshire",
    lat: 53.862,
    lng: -0.820,
    pinsUrl: "https://national-infrastructure-consenting.planninginspectorate.gov.uk/projects/EN0110002",
    notes: "~1,200 ha. Adjacent to Statkraft Greener Grid Park (Thornton). DCO application expected late 2026. Statutory consultation April–May 2026.",
    htst_rep: "Submitted"
  },
  {
    id: "the-droves",
    name: "The Droves Solar Farm",
    ref: "EN0110013",
    developer: "Island Green Power",
    mw: 400,
    status: "Pre-Examination",
    statusCode: "pre-application",
    location: "North of Swaffham / South of Castle Acre, West Norfolk",
    county: "Norfolk",
    lat: 52.688,
    lng: 0.672,
    pinsUrl: "https://national-infrastructure-consenting.planninginspectorate.gov.uk/projects/EN0110013",
    notes: "~840 ha. Accepted for examination December 2025. Pre-examination stage ongoing.",
    htst_rep: "Submitted"
  },
  {
    id: "east-pye",
    name: "East Pye Solar",
    ref: "EN0110014",
    refAlias: "EN010169",
    developer: "Island Green Power",
    mw: 500,
    status: "Accepted",
    statusCode: "accepted",
    location: "East of Long Stratton / South of Great Moulton, South Norfolk",
    county: "Norfolk",
    lat: 52.470,
    lng: 1.228,
    pinsUrl: "https://national-infrastructure-consenting.planninginspectorate.gov.uk/projects/EN0110014",
    notes: "~1,212 ha across 10+ sites. Accepted 2 April 2026. Relevant Representations closed 10 June 2026.",
    htst_rep: "Pending"
  },
  {
    id: "south-brooks",
    name: "South Brooks Solar Farm",
    ref: "EN0110027",
    developer: "EDF Power Solutions UK / PS Renewables",
    mw: 500,
    status: "Pre-Examination",
    statusCode: "pre-application",
    location: "Near Lydd, Romney Marsh, Kent",
    county: "Kent",
    lat: 50.962,
    lng: 0.908,
    pinsUrl: "https://national-infrastructure-consenting.planninginspectorate.gov.uk/projects/EN0110027",
    notes: "~1,600 acres (reduced from 2,700 acres). Grid connection to Dungeness Substation. DCO application expected early 2027.",
    htst_rep: "Pending"
  },
  {
    id: "clean-air",
    name: "Clean Air Solar Farm",
    ref: "EN0110018",
    developer: "PS Renewables / Perigus Energy",
    mw: 500,
    status: "Pre-Examination",
    statusCode: "pre-application",
    location: "North of Beverley, East Riding of Yorkshire",
    county: "East Riding of Yorkshire",
    lat: 53.895,
    lng: -0.445,
    pinsUrl: "https://national-infrastructure-consenting.planninginspectorate.gov.uk/projects/EN0110018",
    notes: "Evolution of Kingfisher Solar Farm. Two land parcels N of Beverley. Webinar consultation 29 June 2026. PINS ref may not yet be formally assigned.",
    htst_rep: "PID Engagement letter sent"
  },
  {
    id: "kingsway",
    name: "Kingsway Solar Farm",
    ref: "EN010165",
    developer: "Downing Renewable Developments",
    mw: 500,
    status: "Acceptance Decision 18/06/2026",
    statusCode: "accepted",
    location: "Between Burwell and Balsham, Cambridgeshire",
    county: "Cambridgeshire",
    lat: 52.198,
    lng: 0.370,
    pinsUrl: "https://national-infrastructure-consenting.planninginspectorate.gov.uk/projects/EN010165",
    notes: "~1,246 ha. 15km overhead line connection to Burwell Substation. Acceptance decision due 18/06/2026. ~30-day Relevant Representations window to follow if accepted.",
    htst_rep: "Representation submitted"
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// STATUS → COLOUR MAPPING
// ─────────────────────────────────────────────────────────────────────────────

const nsipStatusColours = {
  "pre-application": "#F59E0B",  // amber
  "accepted":        "#3B82F6",  // blue
  "examination":     "#8B5CF6",  // purple
  "approved":        "#10B981",  // green
  "withdrawn":       "#6B7280"   // grey
};

function getNSIPColour(statusCode) {
  return nsipStatusColours[statusCode] || "#9CA3AF";
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER CREATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates and returns a Leaflet LayerGroup containing all NSIP markers.
 * Call this after Leaflet is initialised.
 *
 * @param {L} L - The Leaflet global object
 * @returns {L.LayerGroup}
 */
function createNSIPLayer(L) {
  const nsipLayerGroup = L.layerGroup();

  nsipProjects.forEach(project => {
    const colour = getNSIPColour(project.statusCode);

    // Circle marker — larger than REPD dots, white border, status-coded fill
    const marker = L.circleMarker([project.lat, project.lng], {
      radius: 11,
      fillColor: colour,
      fillOpacity: 0.85,
      color: "#FFFFFF",
      weight: 2.5,
      className: "nsip-marker"
    });

    // Build popup content
    const htst_badge = project.htst_rep && project.htst_rep !== "Pending"
      ? `<div class="nsip-popup-htst">📋 HTST: ${project.htst_rep}</div>`
      : '';

    const refAlias = project.refAlias
      ? ` <span style="font-size:0.8em;color:#9CA3AF">(also ref: ${project.refAlias})</span>`
      : '';

    const popupContent = `
      <div class="nsip-popup">
        <div class="nsip-popup-header" style="border-left:4px solid ${colour}">
          <strong>${project.name}</strong>
        </div>
        <table class="nsip-popup-table">
          <tr><td>📍 PINS Ref</td><td><a href="${project.pinsUrl}" target="_blank">${project.ref}</a>${refAlias}</td></tr>
          <tr><td>🏗️ Developer</td><td>${project.developer}</td></tr>
          <tr><td>⚡ Capacity</td><td>${project.mw} MW</td></tr>
          <tr><td>📍 Location</td><td>${project.location}</td></tr>
          <tr><td>🔄 Status</td><td><span class="nsip-status-badge" style="background:${colour}">${project.status}</span></td></tr>
          <tr><td>📝 Notes</td><td style="font-size:0.85em">${project.notes}</td></tr>
        </table>
        ${htst_badge}
      </div>
    `;

    marker.bindPopup(popupContent, {
      maxWidth: 340,
      className: "nsip-popup-container"
    });

    // Tooltip on hover (project name + MW)
    marker.bindTooltip(
      `<strong>${project.name}</strong><br>${project.mw} MW · ${project.county}`,
      { direction: "top", offset: [0, -12] }
    );

    marker.addTo(nsipLayerGroup);
  });

  return nsipLayerGroup;
}

// ─────────────────────────────────────────────────────────────────────────────
// NSIP LEGEND HTML
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the HTML string for the NSIP status legend block.
 * Inject this into the sidebar legend section after the ALC legend.
 */
function getNSIPLegendHTML() {
  return `
    <div class="legend-section nsip-legend-section" id="nsip-legend">
      <div class="legend-section-title">
        <span class="nsip-legend-icon">⬤</span> NSIP Solar Projects
        <span style="font-size:0.75em;font-weight:normal;color:#6B7280">(not in REPD)</span>
      </div>
      <div class="legend-item">
        <span class="legend-colour nsip-legend-dot" style="background:#8B5CF6;border:2px solid white"></span>
        In Examination
      </div>
      <div class="legend-item">
        <span class="legend-colour nsip-legend-dot" style="background:#3B82F6;border:2px solid white"></span>
        Accepted
      </div>
      <div class="legend-item">
        <span class="legend-colour nsip-legend-dot" style="background:#F59E0B;border:2px solid white"></span>
        Pre-Application / Consultation
      </div>
      <div class="legend-item">
        <span class="legend-colour nsip-legend-dot" style="background:#10B981;border:2px solid white"></span>
        Approved
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS — inject into <style> or a .css file
// ─────────────────────────────────────────────────────────────────────────────

/*
Add the following CSS to your map.html <style> block or site stylesheet:

.nsip-popup {
  font-family: 'Google Sans Flex', 'Google Sans', sans-serif;
  font-size: 13px;
  min-width: 280px;
}
.nsip-popup-header {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  margin-bottom: 6px;
  background: #F9FAFB;
  border-radius: 4px;
}
.nsip-popup-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.nsip-popup-table td {
  padding: 3px 6px;
  vertical-align: top;
}
.nsip-popup-table td:first-child {
  color: #6B7280;
  white-space: nowrap;
  font-size: 11px;
}
.nsip-status-badge {
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}
.nsip-popup-htst {
  margin-top: 6px;
  padding: 4px 8px;
  background: #EFF6FF;
  border-left: 3px solid #3B82F6;
  font-size: 11px;
  color: #1D4ED8;
  border-radius: 0 4px 4px 0;
}
.nsip-legend-dot {
  width: 14px !important;
  height: 14px !important;
  border-radius: 50% !important;
  display: inline-block;
}
.nsip-legend-section {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #E5E7EB;
}
.nsip-legend-section .legend-section-title {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 6px;
  color: #374151;
}
.leaflet-popup-content-wrapper.nsip-popup-container {
  border-radius: 8px;
}
*/
