import { betterAuth } from 'better-auth'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { prisma } from '@/db'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },

  plugins: [tanstackStartCookies()],
})

export const getServerSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return session
  },
)
