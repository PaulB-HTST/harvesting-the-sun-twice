// api/alc-point.js
// Vercel serverless function — ALC point-in-polygon query
// Returns { grade: "Grade 2" } for a given lat/lng.
// Pattern matches api/alc.js — same ArcGIS FeatureServer source.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng required' });
  }

  const BASE =
    'https://services.arcgis.com/JJzESW51TqeY9uat/ArcGIS/rest/services/' +
    'Provisional%20Agricultural%20Land%20Classification%20(ALC)%20(England)/' +
    'FeatureServer/0/query';

  const geom = encodeURIComponent(
    JSON.stringify({
      x: parseFloat(lng),
      y: parseFloat(lat),
      spatialReference: { wkid: 4326 }
    })
  );

  const url =
    BASE +
    '?geometry=' + geom +
    '&geometryType=esriGeometryPoint' +
    '&spatialRel=esriSpatialRelIntersects' +
    '&outFields=ALC_GRADE' +
    '&returnGeometry=false' +
    '&f=json';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) throw new Error('Upstream ' + response.status);

    const data = await response.json();
    const grade =
      (data.features &&
        data.features[0] &&
        data.features[0].attributes &&
        data.features[0].attributes.ALC_GRADE) ||
      'Not surveyed';

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ grade });
  } catch (err) {
    // Return a safe fallback so the popup still renders
    res.status(200).json({ grade: 'Not surveyed', error: err.message });
  }
}
