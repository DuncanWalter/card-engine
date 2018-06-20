import { defineCard } from '../card'
import { defineEffect } from '../../effects/effect'
import { Volatile } from '../../effects/volatile'

export const Interrupt = defineCard(
  'interrupt',
  function*() {
    return { energy: undefined }
  },
  {
    energy: undefined,
  },
  {
    color: '#448822',
    text: '#[Unplayable]. #[Volatile].',
    title: 'Interrupt',
  },
  [Volatile, 1]
)
