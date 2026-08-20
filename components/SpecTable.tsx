type SpecTableProps = {
  specs: Array<[string, string]>;
};

export function SpecTable({ specs }: SpecTableProps) {
  return (
    <div className="max-w-2xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_8px_24px_rgba(18,38,58,0.05)]">
      <table className="w-full table-fixed border-collapse text-left text-[13px]">
        <tbody>
          {specs.map(([label, value], index) => (
            <tr key={label} className={`${index % 2 === 0 ? "bg-white" : "bg-[#f8fafb]"} border-b border-slate-200/70 transition-colors last:border-0 hover:bg-[#eef9fb]`}>
              <th className="w-[38%] border-r border-slate-200/70 bg-[#f1f6f8] px-3 py-2 text-left align-middle text-[12px] font-extrabold leading-[1.4] text-[#234056] sm:w-[35%] sm:px-4">
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
