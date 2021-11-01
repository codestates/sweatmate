import { useMemo } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

const Portal = ({ children, elementId }) => {
  const rootElement = useMemo(() => document.getElementById(elementId), [elementId]);
  return createPortal(children, rootElement);
};

Portal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]).isRequired,
  elementId: PropTypes.string.isRequired,
};

export default Portal;
