const APIS = {
	LOGIN: "/api/a/rbac/login",
	REFRESH: "/api/a/rbac/refresh",
	APPS: "/api/a/rbac/app",
	DATASERVICE: "/api/a/sm/service",
	LIBRARY: "/api/a/sm/globalSchema",
	FUNCTIONS: "/api/a/pm/faas",
	BOOKMARKS: (app) => `/api/a/rbac/${app}/bookmark`,
	ROLES: "/api/a/rbac/role",
	GROUPS: (app) => `/api/a/rbac/${app}/group`
};