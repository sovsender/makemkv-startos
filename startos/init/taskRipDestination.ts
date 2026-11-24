import { ripSettings } from '../actions/ripSettings'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { resolveDestination } from '../utils'

export const taskRipDestination = sdk.setupOnInit(async (effects) => {
  if (!(await resolveDestination(effects))) {
    await sdk.action.createOwnTask(effects, ripSettings, 'critical', {
      reason: i18n('Share a volume with MakeMKV to save rips to'),
    })
  } else {
    // Sharing a volume or choosing one satisfies the task; this handler re-runs on either change,
    // and a critical task would otherwise keep blocking startup.
    await sdk.action.clearTask(effects, 'makemkv:rip-settings')
  }
})
