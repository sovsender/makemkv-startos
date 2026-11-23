import { i18n } from './i18n'
import { sdk } from './sdk'
import { sharedPath, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting MakeMKV!'))

  // Each grant is a volume the user shared with MakeMKV in StartOS; the list is reactive,
  // so granting or revoking one restarts the service with the new set.
  const grants = await sdk.getSharedVolumes(effects).const()

  const subcontainer = sdk.SubContainer.of(
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
  )

  // Mounted by the stable grant id, since names are editable. An offline volume is skipped, not fatal.
  const mounted: string[] = []
  for (const grant of grants) {
    const mountpoint = sharedPath(grant.id)
    const outcome = await subcontainer.tryMountSharedVolume({
      id: grant.id,
      mountpoint,
      subpath: null,
      readonly: grant.readonly,
    })
    if (outcome.kind === 'unavailable') {
      console.warn(`Shared volume "${grant.name}" unavailable: ${outcome.reason}`)
      continue
    }
    mounted.push(mountpoint)
    console.info(
      `Shared volume "${grant.name}" (${grant.readonly ? 'read-only' : 'read-write'}) is at ${mountpoint}`,
    )
  }

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
        WEB_FILE_MANAGER_ALLOWED_PATHS: ['/output', ...mounted].join(','),
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
