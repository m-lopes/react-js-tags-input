export function tagAlreadyExists(tags: string[], newTag: string) {
  if (tags.find(tag => tag === newTag)) {
    return true
  }

  return false
}
