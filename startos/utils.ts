import { T } from '@start9labs/start-sdk'
import { store } from './fileModels/store.json'
import { sdk } from './sdk'

export const uiPort = 5800

// The chosen shared volume is mounted here, and MakeMKV writes into the folder inside it. The
// image's init refuses to start without a /output folder, so that is where the volume goes.
export const ripsMount = '/output'
export const ripsDir = '/output/MakeMKV'

// ISO 639-2 codes MakeMKV understands, each shown by the language's own name.
export const languageCodes = {
  eng: 'English',
  deu: 'Deutsch',
  fra: 'Français',
  spa: 'Español',
  pol: 'Polski',
  ita: 'Italiano',
  nld: 'Nederlands',
  jpn: '日本語',
} as const

/**
 * The writable shared volume rips go to: the one the user chose, or the only writable one when
 * none was chosen. A chosen volume that was revoked or made read-only resolves to nothing, so the
 * user is asked again instead of rips silently going somewhere else.
 */
export async function resolveDestination(effects: T.Effects) {
  const writable = (await sdk.getSharedVolumes(effects).const()).filter(
    (grant) => !grant.readonly,
  )
  const chosen = await store.read((s) => s.destination).const(effects)
  if (chosen) return writable.find((grant) => grant.id === chosen) ?? null
  return writable.length === 1 ? writable[0] : null
}

/**
 * Sets keys in MakeMKV's own settings file, keeping every other line (the registration key is in
 * there too). Values reach the script as arguments, never spliced into its text.
 */
export const applySettingsScript = `
set -e
mkdir -p "$1" /config/.MakeMKV
f=/config/.MakeMKV/settings.conf
touch "$f"
set_key() {
  if grep -q "^$1 = " "$f"; then sed -i "s|^$1 = .*|$1 = \\"$2\\"|" "$f"
  else printf '%s = "%s"\\n' "$1" "$2" >> "$f"; fi
}
set_key app_DestinationDir "$1"
set_key app_DestinationType 2
set_key app_PreferredLanguage "$2"
set_key dvd_MinimumTitleLength "$3"
`
