import { store } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  applySettingsScript,
  resolveDestination,
  ripsDir,
  ripsMount,
  uiPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting MakeMKV!'))

  // Rips only go to a volume the user shared with MakeMKV. Without one the service does not start,
  // and the critical task from init points the user at the action that fixes it.
  const destination = await resolveDestination(effects)
  if (!destination) {
    throw new Error(
      i18n('No writable volume is shared with MakeMKV to save rips to'),
    )
  }
  const settings = (await store.read().const(effects)) ?? {
    minTitleMinutes: 15,
    language: 'eng',
  }

  const subcontainer = sdk.SubContainer.of(
    effects,
    { imageId: 'makemkv' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'config',
      subpath: null,
      mountpoint: '/config',
      readonly: false,
    }),
    'makemkv-sub',
  )

  // Mounted by the stable grant id, since names are editable.
  const outcome = await subcontainer.tryMountSharedVolume({
    id: destination.id,
    mountpoint: ripsMount,
    subpath: null,
    readonly: false,
  })
  if (outcome.kind === 'unavailable') {
    throw new Error(
      `${i18n('The volume for rips is not available')}: ${outcome.reason}`,
    )
  }
  console.info(`Rips are saved to "${destination.name}", folder MakeMKV`)

  await subcontainer.execFail([
    'sh',
    '-c',
    applySettingsScript,
    'sh',
    ripsDir,
    settings.language ?? 'eng',
    String((settings.minTitleMinutes ?? 15) * 60),
  ])

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer,
    exec: {
      command: sdk.useEntrypoint(),
      runAsInit: true,
      env: {
        USER_ID: '0',
        GROUP_ID: '0',
        TZ: 'Etc/UTC',
        WEB_FILE_MANAGER: '1',
        WEB_FILE_MANAGER_ALLOWED_PATHS: ripsMount,
      },
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })
})
