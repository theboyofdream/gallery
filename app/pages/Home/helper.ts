export function getNameByPath(path: string) {
  return path.split('/').pop() ?? ''
}

export function getParentPath(path: string) {
  let tmp = path.split('/')
  tmp.pop()
  return tmp.join('/')
}

export function isHidden(path: string) {
  let name = path.split('/').pop() ?? ''
  return name.startsWith('.')
}