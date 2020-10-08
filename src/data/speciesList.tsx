import { BiomeList } from '../components/type/biome';
import { BaseChinpokoData } from '../components/chinpoko/chinpoko';
import { PowerList } from './powerList';
import bisonte from '../images/bisonte.png'
import lagarto from '../images/lagarto.png'
import nutria from '../images/nutria.png'
import gato from '../images/gato.png'
import ardilla from '../images/ardilla.png'
import morsa from '../images/morsa.png'
import escualo from '../images/escualo.png'
import serpiente from '../images/serpiente.png'
import cuervo from '../images/cuervo.png'
import babosas from '../images/babosas.png'
import aguila from '../images/aguila.png'
import buho from '../images/buho.png'
import conejo from '../images/conejo.png'

export const BaseChinpokoList: {[species: string] : BaseChinpokoData} = {
	"BISONTE": {
		speciesName: "BISONTE",
		sprite: bisonte,
		baseHP: 100,
		baseATK: 60,
		baseDEF: 100,
		baseSPE: 60,
		biome: BiomeList["FOREST"],
    power: PowerList["Photosyntesis"]
	},
	"LAGARTO": {
		speciesName: "LAGARTO",
		sprite: lagarto,
		baseHP: 70,
		baseATK: 100,
		baseDEF: 70,
		baseSPE: 80,
		biome: BiomeList["DESERT"],
    power: PowerList["Heat Wave"]
	},
	"NUTRIA": {
		speciesName: "NUTRIA",
		sprite: nutria,
		baseHP: 60,
		baseATK: 100,
		baseDEF: 60,
		baseSPE: 100,
		biome: BiomeList["RIVER"],
    power: PowerList["Aqua Jet"]
	},
	"GATO": {
		speciesName: "GATO",
		sprite: gato,
		baseHP: 50,
		baseATK: 80,
		baseDEF: 50,
		baseSPE: 140,
		biome: BiomeList["UNKNOWN"],
    power: PowerList["Superposition"]
	},
  "ARDILLA": {
    speciesName: "ARDILLA",
    sprite: ardilla,
    baseHP: 80,
    baseATK: 60,
    baseDEF: 60,
    baseSPE: 120,
    biome: BiomeList["CITY"],
    power: PowerList["Charge Up"]
  },
  "MORSA": {
    speciesName: "MORSA",
    sprite: morsa,
    baseHP: 100,
    baseATK: 100,
    baseDEF: 70,
    baseSPE: 50,
    biome: BiomeList["ARCTIC"],
    power: PowerList["Deep Freeze"]
  },
  "ESCUALO": {
    speciesName: "ESCUALO",
    sprite: escualo,
    baseHP: 120,
    baseATK: 80,
    baseDEF: 80,
    baseSPE: 40,
    biome: BiomeList["SEA"],
    power: PowerList["Bloodthirst"]
  },
  "SERPIENTE": {
    speciesName: "SERPIENTE",
    sprite: serpiente,
    baseHP: 60,
    baseATK: 60,
    baseDEF: 70,
    baseSPE: 130,
    biome: BiomeList["INDUSTRIAL"],
    power: PowerList["Chemicatalyst"]
  },
  "BABOSAS": {
    speciesName: "BABOSAS",
    sprite: babosas,
    baseHP: 80,
    baseATK: 80,
    baseDEF: 80,
    baseSPE: 80,
    biome: BiomeList["VOLCANO"],
    power: PowerList["Replicate"]
  },
  "CUERVO": {
    speciesName: "CUERVO",
    sprite: cuervo,
    baseHP: 70,
    baseATK: 80,
    baseDEF: 70,
    baseSPE: 100,
    biome: BiomeList["FIELD"],
    power: PowerList["Landfill Looting"]
  },
  "AGUILA": {
    speciesName: "AGUILA",
    sprite: aguila,
    baseHP: 60,
    baseATK: 70,
    baseDEF: 100,
    baseSPE: 90,
    biome: BiomeList["MOUNTAIN"],
    power: PowerList["Danger Dive"]
  },
  "BUHO": {
    speciesName: "BUHO",
    sprite: buho,
    baseHP: 60,
    baseATK: 90,
    baseDEF: 60,
    baseSPE: 110,
    biome: BiomeList["CITY"],
    power: PowerList["Landfill Looting"]
  },
  "CONEJO": {
    speciesName: "CONEJO",
    sprite: conejo,
    baseHP: 110,
    baseATK: 60,
    baseDEF: 90,
    baseSPE: 60,
    biome: BiomeList["FIELD"],
    power: PowerList["Pivot"]
  }
};