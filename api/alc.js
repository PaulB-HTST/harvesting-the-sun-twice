export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  const url = 'https://environment.data.gov.uk/spatialdata/agricultural-land-classification-provisional-england/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=Agricultural_Land_Classification_(Provisional)_(England)&outputFormat=application/json&srsName=EPSG:4326&count=2000';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Upstream ' + response.status);
    const data = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
