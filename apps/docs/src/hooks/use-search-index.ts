"use client";

import { useMemo, useCallback } from "react";
import {
  getAllSearchItems,
  SEARCH_CATEGORY_ORDER,
  type SearchItem,
} from "@/lib/search-data";

export interface GroupedResults {
  category: string;
  items: SearchItem[];
}

function groupByCategory(items: SearchItem[]): GroupedResults[] {
  const map = new Map<string, SearchItem[]>();
  for (const item of items) {
    const arr = map.get(item.category) ?? [];
    arr.push(item);
    map.set(item.category, arr);
  }
  return SEARCH_CATEGORY_ORDER.filter((cat) => map.has(cat)).map((cat) => ({
    category: cat,
    items: map.get(cat)!,
  }));
}

export function useSearchIndex() {
  const allItems = useMemo(() => getAllSearchItems(), []);

  const search = useCallback(
    (query: string): GroupedResults[] => {
      if (!query.trim()) {
        return groupByCategory(allItems);
      }
      const q = query.toLowerCase();
      const matched = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q),
      );
      return groupByCategory(matched);
    },
    [allItems],
  );

  return { search, allItems };
}
