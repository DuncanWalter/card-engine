import { CardLibrary } from "../cardLibrary";
import { Character, C } from "../../character";
import { Needle } from "../eve/needle";

// guile- whenever you draw a status card, draw another card
// metastisize- whenever a card is destroyed, gain 2 redundancy
// draw, play, and destroy a card at no cost. ( gain energy = to cost, or card cost 0? )
// deal damage, add dazed to discard
// destroy a card in hand. gain 6 block.

// gain 2 energy. add a (void) to discard
// deal damage, put card from discard on top of deck
// gain block, next card played goes on top of deck
// gain much block. singleton.
// swap block and redundancy. costs 0.

// apply latency
// destroy hand. deal AOE per card destroyed
// duplicate a card in hand
// this turn, all cards cost 0 and destroy on play. lose energy on draw.
// add a burn to discard, draw 2 cards

// anger
// destroy a card. gain energy equal to it's cost.
// whenever a player card is destroyed, draw a card
// gain redundancy. volatile
// deal efficient damage. volatile

//


// PRAGMAS

// whenever you play a card, add a copy to the discard pile

const anansi = new Character('Anansi', true, '#40265b', 'A dormant virus.')

anansi.addCard(C, Needle)

CardLibrary.register(anansi)