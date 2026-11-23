import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '26.9.2:1',
  releaseNotes: {
    en_US: 'Rips can now be written to volumes you share with MakeMKV in StartOS',
    es_ES: 'Las copias ahora pueden guardarse en volúmenes que compartes con MakeMKV en StartOS',
    de_DE: 'Rips können jetzt auf Volumes gespeichert werden, die Sie in StartOS mit MakeMKV teilen',
    pl_PL: 'Kopie można teraz zapisywać na woluminach udostępnionych MakeMKV w StartOS',
    fr_FR: 'Les copies peuvent désormais être enregistrées sur les volumes que vous partagez avec MakeMKV dans StartOS',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
