export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting MakeMKV!': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,

  // interfaces.ts
  'Web UI': 4,
  'The MakeMKV web interface': 5,

  // actions/ripSettings.ts, init, main.ts
  'Rip Settings': 6,
  'Choose where rips are saved, which titles are kept and the preferred audio and subtitle language.': 7,
  'Save rips to': 8,
  'The volume you shared with MakeMKV. Rips are saved in a MakeMKV folder on it. Changing this restarts MakeMKV.': 9,
  'No volume is shared with MakeMKV': 10,
  'Minimum title length (minutes)': 11,
  'Titles shorter than this are not offered for ripping, which leaves out most extras. Use a lower number for short episodes.': 12,
  'Preferred language': 13,
  'Audio and subtitle tracks in this language are selected, along with tracks that have no language.': 14,
  'Share a volume with MakeMKV to save rips to': 15,
  'No writable volume is shared with MakeMKV to save rips to': 16,
  'The volume for rips is not available': 17,
  'English': 18,
  'Deutsch': 19,
  'Français': 20,
  'Español': 21,
  'Polski': 22,
  'Italiano': 23,
  'Nederlands': 24,
  '日本語': 25,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
