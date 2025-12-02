
const routePermissions: { [path: string]: string[] } = {

  '/admin': ['admin'],
  '/manager': ['admin', 'manager'],
  '/user': ['user', 'admin', 'manager'],
  
};

export default routePermissions;