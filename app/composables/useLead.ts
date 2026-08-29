import type { WebsiteLeadPayload } from '#shared/lead-contract'
import { emptyToNull } from '#shared/lead-contract'

export type LeadSubmitInput = {
  name: string
  phone: string
  message: string
  service: string
  page_url: string
  landing_page?: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  yclid?: string
  company?: string
}

export async function submitLead(input: LeadSubmitInput) {
  const body: WebsiteLeadPayload = {
    name: input.name,
    phone: input.phone,
    message: input.message,
    service: input.service,
    page_url: input.page_url,
    landing_page: input.landing_page || input.page_url,
    referrer: input.referrer || '',
    source: 'website',
    utm_source: emptyToNull(input.utm_source),
    utm_medium: emptyToNull(input.utm_medium),
    utm_campaign: emptyToNull(input.utm_campaign),
    utm_content: emptyToNull(input.utm_content),
    utm_term: emptyToNull(input.utm_term),
    yclid: emptyToNull(input.yclid),
    company: input.company || '',
  }
  return await $fetch<{ success: boolean; lead_id: number | null; forwarded?: boolean }>('/api/leads', {
    method: 'POST',
    body,
  })
}
