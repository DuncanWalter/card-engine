import { defineEvent } from './event'
import { Pragma } from '../pragmas/pragma'
import { ConsumerArgs } from './listener'

type Type = {
  data: any,
  subject: Pragma,
}

export const AcquirePragma = defineEvent('acquirePragma', function*({
  game,
  subject,
  resolver,
}: ConsumerArgs<Type>) {
  subject.acquire({ game, resolver, self: subject })

  game.pragmas.add(subject)
})
