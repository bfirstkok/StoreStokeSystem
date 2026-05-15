export default function Loading() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-7 w-72 max-w-full animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-gray-100" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-8 w-16 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-3 w-full animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-10 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
