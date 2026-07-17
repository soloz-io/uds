import * as React from "react"
import type { UseEvalDashboardFeatureReturn } from "./useEvalDashboardFeature.d"
import { evalDashboardFeatureStateMock } from "./EvalDashboardFeature.mocks"

export function useEvalDashboardFeatureMock(): UseEvalDashboardFeatureReturn {
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(
    evalDashboardFeatureStateMock.inbox.selectedItemId
  )

  const handleSelectItem = React.useCallback((id: string | null) => {
    setSelectedItemId(id)
  }, [])

  return {
    ...evalDashboardFeatureStateMock,
    inbox: {
      ...evalDashboardFeatureStateMock.inbox,
      selectedItemId,
      onSelectItem: handleSelectItem,
    },
  }
}
