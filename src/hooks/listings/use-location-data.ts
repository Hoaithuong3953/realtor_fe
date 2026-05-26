import { useFormContext } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { type ListingFormValues } from "@/schemas/listing.schema"

export interface LocationUnit {
  code: string | number
  name: string
  [key: string]: unknown
}

const fetchProvinces = async (): Promise<LocationUnit[]> => {
  const res = await fetch("https://provinces.open-api.vn/api/p/")
  if (!res.ok) throw new Error("Failed to fetch provinces")
  return (await res.json()) as LocationUnit[]
}

const fetchWards = async (provinceCode: string): Promise<LocationUnit[]> => {
  const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=3`)
  if (!res.ok) throw new Error("Failed to fetch wards")
  const data = await res.json() as { districts?: { wards?: LocationUnit[] }[] }
  return (data.districts || []).flatMap(d => d.wards || [])
}

export function useLocationData() {
  const { watch, setValue, getValues } = useFormContext<ListingFormValues>()

  const { data: provinces = [], isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
    staleTime: Infinity,
  })

  const provinceCode = watch("location_json.province_code") as string | undefined
  
  const { data: wards = [], isLoading: isLoadingWards } = useQuery({
    queryKey: ["wards", provinceCode],
    queryFn: () => fetchWards(provinceCode!),
    enabled: !!provinceCode,
    staleTime: Infinity,
  })

  const updateAddressText = (pName?: string, wName?: string, detail?: string) => {
    const loc = (getValues("location_json") || {}) as Record<string, string | undefined>
    const finalP = pName !== undefined ? pName : loc.province_name
    const finalW = wName !== undefined ? wName : loc.ward_name
    const finalD = detail !== undefined ? detail : loc.detail
    const parts = [finalD, finalW, finalP].filter(Boolean)
    setValue("address_text", parts.join(", "), { shouldValidate: true })
  }

  const handleProvinceChange = (val: string) => {
    const p = provinces.find(x => x.code.toString() === val)
    setValue("location_json.province_code", val)
    setValue("location_json.province_name", p?.name)
    setValue("location_json.ward_code", "")
    setValue("location_json.ward_name", "")
    updateAddressText(p?.name, "", undefined)
  }

  const handleWardChange = (val: string) => {
    const w = wards.find(x => x.code.toString() === val)
    setValue("location_json.ward_code", val)
    setValue("location_json.ward_name", w?.name)
    updateAddressText(undefined, w?.name, undefined)
  }

  const handleDetailChange = (val: string) => {
    updateAddressText(undefined, undefined, val)
  }

  return {
    provinces,
    wards,
    isLoadingProvinces,
    isLoadingWards,
    handleProvinceChange,
    handleWardChange,
    handleDetailChange
  }
}
