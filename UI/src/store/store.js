import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({

  state: {
    title: "Figma Plugin Vue Sample"
  },

  mutations: {
    title: (state, value) => {
      state.title = value
    }
  },

  actions: {},

  getters: {
    title: state => {
      return state.title
    }
  },

});