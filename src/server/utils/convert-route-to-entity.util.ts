const mapping: Record<string, string> = {
  manufacturers: 'manufacturer',
  'quality-controls': 'quality_control',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
