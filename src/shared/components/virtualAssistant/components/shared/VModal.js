import React from "react";

const VModal = (props) => {
  const { children, className = "", title, toggle = () => {} } = props;
  return (
    <>
      <div className="virtual-assistant-modal-backdrop" />
      <div className={`virtual-assistant-modal ${className}`}>
        <div className="vam-header">
          <h2 className="vam-title py-2">{title}</h2>
          <button className="close" onClick={toggle}>
            &times;
          </button>
        </div>
        <div className="vam-body">{children}</div>
      </div>
    </>
  );
};

export default VModal;
