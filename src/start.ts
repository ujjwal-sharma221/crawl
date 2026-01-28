import { createMiddleware, createStart } from '@tanstack/react-start'
import { authMiddleware } from './midlleware/auth-middleware'

const loggingMiddleware = createMiddleware({ type: 'request' }).server(
  ({ request, next }) => {
    const url = new URL(request.url)
    console.log(`Request: ${request.method} ${url.pathname}${url.search}`)

    return next()
  },
)

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [loggingMiddleware, authMiddleware],
  }
})
