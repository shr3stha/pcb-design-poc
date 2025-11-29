import { create } from 'zustand'
import { Design } from '../schema/schema'
import { designApi } from '../api/designApi'

/**
 * Design state store (Zustand).
 * SOLID: Single Responsibility - manages design state only.
 */
interface DesignState {
  currentDesign: Design | null
  designs: Design[]
  loadDesign: (id: string) => Promise<void>
  createNewDesign: (templateId?: string) => Promise<void>
  updateDesign: (design: Design) => Promise<void>
  validateDesign: (id: string) => Promise<void>
}

export const useDesignStore = create<DesignState>((set, get) => ({
  currentDesign: null,
  designs: [],

  loadDesign: async (id: string) => {
    const design = await designApi.getDesign(id)
    set({ currentDesign: design })
  },

  createNewDesign: async (templateId?: string) => {
    const newDesign: Design = {
      id: `design_${Date.now()}`,
      name: templateId ? `Project: ${templateId}` : 'New Design',
      board: {
        outline: [],
        components: [],
        nets: [],
        layers: 1,
      },
      issues: [],
    }

    // Load template if specified
    if (templateId) {
      // TODO: Load template data
    }

    await designApi.createDesign(newDesign)
    set({ currentDesign: newDesign })
  },

  updateDesign: async (design: Design) => {
    await designApi.updateDesign(design.id, design)
    set({ currentDesign: design })
  },

  validateDesign: async (id: string) => {
    const response = await designApi.validateDesign(id)
    const current = get().currentDesign
    if (current && current.id === id) {
      set({
        currentDesign: {
          ...current,
          issues: response.issues,
        },
      })
    }
  },
}))

