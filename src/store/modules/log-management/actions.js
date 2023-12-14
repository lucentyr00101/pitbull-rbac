import { loginList, activityList } from '@/api/log-management'

export default {
  async loginList(_, payload) {
    try {
      return await loginList(payload)
    } catch (e) {
      throw e
    }
  },
  async activityList(_, payload) {
    try {
      return await activityList(payload)
    } catch (e) {
      throw e
    }
  }
}
