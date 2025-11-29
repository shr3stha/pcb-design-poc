import { Design, ValidateDesignResponse, Issue } from '../schema/schema'
import { validateIssues } from '../schema/issueValidation'
import { apiClient } from './client'

/**
 * Design API - typed API calls for design operations.
 * SOLID: Interface Segregation - focused API surface.
 * Includes runtime validation for issue responses.
 */
export const designApi = {
  async getDesign(id: string): Promise<Design> {
    const response = await apiClient.get<Design>(`/designs/${id}`)
    return response.data
  },

  async createDesign(design: Design): Promise<Design> {
    const response = await apiClient.post<Design>('/designs', design)
    return response.data
  },

  async updateDesign(id: string, design: Design): Promise<Design> {
    const response = await apiClient.put<Design>(`/designs/${id}`, design)
    return response.data
  },

  async deleteDesign(id: string): Promise<void> {
    await apiClient.delete(`/designs/${id}`)
  },

  async listDesigns(): Promise<Design[]> {
    const response = await apiClient.get<Design[]>('/designs')
    return response.data
  },

  async validateDesign(id: string): Promise<{ issues: Issue[] }> {
    const response = await apiClient.post<ValidateDesignResponse>(
      `/designs/${id}/validate`
    )
    // Runtime validation ensures we only return valid Issue objects
    const validatedIssues = validateIssues(response.data.issues)
    return { issues: validatedIssues }
  },
}

