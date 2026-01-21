export const verifyTaxId = async (req, res) => {
  const { taxId } = req.query;

  if (!taxId || taxId.length !== 8 || !/^\d+$/.test(taxId)) {
    return res.status(400).json({ exists: false, error: '統編格式錯誤' });
  }

  const url = `https://opendata.vip/data/company?keyword=${taxId}`;

  try {
    const r = await fetch(url);
    const text = await r.text(); // 先拿原始字串

    // 🔍 Debug 用
    console.log('第三方 API raw response 前200字:', text.slice(0, 200));

    let data;
    try {
      data = JSON.parse(text); // 嘗試 parse
    } catch (e) {
      console.error('不是 JSON，實際內容是 HTML 或錯誤頁');
      return res.status(502).json({
        exists: false,
        error: '第三方 API 回傳非 JSON',
        fallback: true
      });
    }

    const hasData = data.output && Array.isArray(data.output) && data.output.length > 0;

    if (!hasData) {
      return res.json({
        exists: false,
        companyName: null,
        status: null,
        source: 'third-party'
      });
    }

    const company = data.output[0];
    const taxIdFromAPI = company.Business_Accounting_NO;
    const companyName = company.Company_Name;
    const status = company.Company_Status_Desc;

    const isActive = status === '核准設立';
    const isTaxIdMatch = taxIdFromAPI === taxId;

    return res.json({
      exists: isActive && isTaxIdMatch,
      companyName,
      status,
      taxId: taxIdFromAPI,
      source: 'third-party'
    });

  } catch (err) {
    console.error('驗證統編時發生錯誤:', err);

    return res.status(500).json({
      exists: false,
      error: '第三方 API 失敗',
      fallback: true
    });
  }
};
