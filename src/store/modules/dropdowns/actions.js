import { applications, activeApplications, roles, sessionDuration, refreshTokenLifespan } from '@/api/dropdowns'

export default {
  async applications(_, query = {}) {
    try {
      return await applications(query)
    } catch (e) {
      throw e
    }
  },
  async activeApplications(_, query = {}) {
    try {
      return await activeApplications(query)
    } catch (e) {
      throw e
    }
  },
  async roles(_, query = {}) {
    try {
      return await roles(query)
    } catch (e) {
      throw e
    }
  },
  async sessionDuration(_, query = {}) {
    try {
      return await sessionDuration(query)
    } catch (e) {
      throw e
    }
  },
  async refreshTokenLifespan(_, query = {}) {
    try {
      return await refreshTokenLifespan(query)
    } catch (e) {
      throw e
    }
  }
}
