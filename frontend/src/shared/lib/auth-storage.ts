const TOKEN_KEY = 'financy:token'

export function getStoredToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY)
}

export function storeToken(token: string, remember: boolean): void {
  clearStoredToken()

  const armazenamento = remember ? localStorage : sessionStorage
  armazenamento.setItem(TOKEN_KEY, token)
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}
