// 开发环境使用环境变量指向后端，生产环境走相对路径(由 Nginx 代理)
const API = process.env.NEXT_PUBLIC_API_URL || '';

export function apiUrl(path: string) {
  return API ? `${API}${path}` : path;
}
