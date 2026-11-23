export const uiPort = 5800

// Shared volumes are mounted by their stable grant id, outside the package's own volumes.
export const sharedPath = (id: string) => `/shared/${id}`
