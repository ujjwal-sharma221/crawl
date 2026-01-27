import { HugeiconsIcon } from '@hugeicons/react'
import { Attachment01Icon, FolderLinksIcon } from '@hugeicons/core-free-icons'

import { BulkTab } from '../components/import/bulk-tab'
import { SingleTab } from '../components/import/single-tab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ImportScreen() {
  return (
    <div className="flex flex-1 justify-center py-8 items-center">
      <div className="w-full max-w-2xl space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Import Content</h1>
          <p className="text-muted-foreground pt-1">
            Save webpages to your library for later reading
          </p>
        </div>

        <Tabs defaultValue="single">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" className="gap-2">
              <HugeiconsIcon className="size-4" icon={Attachment01Icon} />
              Single Url
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2">
              <HugeiconsIcon className="size-4" icon={FolderLinksIcon} />
              Bulk Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <SingleTab />
          </TabsContent>

          <TabsContent value="bulk">
            <BulkTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
