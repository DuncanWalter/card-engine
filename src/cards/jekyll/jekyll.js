import { Character, F, D, C } from "../../character";
import { CardLibrary } from "../cardLibrary";
import { Footwork } from "./footwork";
import { Backflip } from "./backflip";
import { Defend } from "../adventurer/defend";

let jekyll = new Character('Jekyll', true, '#0b197a', 'An intelligence created by anonymous (and evidently talented) hackers to oversee distributed network tasks and preserve operational secrecy. Copycat software backed by academics is now used almost ubiquitously, though the original is still used to protect secrets in the darker corners of the web.')

jekyll.addCard(F, Defend)

jekyll.addCard(D, Backflip)

jekyll.addCard(C, Footwork)

CardLibrary.register(jekyll)
