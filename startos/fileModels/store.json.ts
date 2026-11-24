import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.looseObject({
  // The id of the shared volume rips are saved to. Null until chosen.
  destination: z.string().nullable().catch(null),
  minTitleMinutes: z.number().int().min(0).max(600).catch(15),
  language: z.string().catch('eng'),
})

export const store = FileHelper.json(
  {
    base: sdk.volumes.startos,
    subpath: '/store.json',
  },
  shape,
)

export type StoreType = z.infer<typeof shape>
