import './Header.css'
import Modal from '../Modal/Modal.jsx';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {
    const [modalActive, setModalActive] = useState(null);
    
    const [burgerActive, setBurgerActive] = useState(null);

    const openModal = (modalId) => {
        setModalActive(modalId);
    };

    const handleClick = () => {
        window.location.href = '/';
      };

    return (
    <>
    <header>
        <div className="container">
            <div className="nav-container">
                <div className={burgerActive ? "checkbox active" : "checkbox"} onClick={() => setBurgerActive(!burgerActive)}></div>
                <div className="hamburger-lines">
                    <span className="line line1"></span>
                    <span className="line line2"></span>
                    <span className="line line3"></span>
                </div>  
            </div>

            <div className={burgerActive ? "dark_bg transparent_bg active" : "dark_bg transparent_bg"} onClick={() => setBurgerActive(false)}></div>

            <div className={burgerActive ? "site_header active" : "site_header"} onClick={() => setBurgerActive(false)}>
                <div className="left_section">
                    <p className="logo" onClick={handleClick}>
                        <b>CHANGEmyCRYPTO</b>
                    </p>
                    {/* <nav className="navigation">
                        <a href="page1.html">Правила</a>
                        <a href="page2.html">Новости</a>
                        <a href="page3.html">Контакты</a>
                        <a href="page4.html">FAQ</a>
                    </nav> */}
                    
                </div>
                <div className="right_section">
                    <button onClick={() => window.location.href = '/ticket'}>Просмотр тикета</button>
                </div>
            </div>
        </div>
    </header>
    {/* <Modal active = {modalActive === 'login'} setActive = {setModalActive}>
        <div className="modal_content_standart">
            <h2>
                Вход
            </h2>
            <input placeholder="Введите логин"/>
            <input placeholder="Введите пароль"/>
            <p>
                У вас ещё нет аккаунта? <a onClick={() => openModal('singup')}>Зарегистрируйтесь</a>
            </p>
            <button className="">Вход</button>
        </div>
    </Modal>
    <Modal active = {modalActive === 'singup'} setActive = {setModalActive}>
        <div className="modal_content_standart modal_content_sing">
            <h2>
                Регистрация
            </h2>
            <input placeholder="Введите логин"/>
            <input placeholder="Введите пароль"/>
            <input placeholder="Введите номер телефона"/>
            <p>
                У вас уже есть аккаунт? <a onClick={() => openModal('login')} >Войдите</a>
            </p>
            <button className="">Регистрация</button>
            
            <div className='content_check'>
                <div className="content_check_div">
                    <input type="checkbox" id="agree" name="agree" />
                    <label className = "agree_label" for="agree">Я согласен с <a href="">Условиями Пользовательского Соглашения</a></label>
                </div>
            </div>
        </div>
    </Modal> */}
    </>
    )
}