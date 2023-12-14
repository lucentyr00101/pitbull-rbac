import {
  list,
  update
} from '@/api/timezone'

export default {
  async list(_, params) {
    try {
      return await list(params)
    } catch (e) {
      throw e
    }
  },
  async update(_, params) {
    try {
      const { data } = await update(params)
      console.log(data)
    } catch (e) {
      throw e
    }
  }
}
