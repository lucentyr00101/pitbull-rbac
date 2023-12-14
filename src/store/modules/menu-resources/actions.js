import {
  addDirectory,
  addMenu,
  fetchMenuTree,
  addSubmenu,
  addAction,
  updateDirectory,
  updateMenu,
  updateSubmenu,
  updateAction,
  deleteResource,
  fetchMenuTreeActive
} from '@/api/menu-resources'

export default {
  async deleteResource (_, payload) {
    try {
      return await deleteResource(payload)
    } catch (e) {
      throw e
    }
  },
  async updateDirectory (_, payload) {
    try {
      return await updateDirectory(payload)
    } catch (e) {
      throw e
    }
  },
  async updateMenu (_, payload) {
    try {
      return await updateMenu(payload)
    } catch (e) {
      throw e
    }
  },
  async updateSubmenu (_, payload) {
    try {
      return await updateSubmenu(payload)
    } catch (e) {
      throw e
    }
  },
  async updateAction (_, payload) {
    try {
      return await updateAction(payload)
    } catch (e) {
      throw e
    }
  },
  async addAction (_, payload) {
    try {
      return await addAction(payload)
    } catch (e) {
      throw e
    }
  },
  async addDirectory (_, payload) {
    try {
      return await addDirectory(payload)
    } catch (e) {
      throw e
    }
  },
  async addMenu (_, payload) {
    try {
      return await addMenu(payload)
    } catch (e) {
      throw e
    }
  },
  async addSubmenu (_, payload) {
    try {
      return await addSubmenu(payload)
    } catch (e) {
      throw e
    }
  },
  async fetchMenuTree (_, query = {}) {
    try {
      return await fetchMenuTree(query)
    } catch (e) {
      throw e
    }
  },
  async fetchMenuTreeActive (_, query = {}) {
    try {
      return await fetchMenuTreeActive(query)
    } catch (e) {
      throw e
    }
  }
}
