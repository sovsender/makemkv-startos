import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting MakeMKV!'))

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: sdk.SubContainer.of(
      effects,
      { imageId: 'makemkv' },
      sdk.Mounts.of()
        .mountVolume({
          volumeId: 'config',
          subpath: null,
          mountpoint: '/config',
          readonly: false,
        })
        .mountVolume({
          volumeId: 'output',
          subpath: null,
          mountpoint: '/output',
          readonly: false,
        }),
      'makemkv-sub',
    ),
    exec: {
      command: sdk.useEntrypoint(),
      runAsInit: true,
      env: {
        USER_ID: '0',
        GROUP_ID: '0',
        TZ: 'Etc/UTC',
        WEB_FILE_MANAGER: '1',
        WEB_FILE_MANAGER_ALLOWED_PATHS: '/output',
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
