const mapping: Record<string, string> = {
  companies: 'company',
  contents: 'content',
  progresses: 'progress',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
