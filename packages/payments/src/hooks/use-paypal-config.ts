/**
 * usePaypalConfig
 * Fetches PayPal configuration state from the server.
 */
import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { paymentsPaypalApi, type PaypalConfig } from "../client/paypal"

export function usePaypalConfig(): UseQueryResult<PaypalConfig, Error> {
  return useQuery<PaypalConfig, Error>({
    queryKey: ["payments", "paypal", "config"] as const,
    queryFn: async (): Promise<PaypalConfig> => paymentsPaypalApi.config(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
