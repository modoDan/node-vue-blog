import axios from "axios";
import {LOGIN,LOGOUT} from '../../../apis/api.js'
const main = {
    state: {
        userInfo: {}
    },
    mutations: {
        GET_INFO: (state, value) => {
            state.userInfo = value
        }
    },
    actions: {
        GetLogin({ commit }, value) {
            return new Promise((resolve, reject) => {
                LOGIN(value).then((res) => {
                    if (!res.code) {
                        resolve(res);
                        commit('GET_INFO', res.userInfo)
                    }
                });
            })
        },
        async GetLogout({ commit }) {
            await LOGOUT();
            commit('GET_INFO', null);
        }
    }
}
export default main