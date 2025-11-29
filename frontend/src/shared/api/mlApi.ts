import { Design, MLSuggestionsResponse, ExplainErrorRequest, ExplainErrorResponse } from '../schema/schema'
import { apiClient } from './client'

/**
 * ML API - typed API calls for ML-powered features.
 * SOLID: Interface Segregation - focused ML API surface.
 */
export const mlApi = {
  async getSuggestions(design: Design): Promise<MLSuggestionsResponse> {
    const response = await apiClient.post<MLSuggestionsResponse>(
      '/ml/suggestions',
      design
    )
    return response.data
  },

  async explainError(error: string, context: Record<string, any>): Promise<ExplainErrorResponse> {
    const response = await apiClient.post<ExplainErrorResponse>(
      '/ml/explain-error',
      { error, context } as ExplainErrorRequest
    )
    return response.data
  },

  async suggestNextAction(design: Design): Promise<any> {
    const response = await apiClient.post('/ml/next-action', design)
    return response.data
  },
}

