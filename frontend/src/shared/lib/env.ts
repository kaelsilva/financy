const backendUrl = import.meta.env.VITE_BACKEND_URL

if (!backendUrl) {
  throw new Error(
    'VITE_BACKEND_URL nao esta definida. Copie o arquivo .env.example para .env.',
  )
}

export const env = {
  backendUrl,
}
