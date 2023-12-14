const extractPermissions = roles => {
  return roles.map(role => role.sysResourceResponse).flat()
}

const recursive = arr => {
  return arr.reduce((prev, curr) => {
    if (curr.children?.length > 0) {
      const data = recursive(curr.children)
      prev.push(data.flat())
    } else if (curr.resourceType.toLowerCase() === 'action' && curr.status === 'Enable') {
      const obj = {
        label: curr.title,
        accessCode: curr.buttonAccessCode.replaceAll('.', '-')
      }
      prev.push(obj)
    }
    return prev
  }, [])
}

const generatePermissions = roles => {
  const resources = extractPermissions(roles)
  return recursive(resources).flat()
}

export default generatePermissions
