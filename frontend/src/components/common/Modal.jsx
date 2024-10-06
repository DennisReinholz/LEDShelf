import React from "react";
import styled from "styled-components";
import { HiXMark } from "react-icons/hi2";
import PropTypes from "prop-types";

const StyledModal = styled.div`
  position: fixed;
  overflow: hidden;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #111211;
  border-radius: 1rem;
  padding: 3.2rem 4rem;
  transition: all 0.5s;
  border: 1px solid rgb(197, 196, 196);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
`;

const OverLay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  border-radius: 1rem;
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #323332;
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
  }
`;

const Modal = ({ children, onClose }) => {
  return (
    <OverLay>
      <StyledModal>
        <Button onClick={onClose}>
          <HiXMark />
        </Button>
        <div>{children}</div>
      </StyledModal>
    </OverLay>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
