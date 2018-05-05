This is the nucleus of a deck-building game based heavily on Megacrit's Slay the Spire (go buy it; it's great and they deserve the support). The purpose of the project is to make something as mod-friendly and flexible as possible using modern JavaScript. I'm a weirdo, so that means using FlowType, Preact, custom state management, etc. At the heart of the code, there is also a lot of generator shenanigans and some meta classing. It's been a learning process so far...

//TODO:

* Switch to another theme/lore for the game (to force originality and get away from STS a bit)

* Find someone to help out
* Make some documentation

* convert playcard functions to use self, not this (help flow out)

* make state serializable (plain obj representations w/ data and function services)
* make action creators instead of HOF that take dispatch as a parameter

* add taunt (must be targeted)
* add ward (can't apply new effects)
* add phantom (untargetable)

* add Raise Dead (card to spawn an ally)