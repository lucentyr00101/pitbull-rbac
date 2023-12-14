import { fetchList, add, update, updatePermission, fetchPermissions } from '@/api/role-management'

export default {
  async fetchList(_, query = {}) {
    try {
      return await fetchList(query)
    } catch (e) {
      throw e
    }
  },
  async add(_, query = {}) {
    try {
      return await add(query)
    } catch (e) {
      throw e
    }
  },
  async update(_, query = {}) {
    try {
      return await update(query)
    } catch (e) {
      throw e
    }
  },
  async updatePermission(_, query = {}) {
    try {
      return await updatePermission(query)
    } catch (e) {
      throw e
    }
  },
  async fetchPermissions(_, query = {}) {
    try {
      return await fetchPermissions(query)
    } catch (e) {
      throw e
    }
  }
}
