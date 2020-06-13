import React from 'react';
import './modal.scss';

interface ModalProps {
  open: boolean
  title?: string
}

export default class Modal extends React.Component<ModalProps> {

  render() {

    const title = this.props.title || ""
    return(
      <>
      { this.props.open &&
        <div className="modal-component">
          <div className="modal-component__modal-box">
            <div className="modal-component__modal-header">
              { title }
            </div>
            <div className="modal-component__modal-content">
              { this.props.children }
          </div>
          </div>
        </div>
      }
      </>
    );
  }
}