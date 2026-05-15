export const paths = {
  home: "/",
  auth: {
    login: "/login",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  errors: {
    forbidden: "/403",
    serverError: "/500",
    maintenance: "/503",
  }
} as const
