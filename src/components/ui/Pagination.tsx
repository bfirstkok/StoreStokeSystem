"use client";

export const PAGE_SIZE = 10;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-4 text-sm sm:flex-row">
      <span className="text-gray-500">
        หน้า <span className="font-semibold text-gray-900">{currentPage}</span> จาก{" "}
        <span className="font-semibold text-gray-900">{safeTotalPages}</span>
      </span>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="min-h-10 flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none"
        >
          ก่อนหน้า
        </button>
        <button
          type="button"
          disabled={currentPage >= safeTotalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="min-h-10 flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:flex-none"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}
