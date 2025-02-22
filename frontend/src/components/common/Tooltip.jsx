import React from "react";
import "../../styles/Common/tooltip.css";
import PropTypes from "prop-types";

export default function Tooltip({ children, text, ...rest }) {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <div className="tooltip" style={show ? { visibility: "visible" } : {}}>
        {text}
        <span className="tooltip-arrow" />
      </div>
      <div
        {...rest}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
    </div>
  );
}
Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.node.isRequired,
};
