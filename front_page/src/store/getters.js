export default {
	userInfo: state => {
		return state.main.userInfo;
	},
	username: state => {
		return state.main.userInfo.username;
	},
	// isAdmin: state => {
	// 	return state.main.userInfo.isAdmin;
	// },
};
