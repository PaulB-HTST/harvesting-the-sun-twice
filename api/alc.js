export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  // Provisional ALC (full national coverage for England) - confirmed 200 OK
  const url = 'https://services.arcgis.com/JJzESW51TqeY9uat/ArcGIS/rest/services/Provisional%20Agricultural%20Land%20Classification%20(ALC)%20(England)/FeatureServer/0/query?where=1%3D1&outFields=ALC_GRADE&returnGeometry=true&outSR=4326&f=geojson&resultRecordCount=2000';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) throw new Error('Upstream ' + response.status);
    const data = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
