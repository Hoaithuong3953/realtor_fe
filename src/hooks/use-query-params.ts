import { useState, useEffect } from "react"

export interface QueryParamsOptions {
  defaultSort?: string
  defaultLimit?: number
}

export function useQueryParams(options: QueryParamsOptions = {}) {
  const { defaultSort = "updated_at_desc", defaultLimit = 20 } = options

  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [sortValue, setSortValue] = useState(defaultSort)
  const [filters, setFilters] = useState<Record<string, unknown>>({})

  // Handle debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to first page on search
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  // Split sort_by and sort_order from "field_name_desc" format
  const [sortBy, sortOrder] = sortValue.split("_").reduce((acc, curr, i, arr) => {
    if (i === arr.length - 1) return [acc[0], curr]
    return [acc[0] ? `${acc[0]}_${curr}` : curr, acc[1]]
  }, ["", ""])

  const apiParams = {
    keyword: debouncedSearch || undefined,
    offset: (page - 1) * defaultLimit,
    limit: defaultLimit,
    sort_by: sortBy,
    sort_order: sortOrder,
    ...filters
  }

  return {
    apiParams,
    search,
    setSearch,
    debouncedSearch,
    page,
    setPage,
    sortValue,
    setSortValue,
    filters,
    setFilters
  }
}
