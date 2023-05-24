export const SessionService = {
  setUser: (user) => sessionStorage.setItem("user", JSON.stringify(user)),
  getUser: () => JSON.parse(sessionStorage.getItem("user")),
  clearUser: () => sessionStorage.removeItem("user"),
};
