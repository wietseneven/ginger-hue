import * as types from '../mutation-types'

const state = {
  pages: []
}

const getters = {
  getAllPages: () => (url, collection = state.pages) => {
    const results = [];
    for (let i = 0; i < collection.length; i += 1) {
      if (collection[i].uid !== 'error' && collection[i].uid !== 'home') results.push(collection[i]);
    }
    return results
  },
  getFileByURL: (state, getters) => (url, collection = state.pages) => {
    let i = collection.length
    while (i--) {
      let j = collection[i].files.length
      while (j--) {
        if (collection[i].files[j].url === url) {
          return collection[i].files[j]
        }
      }

      let targetFile = getters.getFileByURL(url, collection[i].children)
      if (targetFile) {
        return targetFile
      }
    }
  },
  getPagesByType: (state, getters) => (type, collection = state.pages) => {
    let results = []

    if (!collection || !collection.length) {
      return results
    }

    for (let i = 0; i < collection.length; i++) {
      if (collection[i].type === type) {
        results.push(collection[i])
      }

      let targetPages = getters.getPagesByType(type, collection[i].children)
      results = results.concat(targetPages)
    }

    return results
  },
  getPageByUID: (state, getters) => (uid, collection = state.pages) => {
    let i = collection.length
    while (i--) {
      if (collection[i].uid === uid) {
        return collection[i]
      }

      let targetPage = getters.getPageByUID(uid, collection[i].children)
      if (targetPage) {
        return targetPage
      }
    }
  }
}

const actions = {

}

const mutations = {
  [types.RECEIVE_PAGES] (state, { pages }) {
    state.pages = pages
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
