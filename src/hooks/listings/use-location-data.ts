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

const fetchProvinces = (): Promise<LocationUnit[]> => {
  return Promise.resolve([{ code: HCMC_CODE, name: "Thành phố Hồ Chí Minh" }])
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
      const p = provinces[0]
      setValue("location_json.province_code", String(p.code))
      setValue("location_json.province_name", p.name)
      // also update address text
      const loc = (getValues("location_json") || {}) as Record<string, string | undefined>
      const parts = [loc.detail, loc.ward_name, loc.district_name, p.name].filter(Boolean)
      setValue("address_text", parts.join(", "), { shouldValidate: true })
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
    const finalP = pName !== undefined ? pName : loc.province_name
    const finalD = dName !== undefined ? dName : loc.district_name
    const finalW = wName !== undefined ? wName : loc.ward_name
    const finalDetail = detail !== undefined ? detail : loc.detail
    const parts = [finalDetail, finalW, finalD, finalP].filter(Boolean)
    setValue("address_text", parts.join(", "), { shouldValidate: true })
  }

  const handleProvinceChange = (val: string) => {
    const p = provinces.find(x => x.code.toString() === val)
    setValue("location_json.province_code", val)
    setValue("location_json.province_name", p?.name)
    setValue("location_json.district_code", "")
    setValue("location_json.district_name", "")
    setValue("location_json.ward_code", "")
    setValue("location_json.ward_name", "")
    updateAddressText(p?.name, "", "", undefined)
  }

  const handleDistrictChange = (val: string) => {
    const d = districts.find(x => x.code.toString() === val)
    setValue("location_json.district_code", val)
    setValue("location_json.district_name", d?.name)
    setValue("location_json.ward_code", "")
    setValue("location_json.ward_name", "")
    updateAddressText(undefined, d?.name, "", undefined)
  }

  const handleWardChange = (val: string) => {
    const w = wards.find(x => x.code.toString() === val)
    setValue("location_json.ward_code", val)
    setValue("location_json.ward_name", w?.name)
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
