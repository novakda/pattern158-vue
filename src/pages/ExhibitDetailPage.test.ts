import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock vue-router before importing the component
const mockReplace = vi.fn()
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({ replace: mockReplace })),
}))

// Mock @unhead/vue useHead to be a no-op in tests
vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
}))

import { useRoute } from 'vue-router'
import ExhibitDetailPage from './ExhibitDetailPage.vue'

describe('ExhibitDetailPage', () => {
  beforeEach(() => {
    mockReplace.mockClear()
  })

  it('renders exhibit title for known slug', async () => {
    vi.mocked(useRoute).mockReturnValue({
      params: { slug: 'exhibit-a' },
    } as any)

    const wrapper = mount(ExhibitDetailPage, {
      global: { stubs: { RouterLink: true, TechTags: true } },
    })

    expect(wrapper.text()).toContain('Cross-Domain SCORM Resolution')
  })

  it('renders exhibit label for known slug', () => {
    vi.mocked(useRoute).mockReturnValue({
      params: { slug: 'exhibit-a' },
    } as any)

    const wrapper = mount(ExhibitDetailPage, {
      global: { stubs: { RouterLink: true, TechTags: true } },
    })

    expect(wrapper.text()).toContain('Exhibit A')
  })

  it('renders a Back to Portfolio link', () => {
    vi.mocked(useRoute).mockReturnValue({
      params: { slug: 'exhibit-a' },
    } as any)

    const wrapper = mount(ExhibitDetailPage, {
      global: { stubs: { RouterLink: true, TechTags: true } },
    })

    // RouterLink is stubbed — look for the to="/portfolio" prop
    const links = wrapper.findAllComponents({ name: 'RouterLink' })
    const portfolioLink = links.find(l => l.props('to') === '/portfolio')
    expect(portfolioLink).toBeDefined()
  })

  it('calls router.replace with not-found for unknown slug', () => {
    vi.mocked(useRoute).mockReturnValue({
      params: { slug: 'does-not-exist' },
    } as any)

    mount(ExhibitDetailPage, {
      global: { stubs: { RouterLink: true, TechTags: true } },
    })

    expect(mockReplace).toHaveBeenCalledWith({ name: 'not-found' })
  })
})
