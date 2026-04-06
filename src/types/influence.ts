export interface InfluenceLink {
  text: string
  to: string
}

export interface InfluenceSegment {
  text: string
  link?: InfluenceLink
}

export interface Influence {
  term: string
  segments: InfluenceSegment[]
}
