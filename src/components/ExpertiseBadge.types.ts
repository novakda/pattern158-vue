export const expertiseLevels = ['deep', 'working', 'aware'] as const
export type ExpertiseLevel = (typeof expertiseLevels)[number]
