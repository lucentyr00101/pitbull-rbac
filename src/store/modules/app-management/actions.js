import {
  list,
  add,
  update,
  all
} from '@/api/app-management'

export default {
  async all (_, query = {}) {
    try {
      return await all(query)
    } catch (e) {
      throw e
    }
  },
  async list (_, query = {}) {
    try {
      return await list(query)
    } catch (e) {
      throw e
    }
  },
  async add (_, query = {}) {
    try {
      return await add(query)
    } catch (e) {
      throw e
    }
  },
  async update (_, query = {}) {
    try {
      return await update(query)
    } catch (e) {
      throw e
    }
  }
}
