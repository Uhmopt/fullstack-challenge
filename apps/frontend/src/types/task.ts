export type TaskActionType = 'edit' | 'delete' | 'history'
export type TaskStatusType = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export interface TaskFilterOptionType {
  page?: number
  limit?: number
  sortBy?: string
  status?: TaskStatusType
  searchKeyWord?: string
}
