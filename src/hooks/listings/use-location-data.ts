import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { type ListingFormValues } from "@/schemas/listing.schema"

export interface LocationUnit {
  code: string | number
  name: string
  [key: string]: unknown
}

const HCMC_CODE = "79"

const fetchProvinces = async (): Promise<LocationUnit[]> => {
  const res = await fetch(`https://provinces.open-api.vn/api/p/`)
  if (!res.ok) throw new Error("Failed to fetch provinces")
  const data = await res.json() as LocationUnit[]
  return data || []
}

const fetchDistricts = async (provinceCode: string): Promise<LocationUnit[]> => {
  const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
  if (!res.ok) throw new Error("Failed to fetch districts")
  const data = await res.json() as { districts?: LocationUnit[] }
  return data.districts || []
}

const fetchWards = async (districtCode: string): Promise<LocationUnit[]> => {
  const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
  if (!res.ok) throw new Error("Failed to fetch wards")
  const data = await res.json() as { wards?: LocationUnit[] }
  return data.wards || []
}

export function useLocationData() {
  const { watch, setValue, getValues } = useFormContext<ListingFormValues>()

  const { data: provinces = [], isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
    staleTime: Infinity,
  })

  const provinceCode = watch("location_json.province_code") as string | undefined
  const districtCode = watch("location_json.district_code") as string | undefined

  useEffect(() => {
    if (!provinceCode && provinces.length > 0) {
      const p = provinces.find(x => String(x.code) === HCMC_CODE) || provinces[0]
      if (p) {
        setValue("location_json.province_code", String(p.code))
        const loc = (getValues("location_json") || {}) as Record<string, string | undefined>
        const parts = [loc.detail, p.name].filter(Boolean)
        setValue("address_text", parts.join(", "), { shouldValidate: true })
      }
    }
  }, [provinceCode, provinces, setValue, getValues])
  
  const { data: districts = [], isLoading: isLoadingDistricts } = useQuery({
    queryKey: ["districts", provinceCode],
    queryFn: () => fetchDistricts(provinceCode!),
    enabled: !!provinceCode,
    staleTime: Infinity,
  })

  const { data: wards = [], isLoading: isLoadingWards } = useQuery({
    queryKey: ["wards", districtCode],
    queryFn: () => fetchWards(districtCode!),
    enabled: !!districtCode,
    staleTime: Infinity,
  })

  const updateAddressText = (pName?: string, dName?: string, wName?: string, detail?: string) => {
    const loc = (getValues("location_json") || {}) as Record<string, string | undefined>
    const finalP = pName !== undefined ? pName : (provinces.find(p => p.code.toString() === loc.province_code)?.name || "")
    const finalD = dName !== undefined ? dName : (districts.find(d => d.code.toString() === loc.district_code)?.name || "")
    const finalW = wName !== undefined ? wName : (wards.find(w => w.code.toString() === loc.ward_code)?.name || "")
    const finalDetail = detail !== undefined ? detail : loc.detail
    const parts = [finalDetail, finalW, finalD, finalP].filter(Boolean)
    setValue("address_text", parts.join(", "), { shouldValidate: true })
  }

  const handleProvinceChange = (val: string) => {
    const p = provinces.find(x => x.code.toString() === val)
    setValue("location_json.province_code", val)
    setValue("location_json.district_code", "")
    setValue("location_json.ward_code", "")
    updateAddressText(p?.name, "", "", undefined)
  }

  const handleDistrictChange = (val: string) => {
    const d = districts.find(x => x.code.toString() === val)
    setValue("location_json.district_code", val)
    setValue("location_json.ward_code", "")
    updateAddressText(undefined, d?.name, "", undefined)
  }

  const handleWardChange = (val: string) => {
    const w = wards.find(x => x.code.toString() === val)
    setValue("location_json.ward_code", val)
    updateAddressText(undefined, undefined, w?.name, undefined)
  }

  const handleDetailChange = (val: string) => {
    updateAddressText(undefined, undefined, undefined, val)
  }

  return {
    provinces,
    districts,
    wards,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleDetailChange
  }
}
