import { reject } from '../../events/listener'
import { defineEffect } from '../../effects/effect'

export const Cache = defineEffect(
  'rampage',
  null,
  {
    stacked: true,
    delta: (x) => x,
    max: 999,
    min: 0,
  },
  () => reject,
  () => function*() {},
  [],
  []
)
