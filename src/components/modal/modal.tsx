import React from 'react';

interface ModalProps {
  open: boolean
  title?: string
}

export default class Modal extends React.Component<ModalProps> {

  render() {

    const title = this.props.title || ""
    return(
      <>
      { open &&
        <div className="modal-component">
          <div className="modal-box">
            <header>
              { title }
            </header>
            <div className="modal-content">
              { this.props.children }
          </div>
          </div>
        </div>
      }
      </>
    );
  }
}