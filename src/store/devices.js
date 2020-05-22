const state = {
  items:[],
  itemDetail:{},
  itemDetailVisible:false,
  count:1
}

const getters = {

}

const actions = {
  fetchData ({commit}, vue){
    vue.$axios
    .post('/device/list',{size:1000})
    .then(response => {
      commit('setDeviceList', response.data.data.data)
    })
  },
  fetchItemDetail ({commit}, vue) {

  },
  toggleItemDetailVisible({commit, state}) {
    commit('setItemDetailVisible', true)
  }
}

const mutations = {
  setDeviceList (state, items) {
    state.items = items;
  },
  setItemDetailVisible(state, visible) {
    state.itemDetailVisible = visible;
  }  
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
