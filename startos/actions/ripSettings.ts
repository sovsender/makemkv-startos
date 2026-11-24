import { store } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { languageCodes, resolveDestination } from '../utils'

const { InputSpec, Value } = sdk

const none = 'none'

const inputSpec = InputSpec.of({
  destination: Value.dynamicSelect(async ({ effects }) => {
    const writable = (await sdk.getSharedVolumes(effects).const()).filter(
      (grant) => !grant.readonly,
    )
    const values: Record<string, string> = writable.length
      ? Object.fromEntries(writable.map((grant) => [grant.id, grant.name]))
      : { [none]: i18n('No volume is shared with MakeMKV') }
    return {
      name: i18n('Save rips to'),
      description: i18n(
        'The volume you shared with MakeMKV. Rips are saved in a MakeMKV folder on it. Changing this restarts MakeMKV.',
      ),
      values,
      default: writable[0]?.id ?? none,
      disabled: writable.length
        ? false
        : i18n('No writable volume is shared with MakeMKV to save rips to'),
    }
  }),
  minTitleMinutes: Value.number({
    name: i18n('Minimum title length (minutes)'),
    description: i18n(
      'Titles shorter than this are not offered for ripping, which leaves out most extras. Use a lower number for short episodes.',
    ),
    required: true,
    default: 15,
    integer: true,
    min: 0,
    max: 600,
    step: null,
    units: 'min',
    placeholder: null,
    warning: null,
  }),
  language: Value.select({
    name: i18n('Preferred language'),
    description: i18n(
      'Audio and subtitle tracks in this language are selected, along with tracks that have no language.',
    ),
    values: {
      eng: i18n('English'),
      deu: i18n('Deutsch'),
      fra: i18n('Français'),
      spa: i18n('Español'),
      pol: i18n('Polski'),
      ita: i18n('Italiano'),
      nld: i18n('Nederlands'),
      jpn: i18n('日本語'),
    } satisfies Record<keyof typeof languageCodes, string>,
    default: 'eng',
  }),
})

export const ripSettings = sdk.Action.withInput(
  'rip-settings',
  async () => ({
    name: i18n('Rip Settings'),
    description: i18n(
      'Choose where rips are saved, which titles are kept and the preferred audio and subtitle language.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  inputSpec,
  async ({ effects }) => {
    const saved = await store.read().const(effects)
    return {
      destination: (await resolveDestination(effects))?.id ?? none,
      minTitleMinutes: saved?.minTitleMinutes ?? 15,
      language: (saved?.language as keyof typeof languageCodes) ?? 'eng',
    }
  },
  async ({ effects, input }) => {
    await store.merge(effects, {
      destination: input.destination === none ? null : input.destination,
      minTitleMinutes: input.minTitleMinutes,
      language: input.language,
    })
  },
)
