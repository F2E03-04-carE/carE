export const isSameDay = (dateStr: string, target: Date): boolean => {
  const date = new Date(dateStr);
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  );
};

export const isSameMonth = (dateStr: string, target: Date): boolean => {
  const date = new Date(dateStr);
  return date.getFullYear() === target.getFullYear() && date.getMonth() === target.getMonth();
};
