export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  const BASE = 'https://services.arcgis.com/JJzESW51TqeY9uat/ArcGIS/rest/services/Provisional%20Agricultural%20Land%20Classification%20(ALC)%20(England)/FeatureServer/0/query';
  const PAGE = 2000;
  const MAX_PAGES = 10; // safety cap ~20,000 features

  try {
    const allFeatures = [];
    let offset = 0;
    let more = true;

    while (more && offset < PAGE * MAX_PAGES) {
      const url = BASE + '?where=1%3D1&outFields=ALC_GRADE&returnGeometry=true&outSR=4326&f=geojson' +
        '&resultRecordCount=' + PAGE + '&resultOffset=' + offset;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) throw new Error('Upstream ' + response.status);
      const page = await response.json();

      if (page.features && page.features.length > 0) {
        allFeatures.push(...page.features);
      }

      // ArcGIS signals more pages via exceededTransferLimit
      more = page.features && page.features.length === PAGE;
      offset += PAGE;
    }

    const geojson = {
      type: 'FeatureCollection',
      features: allFeatures
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(geojson);

  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
