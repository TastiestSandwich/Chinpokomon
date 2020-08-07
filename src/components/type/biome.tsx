import { Type, TypeList } from './type';

export interface Biome {
	name: string
	weakness: Array<Type>
	resistance: Array<Type>
}

export function findEffectiveness(attackType: Type, defenseBiome: Biome):number {
	for(let effectiveType of defenseBiome.weakness) {
		if(effectiveType === attackType) {
			//console.log("It's supereffective!");
			return 2;
		}
	}
	for(let ineffectiveType of defenseBiome.resistance) {
		if(ineffectiveType === attackType) {
			//console.log("It's not very effective...")
			return 0.5;
		}
	}
	return 1;
}

export function findStab(cardType: Type, userBiome: Biome):number {
	for(let stabType of userBiome.resistance) {
		if(stabType === cardType) {
			//console.log("It was easy to cast!")
			return 1.5;
		}
	}
	
	for(let unstabType of userBiome.weakness) {
		if(unstabType === cardType) {
			//console.log("It was difficult to cast...")
			return (1./1.5);
		}
	}
	return 1;
}

export const BiomeList: {[name: string] : Biome} = {
  "DESERT": {
    name: "DESERT",
    weakness: [TypeList["WATER"], TypeList["COLD"]],
    resistance: [TypeList["FIRE"], TypeList["EARTH"]]
  },
  "ARCTIC": {
    name: "ARCTIC",
    weakness: [TypeList["FIRE"], TypeList["ARTIFICIAL"]],
    resistance: [TypeList["WATER"], TypeList["COLD"]]
  },
  "FOREST": {
    name: "FOREST",
    weakness: [TypeList["FIRE"], TypeList["ARTIFICIAL"]],
    resistance: [TypeList["GRASS"], TypeList["WIND"]]
  },
  "MOUNTAIN": {
    name: "MOUNTAIN",
    weakness: [TypeList["WATER"], TypeList["GRASS"], TypeList["ARTIFICIAL"]],
    resistance: [TypeList["EARTH"], TypeList["COLD"], TypeList["ELECTRIC"]]
  },
  "RIVER": {
    name: "RIVER",
    weakness: [TypeList["TOXIC"], TypeList["ELECTRIC"]],
    resistance: [TypeList["WATER"], TypeList["GRASS"]]
  },
  "SEA": {
    name: "SEA",
    weakness: [TypeList["TOXIC"], TypeList["ELECTRIC"]],
    resistance: [TypeList["WATER"], TypeList["COLD"]]
  },
  "FIELD": {
    name: "FIELD",
    weakness: [TypeList["COLD"], TypeList["TOXIC"]],
    resistance: [TypeList["GRASS"], TypeList["WIND"], TypeList["ARTIFICIAL"]]
  },
  "CITY": {
    name: "CITY",
    weakness: [TypeList["FIRE"], TypeList["GRASS"], TypeList["EARTH"]],
    resistance: [TypeList["WIND"], TypeList["ELECTRIC"], TypeList["TOXIC"], TypeList["ARTIFICIAL"]]
  },
  "INDUSTRIAL": {
    name: "INDUSTRIAL",
    weakness: [TypeList["GRASS"], TypeList["EARTH"], TypeList["WIND"]],
    resistance: [TypeList["FIRE"], TypeList["ELECTRIC"], TypeList["TOXIC"], TypeList["ARTIFICIAL"]]
  },
  "VOLCANO": {
    name: "VOLCANO",
    weakness: [TypeList["WATER"], TypeList["WIND"], TypeList["COLD"]],
    resistance: [TypeList["FIRE"], TypeList["EARTH"], TypeList["TOXIC"]]
  },
  "UNKNOWN": {
    name: "UNKNOWN",
    weakness: [],
    resistance: [TypeList["MISTERY"]]
  }
}