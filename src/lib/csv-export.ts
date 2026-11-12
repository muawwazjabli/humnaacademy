export function exportRecordsToCSV(
  filename: string,
  headers: { key: string; label: string }[],
  rows: Record<string, any>[]
) {
  const escapeCell = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = Array.isArray(val) ? val.join("; ") : String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headerLine = headers.map((h) => escapeCell(h.label)).join(",");
  const dataLines = rows.map((row) =>
    headers.map((h) => escapeCell(row[h.key])).join(",")
  );

  const csvContent = "\uFEFF" + [headerLine, ...dataLines].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
