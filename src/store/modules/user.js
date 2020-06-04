import { login, logout, getInfo } from "@/api/user";

import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { asyncRoutes } from '@/router/index'
import { resetRouter } from "@/router";
import store from "..";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    routes: [],
    isInitMenu: false
  };
};

const state = getDefaultState();

const mutations = {
  SET_ROUTES(state, routes) {
    state.routes = routes,
      state.isInitMenu = true
  },
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());

  },
  RESET_LOG_INFO(state) {
    window.localStorage.removeItem('tongxing_menu')
    state.routes = []
    state.isInitMenu = false
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  }
};

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    const { username, password, phone, verificationCode } = userInfo;
    return new Promise((resolve, reject) => {
      login({
        loginName: username.trim(),
        password: password,
        phone: phone,
        verificationCode: verificationCode

      }).then(response => {

        const data = response.data;
        if (data) {
          dispatch('getMenu', data.admin.rights)
          window.localStorage.setItem('tongxing_menu', JSON.stringify(data.admin.rights));
          commit("SET_TOKEN", data.token);
          setToken(data.token);
        }
        resolve(response);
      })
        .catch(error => {
          reject(error);
        });
    });
  },

  getMenu({ commit }, data) {
    return new Promise((resolve, reject) => {
      let routesTree = [];
      let menu = data
      menu.forEach(m => {
        if (m.rightLevel == 1) {
          let routeOne = asyncRoutes.find(item => m.component == item.name);
          if (m.children) {
            routeOne.children = routeOne.children.filter(item => m.children.some(mItem => mItem.component == item.name));
          }
          if (routeOne) {
            routesTree.push(routeOne);
          }
        }
      });
      var last404 = { path: '*', redirect: '/404', hidden: true };
      routesTree.push(last404);
      router.addRoutes(routesTree);
      commit('SET_ROUTES', routesTree)
      resolve()
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;
          if (!data) {
            reject("Verification failed, please Login again.");
          }

          const { name, avatar } = data;

          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token)
  //       .then(() => {
  //         removeToken(); // must remove  token  first
  //         resetRouter();
  //         commit("RESET_STATE");
  //         resolve();
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // },
  logout({ commit, state }) {
    removeToken(); // must remove  token  first
    resetRouter();
    commit("RESET_LOG_INFO")
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
