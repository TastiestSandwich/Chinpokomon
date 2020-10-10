import React from 'react';
import './tabButton.scss';

interface TabButtonProps {
	onClick: () => void
	isClicked: boolean
}

export class TabButton extends React.Component<TabButtonProps> {
	render() {
		return(
			<div className="tab-button-component" onClick={this.props.onClick}>
				{ this.props.children }
			</div>
		)
	}
}