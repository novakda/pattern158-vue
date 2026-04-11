import { describe, it, expect } from 'vitest'
import { escapeCodeBlockContent } from './code-block.js'

describe('escapeCodeBlockContent', () => {
  it('returns empty content with default triple-backtick fence', () => {
    const result = escapeCodeBlockContent('')
    expect(result.content).toBe('')
    expect(result.fence).toBe('```')
  })

  it('returns simple content with default triple-backtick fence', () => {
    const result = escapeCodeBlockContent('const x = 1')
    expect(result.content).toBe('const x = 1')
    expect(result.fence).toBe('```')
  })

  it('escalates to 4-backtick fence when content has triple-backticks', () => {
    const result = escapeCodeBlockContent('text with ``` inside')
    expect(result.content).toBe('text with ``` inside')
    expect(result.fence).toBe('````')
  })

  it('escalates to 5-backtick fence when content has 4 backticks', () => {
    const result = escapeCodeBlockContent('a ``` b ```` c')
    expect(result.content).toBe('a ``` b ```` c')
    expect(result.fence).toBe('`````')
  })

  it('does NOT escalate for single backtick', () => {
    const result = escapeCodeBlockContent('only ` backticks')
    expect(result.fence).toBe('```')
  })

  it('does NOT escalate for double backticks', () => {
    const result = escapeCodeBlockContent('double `` backticks')
    expect(result.fence).toBe('```')
  })

  it('NEVER modifies content — preserves markdown syntax verbatim', () => {
    const input = 'a*b_c[d](e)#f!g|h~i<j>k`'
    const result = escapeCodeBlockContent(input)
    expect(result.content).toBe(input)
  })

  it('preserves newlines in content verbatim', () => {
    const input = 'line1\nline2\nline3'
    const result = escapeCodeBlockContent(input)
    expect(result.content).toBe(input)
  })
})
