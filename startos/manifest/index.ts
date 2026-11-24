import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

const base = setupManifest({
  id: 'makemkv',
  title: 'MakeMKV',
  license: 'Proprietary',
  packageRepo: 'https://github.com/sovsender/makemkv-startos',
  upstreamRepo: 'https://github.com/jlesage/docker-makemkv',
  marketingUrl: 'https://www.makemkv.com',
  donationUrl: null,
  description: { short, long },
  volumes: ['startos', 'config'],
  sharedVolumes: true,
  images: {
    makemkv: {
      source: { dockerTag: 'jlesage/makemkv:v26.09.2' },
      arch: ['x86_64'],
    },
  },
})

export const manifest = { ...base, opticalDrives: true }
