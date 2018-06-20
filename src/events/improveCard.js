import { defineEvent } from './event'
import { Card } from '../cards/card'
import { CardStack } from '../cards/cardStack'
import { ConsumerArgs } from './listener'

interface ImproveCardContent {
  data: {
    upgrade: Card<any>,
    from: CardStack,
  };
  subject: Card<any>;
}

export const ImproveCard: * = defineEvent('improveCard', function*({
  data,
  subject,
}: ConsumerArgs<ImproveCardContent>) {
  data.from.remove(subject)
  data.from.add(data.upgrade)
})
