import { login, logout, getInfo } from "@/api/user";

import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { asyncRoutes } from '@/router/index'
import { resetRouter } from "@/router";

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
  },
  GET_MENU: (state, data) => {
    let routesTree = [];
    data.forEach(m => {
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
    // commit('SET_ROUTES', routesTree)
    console.log(routesTree, '配置好的权限')
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({
        loginName: username.trim(),
        password: password,
      }).then(response => {
        const data = response.data;
        if (data) {
          let menu = response.data.admin.rights
          commit('GET_MENU', menu)
        }
        commit("SET_TOKEN", data.token);
        setToken(data.token);
        resolve(response);
      })
        .catch(error => {
          reject(error);
        });
    });
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
