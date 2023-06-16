const mapping: Record<string, string> = {
  companies: 'company',
  materials: 'material',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
