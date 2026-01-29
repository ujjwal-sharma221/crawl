import { createServerFn } from '@tanstack/react-start'

import { firecrawl } from '@/lib/firecrawl'
import { authFnMiddleware } from '@/midlleware/auth-middleware'
import { BulkImportSchema } from '../../components/import/bulk-tab'

export const mapUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(BulkImportSchema)
  .handler(async ({ context, data }) => {
    const res = await firecrawl.map(data.url, {
      limit: 5,
      search: data.search,
    })

    return res
  })
