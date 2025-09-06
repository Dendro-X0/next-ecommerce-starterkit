"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import type { FilterOptions } from "@/types"
import { useEffect, useState } from "react"
import type { JSX } from "react"

type CategoryItem = Readonly<{
  id: string
  slug: string
  name: string
  imageUrl?: string
  productCount: number
}>

interface ProductFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}

/**
 * ProductFilters component for category, type, availability and price filtering.
 * @param props.filters Initial filter state.
 * @param props.onFiltersChange Callback invoked whenever filters change.
 * @returns JSX.Element sidebar filtering UI.
 */
export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps): JSX.Element {
  const [localFilters, setLocalFilters] = useState(filters)
  const [categories, setCategories] = useState<readonly CategoryItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    let mounted = true
    const load = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(undefined)
        const res = await fetch("/api/v1/categories", { credentials: "include" })
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`)
        const data: { items: CategoryItem[] } = await res.json()
        if (mounted) setCategories(data.items ?? [])
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load categories")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const newCategories = checked
      ? [...localFilters.categories, categorySlug]
      : localFilters.categories.filter((c) => c !== categorySlug)

    const newFilters = { ...localFilters, categories: newCategories }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePriceRangeChange = (value: number[]) => {
    const newFilters = { ...localFilters, priceRange: [value[0], value[1]] as [number, number] }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleInStockChange = (checked: boolean) => {
    const newFilters = { ...localFilters, inStock: checked ? true : undefined }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleKindChange = (value: "all" | "digital" | "physical"): void => {
    const newFilters: FilterOptions = { ...localFilters, kind: value === "all" ? undefined : value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      categories: [],
      priceRange: [0, 500],
      inStock: undefined,
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full sm:w-auto">
          Clear All
        </Button>
      </div>

      <Separator />

      {/* Type */}
      <div className="space-y-3">
        <h4 className="font-medium">Type</h4>
        <RadioGroup
          value={(localFilters.kind ?? "all") as string}
          onValueChange={(v) => handleKindChange(v as "all" | "digital" | "physical")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="type-all" value="all" />
            <Label htmlFor="type-all" className="text-sm">
              All
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="type-digital" value="digital" />
            <Label htmlFor="type-digital" className="text-sm">
              Download
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem id="type-physical" value="physical" />
            <Label htmlFor="type-physical" className="text-sm">
              Shipping
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium">Categories</h4>
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-auto pr-1">
            {loading && categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.slug}
                    checked={localFilters.categories.includes(category.slug)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.slug, checked as boolean)
                    }
                  />
                  <Label htmlFor={category.slug} className="text-sm">
                    {category.name} ({category.productCount})
                  </Label>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium">Price Range</h4>
        <div className="px-2">
          <Slider
            value={localFilters.priceRange}
            onValueChange={handlePriceRangeChange}
            max={500}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${localFilters.priceRange[0]}</span>
            <span>${localFilters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div className="space-y-3">
        <h4 className="font-medium">Availability</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={localFilters.inStock === true}
            onCheckedChange={handleInStockChange}
          />
          <Label htmlFor="in-stock" className="text-sm">
            In Stock Only
          </Label>
        </div>
      </div>
    </div>
  )
}
