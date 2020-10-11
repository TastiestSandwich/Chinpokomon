import React from 'react';
import './tabButton.scss';

interface TabButtonProps {
	onClick: () => void
	isClicked: boolean
  amountSelected: number
  maxAmount: number
}

export class TabButton extends React.Component<TabButtonProps> {
	render() {

    const isClickedClass = this.props.isClicked ? "tab-button-component--is-clicked" : ""

		return(
			<div className={`tab-button-component ${isClickedClass}`} onClick={this.props.onClick}>
				{ this.props.children }
        <div className="tab-button-component__card-count">
          { this.props.amountSelected + "/" +this.props.maxAmount}
        </div>
			</div>
		)
	}
}