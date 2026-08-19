type SpecTableProps = {
  specs: Array<[string, string]>;
};

export function SpecTable({ specs }: SpecTableProps) {
  return (
    <div className="max-w-2xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <table className="w-full table-fixed border-collapse text-left text-[13px]">
        <tbody>
          {specs.map(([label, value], index) => (
            <tr key={label} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"} border-b border-slate-200/70 transition-colors last:border-0 hover:bg-blue-50/40`}>
              <th className="w-[38%] border-r border-slate-200/70 bg-slate-50/80 px-3 py-2 text-left align-middle text-[12px] font-extrabold leading-[1.4] text-slate-800 sm:w-[35%] sm:px-4">
                {label}
              </th>
              <td className="break-words px-3 py-2 align-middle text-[13px] leading-[1.45] text-slate-600 sm:px-4">
                {value.replaceAll("<=", "≤").replaceAll(">=", "≥")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
