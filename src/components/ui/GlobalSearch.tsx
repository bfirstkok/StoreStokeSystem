"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SearchIcon } from "@/components/icons";
import { globalSearch, SearchResult } from "@/lib/actions/search";
import { getTypeLabel } from "@/lib/utils/formatters";

function GlobalSearchContent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setQuery(searchParam);
    }
  }, [searchParams]);

  const handleSearch = useDebouncedCallback(async (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
      params.set("page", "1");
    } else {
      params.delete("search");
      params.delete("page");
    }
    router.replace(`${pathname}?${params.toString()}`);

    if (!term || term.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    try {
      const data = await globalSearch(term);
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    handleSearch(val);

    if (val.length === 0) {
      setIsOpen(false);
      setResults([]);
      setIsLoading(false);
    } else if (val.length >= 2) {
      setIsLoading(true);
    }
  };

  const handleSelect = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setQuery("");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <input
          type="search"
          placeholder="ค้นหาวัสดุ อุปกรณ์ ผู้จำหน่าย หรือเลขใบสั่งซื้อ"
          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
          value={query}
          onChange={onInputChange}
          onFocus={() => {
            if (query.length >= 2) setIsOpen(true);
          }}
        />
        <div className="pointer-events-none absolute left-3 top-0 flex h-full items-center">
          {isLoading ? (
            <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
          ) : (
            <SearchIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-[9999] mt-2 max-h-96 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
          {isLoading && results.length === 0 && (
            <div className="p-5 text-center text-sm text-gray-500">
              กำลังค้นหา...
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="py-2">
              {results.map((result, index) => (
                <li key={`${result.type}-${result.id}-${index}`}>
                  <button
                    type="button"
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-blue-50"
                    onClick={() => handleSelect(result)}
                  >
                    <span className="block truncate text-sm font-semibold text-gray-900">
                      {result.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-medium text-gray-500">
                      {getTypeLabel(result.type)} • {result.subtitle}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && results.length === 0 && (
            <div className="p-5 text-center text-sm text-gray-500">
              ไม่พบผลลัพธ์สำหรับ &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GlobalSearch() {
  return (
    <Suspense fallback={null}>
      <GlobalSearchContent />
    </Suspense>
  );
}
