import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="cursor-pointer bg-gradient-to-tr to-rose-600 from-amber-400 hover:to-amber-400 hover:from-rose-600 transition-all duration-400 text-white px-8 py-3 rounded-md">
        <Link href="/dashboard/dashboard-home">Go Dashboard</Link>
      </div>
    </div>
  );
}
