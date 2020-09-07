import React from 'react';
import './modal.scss';

interface ModalProps {
  open: boolean
  title?: string
  anticheat: boolean
  ally: boolean
}

interface ModalState {
  hover: boolean
}

export default class Modal extends React.Component<ModalProps, ModalState> {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  handleMouseOver = () => {
    this.setState({
      hover: true
    })
  }
  handleMouseOut = () => {
    this.setState({
      hover: false
    })
  }
  
  render() {
    const title = this.props.title || ""
    const show = !this.props.anticheat || this.state.hover
    return(
      <>
      { this.props.open &&
        <div className="modal-component">
          <div className="modal-component__modal-box" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
            <div className="modal-component__modal-header">
              { title }
            </div>
            <div className="modal-component__modal-content">
              { show && this.props.children }
            </div>
          </div>
        </div>
      }
      </>
    );
  }
}