export const verifyTaxId = (req, res) => {
  const { taxId } = req.query;
  if (!taxId || taxId.length !== 8 || !/^\d+$/.test(taxId)) {
    return res.status(400).json({ exists: false, error: '統編格式錯誤' });
  }

  const url = `https://opendata.vip/data/company?keyword=${taxId}`;

    fetch(url)
    .then(r => {
      if (!r.ok) throw new Error('API 回應錯誤');
      return r.json();
    })
    .then(data => {
      const hasData = data.output && Array.isArray(data.output) && data.output.length > 0;
      
      if (!hasData) {
        return res.json({ 
          exists: false,
          companyName: null,
          status: null
        });
      }

      const company = data.output[0];
      const taxIdFromAPI = company.Business_Accounting_NO;
      const companyName = company.Company_Name;
      const status = company.Company_Status_Desc;
      
      // 只有「核准設立」才算驗證通過
      const isActive = status === '核准設立';
      const isTaxIdMatch = taxIdFromAPI === taxId;
      res.json({
        exists: isActive && isTaxIdMatch,
        companyName: companyName,
        status: status,
        taxId: taxIdFromAPI  
      });
    .catch(err => {
      console.error('驗證統編時發生錯誤:', err);
      res.status(500).json({ 
        exists: false, 
        error: '伺服器錯誤' 
      });
    });
};