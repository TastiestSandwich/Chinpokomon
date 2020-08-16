import React from 'react';
import './typeSymbol.scss';

export interface Type {
	name: string
	symbol: string
}

export const TypeList: {[name: string] : Type} = {
	"FIRE": {
		name: "FIRE",
		symbol: "fas fa-fire"
	},
	"WATER": {
		name: "WATER",
		symbol: "fas fa-tint"
	},
	"GRASS": {
		name: "GRASS",
		symbol: "fas fa-leaf"
	},
	"NEUTRAL": {
		name: "NEUTRAL",
		symbol: "fas fa-star-of-life"
	},
	"MISTERY": {
		name: "MISTERY",
		symbol: "fas fa-question"
	},
	"ELECTRIC": {
		name: "ELECTRIC",
		symbol: "fas fa-bolt"
	},
	"EARTH": {
		name: "EARTH",
		symbol: "fas fa-mountain"
	},
	"WIND": {
		name: "WIND",
		symbol: "fas fa-wind"
	},
	"COLD": {
		name: "COLD",
		symbol: "fas fa-snowflake"
	},
	"TOXIC": {
		name: "TOXIC",
		symbol: "fas fa-radiation"
	},
	"ARTIFICIAL": {
		name: "ARTIFICIAL",
		symbol: "fas fa-wrench"
	},
};

interface TypeSymbolProps{
	type: Type
}

export class TypeSymbol extends React.Component<TypeSymbolProps> {
	render() {
		const symbol = this.props.type.symbol;
    const type = this.props.type.name;
		return (
			<div className={`type-symbol type-symbol--type-${type}`}>
        <div className="type-symbol__icon">
          <i className={symbol}></i>
        </div>
			</div>
		);
	}
}