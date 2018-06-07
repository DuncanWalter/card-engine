# Events (and Listeners)

All changes to "battle state" are modeled by discrete `Events`. These can be anything from removing a card from your hand to the entire act of playing a card. Events are always executed by the `EventResolver`, which serves a few purposes:

1. To ensure that `Events` are executed in a controlled order.
2. To ensure that `Events` are never processed in parallel or concurrently.
3. To allow `Listeners` to modify, react to, and sometimes even cancel `Events`.
4. To allow `Events` to be paused, and/or occupy time.

All game mechanics are achieved exclusively by a combination of `Events` and `Listeners`. As a consequence, `Events` and `Listeners` need to be both flexible and expressive. 

At their core, `Listeners` are a function which takes in a game state and some data about an `Event`. Using that information, `Listeners` can modify that upcoming `Event` or schedule new `Events`. This function returns nothing of use, and is therefore called the `Listener`'s consumer. `Listeners` also all have a type string, which the `EventResolver` uses to order `Listeners` correctly (so that thing in game trigger in the correct order).

Technically speaking, `Events` are a very special subset of `Listeners`; they have a consumer and a type as well, but `Events` alone are allowed to pause execution or modify state. This distinction allows the game to--for example--simulate future `Events` to do things like calculate damage totals on cards. Additionally, `Events` carry some meta data. `Events` have any number of actors, and always have exactly one subject. Events can also be tagged with the types of other `Listeners` to provide context (a `AddCardToHand` event is often tagged by a `DrawCards` event, for example). 

`Listeners` use `Event` metadata to decide whether they care about an `Event` before it is executed. So in the `EventResolver`, Processing an `Event` entails gathering all the `Listeners` that care, ordering them around the `Event` appropriately using their types, "composing" them all, and piping event data through that composition (I put "composing" in quotes there because its closer to the type of composition used for middleware patching or building up `Express`/`Koa` servers than to traditional composition).

