export const formatDate = (date: string | Date): string | null => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date

  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
