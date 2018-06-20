import { defineCard } from '../card'
import { defineEffect } from '../../effects/effect'
import { Volatile } from '../../effects/volatile'

export const Deadlock = defineCard(
  'deadlock',
  function*() {
    return { energy: undefined }
  },
  {
    energy: undefined,
  },
  {
    color: '#884422',
    text: '#[Unplayable].',
    title: 'Deadlock',
  }
)
