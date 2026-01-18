// 取得狀態顯示文字
export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'VerifiedFree': return '已驗證 (免費)';
    case 'VerifiedPaid': return '已驗證 (付費)';
    case 'Pending': return '審核中';
    case 'Suspended': return '已停權';
    case 'Expired': return '已過期';
    case 'Active': return '正常';
    default: return status;
  }
};

// 取得狀態對應的 CSS 樣式類別
export const getStatusClass = (status: string) => {
  switch (status) {
    case 'VerifiedFree': return 'bg-blue-100 text-blue-800';
    case 'VerifiedPaid': return 'bg-yellow-100 text-yellow-800';
    case 'Pending': return 'bg-gray-100 text-gray-800';
    case 'Suspended': return 'bg-red-100 text-red-800';
    case 'Expired': return 'bg-orange-100 text-orange-800';
    case 'Active': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
