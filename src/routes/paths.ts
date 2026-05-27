export const paths = {
  home: "/",
  dashboard: {
    root: "/",
    properties: {
      root: "/properties",
      create: "/properties/create",
      edit: "/properties/:id/edit",
    },
    clients: {
      root: "/clients",
      detail: "/clients/:id",
    },
    chat: "/chat",
    users: "/users",
    roles: "/roles",
    profile: "/profile",
  },
  auth: {
    login: "/login",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  errors: {
    forbidden: "/403",
    serverError: "/500",
    maintenance: "/503",
  },
} as const
