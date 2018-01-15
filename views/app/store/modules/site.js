import * as types from '../mutation-types'

const state = {
  site: {}
}

const getters = {
  isConfigured: () => (url, collection = state.site.isConfigurated) => {
    return collection
  }
}

const actions = {

}

const mutations = {
  [types.RECEIVE_SITE] (state, { site }) {
    state.site = site
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
