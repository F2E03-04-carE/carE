export const verifyTaxId = (req, res) => {
  const { taxId } = req.query;
  if (!taxId || taxId.length !== 8 || !/^\d+$/.test(taxId)) {
    return res.status(400).json({ exists: false, error: '統編格式錯誤' });
  }

  const filter = encodeURIComponent(`No eq ${taxId}`);
  const url = `https://data.gcis.nat.gov.tw/od/data/api/673F0FC0-B3A7-429F-9041-E9866836B66D?$format=json&$filter=${filter}`;

  fetch(url)
    .then(r => {
      if (!r.ok) throw new Error('政府 API 回應錯誤');
      return r.json();
    })
    .then(data => {
      // 政府 API 回傳陣列，檢查是否有資料且 exist === "Y"
      // data 格式：[{ Year: "115", exist: "Y", TYPE: "公司" }]
      const exists = Array.isArray(data) && data.length > 0 && data[0].exist === 'Y';

      res.json({
        exists,
        type: exists ? data[0].TYPE : null 
      });
    })
    .catch(err => {
      console.error('驗證統編時發生錯誤:', err);
      res.status(500).json({ exists: false, error: '伺服器錯誤' });
    });
};
