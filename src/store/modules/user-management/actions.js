import { fetchList, add, update, reset, remove } from '@/api/user-management'

export default {
  async list(_, query = {}) {
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
  async reset(_, query = {}) {
    try {
      return await reset(query)
    } catch (e) {
      throw e
    }
  },
  async remove(_, query = {}) {
    try {
      return await remove(query)
    } catch (e) {
      throw e
    }
  }
}
