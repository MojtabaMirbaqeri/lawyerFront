export const useAuth = () => {
  const auth = useAuthStore();

  return {
    // State
    user: readonly(toRef(auth, "user")),
    token: readonly(toRef(auth, "token")),
    initialized: readonly(toRef(auth, "initialized")),
    isInitializing: readonly(toRef(auth, "isInitializing")),

    // Getters
    isAuthenticated: computed(() => auth.isAuthenticated),
    isLoggedIn: computed(() => auth.isLoggedIn),

    // Actions
    login: auth.login,
    registerUser: auth.registerUser,
    registerLawyer: auth.registerLawyer,
    logout: auth.logout,
    fetchUser: auth.fetchUser,
    initialize: auth.initialize,
    checkAuth: auth.checkAuth,
  };
};
