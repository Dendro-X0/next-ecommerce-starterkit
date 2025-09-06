"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { ShippingAddress } from "@/types/cart"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

interface ShippingFormProps {
  onNext: (address: ShippingAddress) => void
  initialData?: Partial<ShippingAddress>
  savedAddresses?: ReadonlyArray<ShippingAddress>
}

/**
 * ShippingForm
 * Checkout step for collecting a shipping address, with support for selecting a saved address.
 */
export function ShippingForm({ onNext, initialData, savedAddresses = [] }: ShippingFormProps) {
  const [mode, setMode] = useState<"saved" | "manual">(
    savedAddresses.length > 0 ? "saved" : "manual",
  )
  const [selectedSavedIndex, setSelectedSavedIndex] = useState<number>(0)

  // Validation schema
  const schema = useMemo(
    () =>
      z.object({
        firstName: z.string().min(2, "First name is required"),
        lastName: z.string().min(2, "Last name is required"),
        email: z.string().email("Enter a valid email"),
        phone: z
          .string()
          .min(7, "Enter a valid phone")
          .refine((v) => /[0-9+()\-\s]{7,}/.test(v), { message: "Enter a valid phone" }),
        address: z.string().min(5, "Address is required"),
        city: z.string().min(2, "City is required"),
        state: z.string().min(2, "State is required"),
        zipCode: z
          .string()
          .min(3, "ZIP/Postal code is required")
          .refine((v) => v.trim().length > 0, { message: "ZIP/Postal code is required" }),
        country: z.string().min(2, "Country is required"),
      }),
    [],
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ShippingAddress>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: initialData?.firstName ?? "",
      lastName: initialData?.lastName ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      address: initialData?.address ?? "",
      city: initialData?.city ?? "",
      state: initialData?.state ?? "",
      zipCode: initialData?.zipCode ?? "",
      country: initialData?.country ?? "United States",
    },
    mode: "onBlur",
  })

  const resolvedAddress: ShippingAddress = useMemo(() => {
    return mode === "saved" && savedAddresses[selectedSavedIndex]
      ? savedAddresses[selectedSavedIndex]
      : (getValues() as ShippingAddress)
  }, [mode, savedAddresses, selectedSavedIndex, getValues])

  const onValid: SubmitHandler<ShippingAddress> = (values) => {
    onNext(values)
  }

  const onSubmit =
    mode === "saved"
      ? (e: React.FormEvent) => {
          e.preventDefault()
          if (savedAddresses[selectedSavedIndex]) {
            onNext(savedAddresses[selectedSavedIndex] as ShippingAddress)
          }
        }
      : handleSubmit(onValid)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <RadioGroup
            value={mode}
            onValueChange={(v: "saved" | "manual") => setMode(v)}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <RadioGroupItem
                id="addr_saved"
                value="saved"
                disabled={savedAddresses.length === 0}
              />
              <Label htmlFor="addr_saved" className="cursor-pointer">
                Use saved address{savedAddresses.length === 0 ? " (none)" : ""}
              </Label>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <RadioGroupItem id="addr_manual" value="manual" />
              <Label htmlFor="addr_manual" className="cursor-pointer">
                Enter new address
              </Label>
            </div>
          </RadioGroup>

          {mode === "saved" && savedAddresses.length > 0 && (
            <div className="space-y-3">
              <Label htmlFor="savedAddress">Select an address</Label>
              <Select
                value={String(selectedSavedIndex)}
                onValueChange={(v) => setSelectedSavedIndex(Number.parseInt(v))}
              >
                <SelectTrigger id="savedAddress" className="w-full">
                  <SelectValue placeholder="Choose saved address" />
                </SelectTrigger>
                <SelectContent>
                  {savedAddresses.map((addr, idx) => (
                    <SelectItem key={`${addr.address}-${idx}`} value={String(idx)}>
                      {addr.firstName} {addr.lastName} — {addr.address}, {addr.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                You can manage saved addresses in your dashboard.
              </div>
              <Separator />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Jane"
                disabled={mode === "saved"}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                disabled={mode === "saved"}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              disabled={mode === "saved"}
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 000-1234"
              disabled={mode === "saved"}
              {...register("phone")}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main St"
              disabled={mode === "saved"}
              {...register("address")}
            />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>

          <div className="flex flex-col md:flex-row gap-2 justify-normal">
            <div className="w-full">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="San Francisco"
                disabled={mode === "saved"}
                {...register("city")}
              />
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>
            <div className="w-full">
              <Label htmlFor="state">State</Label>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger disabled={mode === "saved"} className="w-full">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
            </div>
            <div className="w-full">
              <Label htmlFor="country">Country</Label>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger disabled={mode === "saved"} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && (
                <p className="text-sm text-destructive">{errors.country.message}</p>
              )}
            </div>
            <div className="w-full">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="94107"
                disabled={mode === "saved"}
                {...register("zipCode")}
              />
              {errors.zipCode && (
                <p className="text-sm text-destructive">{errors.zipCode.message}</p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={mode === "manual" && isSubmitting}>
            Continue to Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
