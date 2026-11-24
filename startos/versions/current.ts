import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '26.9.2:2',
  releaseNotes: {
    en_US: 'Rips are saved to a volume you share with MakeMKV, and the new Rip Settings action sets the minimum title length and preferred language',
    es_ES: 'Las copias se guardan en un volumen que compartes con MakeMKV, y la nueva acción Ajustes de copia define la duración mínima del título y el idioma preferido',
    de_DE: 'Rips werden auf einem mit MakeMKV geteilten Volume gespeichert, und die neue Aktion Rip-Einstellungen legt Mindestlänge und bevorzugte Sprache fest',
    pl_PL: 'Kopie są zapisywane na woluminie udostępnionym MakeMKV, a nowa akcja Ustawienia kopiowania ustawia minimalną długość tytułu i preferowany język',
    fr_FR: 'Les copies sont enregistrées sur un volume partagé avec MakeMKV, et la nouvelle action Réglages de copie définit la durée minimale du titre et la langue préférée',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
