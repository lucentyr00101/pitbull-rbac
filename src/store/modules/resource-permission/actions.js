import { fetchList, updatePermission, updateBatchConfiguration } from '@/api/resource-permission'

export default {
  async fetchList(_, query = {}) {
    try {
      return await fetchList(query)
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
  async updateBatchConfiguration(_, query = {}) {
    try {
      return await updateBatchConfiguration(query)
    } catch (e) {
      throw e
    }
  }
}
