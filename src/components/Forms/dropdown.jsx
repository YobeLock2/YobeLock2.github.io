import './dropdown.css'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
function Dropdown({ label, options, setState = () => {}, currentChoice, actOnChange = (e) => {}, actOnClick = (e) => {}}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    actOnClick();
  };

  const handleSelect = (option) => {
    setState(option);
    actOnChange(option);
    setIsOpen(false);  // Закрыть dropdown после выбора
  };

  return (
    <div className={"dropdown_block"} onClick={toggleDropdown}>
      
      <div className={isOpen ? "dropdown_btn_block active" : "dropdown_btn_block"}>
        <div className={"dropdown_text"}>{currentChoice ? currentChoice.name : ""}</div>
        <i><FontAwesomeIcon icon={faAngleRight} /></i>
      </div>
        <div className={isOpen ? "transparent_bg active" : "transparent_bg"} onClick={toggleDropdown}></div>
            <ul className={isOpen ? "dropdown active" : "dropdown"}>
            {options.map(option => (
                <li key={option.id} onClick={() => handleSelect(option)} style={{ padding: '10px', cursor: 'pointer' }}>
                {option.name}
                </li>
            ))}
            </ul>
        
    </div>
  );
}

export default Dropdown;