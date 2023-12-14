import { list, revoke } from '@/api/user-stats'

export default {
  async list(_, payload) {
    try {
      return await list(payload)
    } catch (e) {
      throw e
    }
  },
  async revoke(_, payload) {
    try {
      return await revoke(payload)
    } catch (e) {
      throw e
    }
  }
}
