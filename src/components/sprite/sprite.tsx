import React from 'react';

interface SpriteProps {
  sprite: string
  altText: string
  baseClass: string
}

export class Sprite extends React.Component<SpriteProps> {
  render() {
    const {sprite, altText, baseClass} = this.props

    return (
      <div className={`${baseClass}__sprite`}>
        <img src={sprite} alt={altText} />
      </div>
    )
  }
}