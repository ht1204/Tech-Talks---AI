interface BadgeProps {
  stepNumber: number;
  label: string;
  colorClass: string;
}

export default function Badge({ stepNumber, label, colorClass }: BadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`${colorClass} text-white text-xs font-bold px-2.5 py-1 rounded-full min-w-[28px] text-center`}>
        {stepNumber}
      </span>
      <span className="text-sm font-semibold text-white">{label}</span>
    </div>
  );
}
