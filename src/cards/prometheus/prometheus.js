import { Character, D, C } from "../../character";
import { CardLibrary } from "../cardLibrary";
import { Daemon } from "./daemon";
import { MarkForDeath } from "./markForDeath";

let prometheus = new Character('Prometheus', true, '#670467', 'A recently discovered entity emergent from the complexity of the global network. Capable of completing complicated tasks using computing primitives in novel ways, and therefore a subject of much study. Unsettlingly, also seems capable of some agency.')

prometheus.addCard(D, Daemon)

prometheus.addCard(C, MarkForDeath)

CardLibrary.register(prometheus)
