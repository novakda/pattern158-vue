export interface CompensationRow {
  term: string
  value: string
}

export const compensation = {
  heading: 'The Numbers',
  caption: 'Compensation and location details',
  rows: [
    { term: 'Employment', value: 'Full-time preferred' },
    { term: 'Base salary', value: '$140,000 - $250,000' },
    { term: 'Floor', value: '$120,000 (non-negotiable)' },
    { term: 'Contract rate', value: '$60/hour minimum' },
    { term: 'Location', value: 'Remote (preferred) or hybrid Portland metro' },
    { term: 'Timezone', value: 'US Pacific (PT)' },
  ] satisfies CompensationRow[],
}
