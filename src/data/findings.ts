import type { Finding } from '@/types'
import findingsData from './json/findings.json'

export type { Finding }
export const findings: Finding[] = findingsData as Finding[]
