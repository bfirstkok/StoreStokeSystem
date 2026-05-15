import Image from "next/image";

interface DashboardStatProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

export default function DashboardStat({ title, value, icon, color = "text-gray-600" }: DashboardStatProps) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-start gap-3 px-3 py-2 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
         <Image src={icon} width={30} height={30} alt={title} />
      </div>
      <div className="flex min-w-0 flex-col items-center gap-1">
        <p className={`max-w-full break-words text-lg font-bold leading-6 ${color}`}>{value}</p>
        <h3 className="text-wrap text-sm font-medium leading-5 text-gray-500">{title}</h3>
      </div>
    </div>
  );
}
