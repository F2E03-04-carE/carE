export const verifyTaxId = async (req, res) => {
  const { taxId } = req.query;

  if (!taxId) {
    return res.status(400).json({ exists: false });
  }

  const filter = encodeURIComponent(`No eq ${taxId}`);
  const url = `https://data.gcis.nat.gov.tw/od/data/api/673F0FC0-B3A7-429F-9041-E9866836B66D?$format=json&$filter=${filter}`;

  try {
    const r = await fetch(url);
    const data = await r.json();

    res.json({
      exists: Array.isArray(data) && data.length > 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ exists: false });
  }
};
