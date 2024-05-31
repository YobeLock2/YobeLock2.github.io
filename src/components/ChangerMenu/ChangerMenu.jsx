import './ChangerMenu.css'
import {useForm} from 'react-hook-form';
import Dropdown from '../Forms/dropdown.jsx';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export function ChangerMenu() {

    const [optionsFrom, setOptionsFrom] = useState([]);
    const [currentFrom, setCurrentFrom] = useState([]);

    const [optionsTo, setOptionsTo] = useState([]);
    const [currentTo, setCurrentTo] = useState([]);

    const [pairValue, setPairValue] = useState([]);

    const [fromValue, setFromValue] = useState(0.0);

    const [toValue, setToValue] = useState(0.0);

    const [fromRequisites, setFromRequisites] = useState([]);
    const [currentFromRequisites, setCurrentFromRequisites] = useState([]);

    const [toRequisites, setToRequisites] = useState([]);
    const [currentToRequisites, setCurrentToRequisites] = useState([]);
    
    const [toRequisitesUser, setToRequisitesUser] = useState([]);
    const [currentToRequisitesUser, setCurrentToRequisitesUser] = useState([]);

    const [fromRequisitesValue, setFromRequisitesValue] = useState('');
    const [toRequisitesUserValue, setToRequisitesUserValue] = useState('');

    const [ticket, setTicket] = useState(null);

    const [timer, setTimer] = useState(10); // Начальное значение таймера
    const [timerIsActive, setTimerIsActive] = useState(false); // Состояние активности таймера

    const [ipAddress, setIPAddress] = useState('0.0.0.0')

    const navigate = useNavigate();

    const handleRedirect = (ticketId) => {
        
        navigate('/payment/'+ticketId);
      };

    // Блок таймера
    
    useEffect(() => {
        let interval = null;

        if (timerIsActive) {
            interval = setInterval(() => {
                setTimer(timer => timer - 1);
            }, 1000);
        } else if (!timerIsActive && timer !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timerIsActive, timer]);

    useEffect(() => {
        if (timer === 0) {
            setTimerIsActive(true); // Останавливаем таймер
            setTimer(30); // Сбросить таймер до начального значения
            getPair();
        }
    }, [timer]);

    const startTimer = () => {
        setTimerIsActive(true);
    };

    const stopTimer = () => {
        setTimerIsActive(false);
    };

    const resetTimer = () => {
        setTimer(10);
        setTimerIsActive(false);
    };
    //блок формы

    const {
        register,
        formState: {
            errors,
        },
        handleSubmit,
        setValue,
        watch,
        trigger,
        clearErrors
    } = useForm({
        mode: 'all'
    });

    const fromInpValue = watch('from_inp'); 
    const toInpValue = watch('to_inp');
    const reqInpValue = watch('req_inp');
    const reqUserInpValue = watch('req_inp_user');
    const emailInpValue = watch('email_inp');

    const handleFromInputChange = (event) => {
        let value = event.target.value;
        
        if(value[1] && !(value[1] === "."))
            value = value.replace(/^0+/, "");

        if(value.match(RegExp(`^\\d+(\\.\\d{0,${currentFrom.len_value}})?$`)) || value === "") {
            setValue('from_inp', value); // Обновляем значение с помощью react-hook-form
            
        } else {
            // Обрезаем значение до последнего допустимого ввода
            value = fromInpValue;console.log(11)
            setValue('from_inp', value);
        }

        setFromValue(value);
        
        if(value && pairValue){
            setToValue((value * pairValue.value).toFixed(currentTo.len_value))
            setValue('to_inp', (value * pairValue.value).toFixed(currentTo.len_value));
        } else {
            setToValue("")
            setValue('to_inp', 0);
        }
        trigger('from_inp')
        trigger('to_inp')
 
    }

    const handleToInputChange = (event) => {
        let value = event.target.value;
        
        if(value[1] && !(value[1] === "."))
            value = value.replace(/^0+/, "");

        if(value.match(RegExp(`^\\d+(\\.\\d{0,${currentTo.len_value}})?$`)) || value === "") {
            setValue('to_inp', value); // Обновляем значение с помощью react-hook-form
        } else {
            // Обрезаем значение до последнего допустимого ввода
            value = toInpValue;
            setValue('to_inp', value);
        }

        setToValue(value);
        if(value && pairValue){
            setFromValue((value / pairValue.value).toFixed(currentFrom.len_value))
            setValue('from_inp', (value / pairValue.value).toFixed(currentFrom.len_value));
        } else {
            setFromValue("")
            setValue('from_inp', 0);
        }

        trigger('to_inp')
        trigger('from_inp')
        
    }

    const handleCardInput = (event) => {
        const formattedValue = event.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
        setValue('req_inp', formattedValue);
        console.log(formattedValue);
        setFromRequisitesValue(formattedValue);
        trigger('req_inp')
    };

    const handleEmailInput = (event) => {
        const value = event.target.value;
        setValue('email_inp', value);
        console.log(value);
        trigger('email_inp')
    };
    
    const handleCardInputUser = (event) => {
        const formattedValue = event.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
        setValue('req_inp_user', formattedValue);
        console.log(formattedValue);
        setToRequisitesUserValue(formattedValue);
        trigger('req_inp_user')
    };

    const onSubmit = (data) => {
        //alert(JSON.stringify(data))
        postTicket()
    }

    useEffect(() => {
        getCurrencyFrom();
        startTimer();
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setIPAddress(data.ip))
            .catch(error => console.log(error))
    }, []);

    useEffect(() => {
        if(fromValue && pairValue){
            setToValue((fromValue * parseFloat(pairValue.value)).toFixed(currentTo.len_value))
            setValue('to_inp', (fromValue * parseFloat(pairValue.value)).toFixed(currentTo.len_value));
            setValue('from_inp', (parseFloat(fromValue).toFixed(currentFrom.len_value)));
            trigger('to_inp');
            trigger('from_inp')
        }
        
    }, [pairValue]);

    useEffect(() => {
        getCurrencyTo();
    }, [currentFrom]);

    useEffect(() => {
        getRequisitesTo()
    }, [currentTo]);
    
    useEffect(() => {
        getRequisitesFrom()
    }, [currentFrom]);

    useEffect(() => {
        setFromRequisitesValue('');
        setValue("req_inp", "")
        clearErrors("req_inp")
    }, [currentFromRequisites.type]);

    useEffect(() => {
        if (currentFrom && currentTo) {
            getPair();
        }
    }, [currentFrom, currentTo]);


    

    function getCurrencyFrom(){
        fetch("http://changemycrypto.online/api/currencyFrom", {
            method : "GET",
            header : {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            setOptionsFrom(data);
            if (!data.find(item => item.id == currentFrom.id))
                setCurrentFrom(data[0])
            
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function getCurrencyTo(){
        fetch(`http://changemycrypto.online/api/currencyTo?id=${currentFrom.id}`, {
            method : "GET",
            header : {
                'Content-Type': 'application/json'
            },
            
        })
        .then(response => response.json())
        .then(data => {
            if(!data["error"] && data.length != []) {
                setOptionsTo(data);
                if (!data.find(item => item.id == currentTo.id)){
                    setCurrentTo(data[0])
                };
            }
            
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function getPair(){

        if (!currentFrom.id || !currentTo.id) {
            return; // Прекращаем выполнение функции, если ID не заданы
        }

        fetch(`http://changemycrypto.online/api/pair?from_id=${currentFrom.id}&to_id=${currentTo.id}`, {
            method : "GET",
            header : {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            if(!data["error"] && data.length != []) {
                setPairValue(data);
            }
            
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function getRequisitesTo(){
        if (!currentTo)
            return; // Прекращаем выполнение функции, если type не определен или пуст

        if(currentTo.type == "fiat")
            getBank(currentTo.id, "to")
        else
            getChain(currentTo.id, "to") 
    }

    function getRequisitesFrom(){
        if (!currentFrom)
            return; 

        if(currentFrom.type == "fiat")
            getBank(currentFrom.id, "from")
        else
            getChain(currentFrom.id, "from") 
    }

    function getBank(id, stateKey){
        fetch(`http://changemycrypto.online/api/bank?id=${id}`, {
            method : "GET",
            header : {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            data = data.map(item => ({
                ...item,
                type: 'fiat'
            }));
            if(!data["error"] && data.length != [])
                if(stateKey == "to") {
                    

                    setToRequisitesUser(data)
                    if (!data.find(item => item.id == currentToRequisitesUser.id) || currentToRequisitesUser.type !== 'fiat') {
                        setCurrentToRequisitesUser(data[0]);
                    }

                } else if(stateKey == "from") {
                    setFromRequisites(data)
                    if (!data.find(item => item.id == currentFromRequisites.id) || currentFromRequisites.type !== 'fiat') {
                        setCurrentFromRequisites(data[0])
                    }

                    setToRequisites(data)
                    if (!data.find(item => item.id == currentToRequisites.id) || currentToRequisites.type !== 'fiat') {
                        setCurrentToRequisites(data[0]);
                    }
                }
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function getChain(id, stateKey){
        fetch(`http://changemycrypto.online/api/chains?id=${id}`, {
            method : "GET",
            header : {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            data = data.map(item => ({
                ...item,
                type: 'crypto'
            }));
            if(!data["error"] && data.length != [])
                if(stateKey == "to") {
                    setToRequisitesUser(data)
                    if (!data.find(item => item.id == currentToRequisitesUser.id) || currentToRequisitesUser.type !== 'crypto') {
                        setCurrentToRequisitesUser(data[0]);
                    }
                } else if(stateKey == "from") {
                    setFromRequisites(data)
                    if (!data.find(item => item.id == currentFromRequisites.id) || currentFromRequisites.type !== 'crypto') {
                        setCurrentFromRequisites(data[0])
                        
                    }

                    setToRequisites(data)
                    if (!data.find(item => item.id == currentToRequisites.id) || currentToRequisites.type !== 'crypto') {
                        setCurrentToRequisites(data[0]);
                    }
                }
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function postTicket(){

        fetch("http://changemycrypto.online/api/ticket", {
            method : "POST",
            header : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "pair_id": pairValue.id,
                "value": fromValue,
                "price": pairValue.value,
                "user_requisites": reqUserInpValue,
                "from_type": currentFrom.type,
                "from_id": currentFromRequisites.id,
                "to_type": currentTo.type,
                "to_id": currentToRequisites.id,
                "user_email": emailInpValue,
                "user_ip": ipAddress,
                "requisites_from": reqInpValue,
                "requisites_from_id": currentFromRequisites.id,
                "user_requisites_id": currentToRequisitesUser.id,
                "requisites_get_id": currentToRequisites.id
              })
        })
        .then(response => response.json())
        .then(data => {
            setTicket(data["id"]);
            handleRedirect(data["id"]);
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    const handleFromIdChange = (option) => {
        setCurrentFrom(option);
    }

    const handleToIdChange = (option) => {
        setCurrentTo(option);
    }

    const handleToRequisitesChange = (option) => {
        setCurrentToRequisites(option);
    }

    const handleToRequisitesChangeUser = (option) => {
        setCurrentToRequisitesUser(option);
    }

    const handleFromRequisitesChange = (option) => {
        setCurrentFromRequisites(option);
    }

    const handleRequisitesInput = (event) => {
        setFromRequisitesValue(event.target.value);
    };

    return (
        
        <section id="change_section">
            <div>
                
                
                
            </div>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="change_block_left">
                        <div class="side_block">
                            <h2>
                                Обмен криптовалюты
                            </h2>
                            <div className="change_block_left_hint">
                                Заполните поля обмена
                            </div>
                            <div className="change_block_left_hint">
                                
                                <p>
                                    Введите свои данные(почта, адрес электронного кошелька, номер банковской карты)
                                </p>
                            </div>
                            <div className="change_block_left_hint">
                                
                                <p>
                                    Скопируйте номер вашего тикета для получения информации о транзакции
                                </p>
                            </div>
                            <p className="change_block_left_a">
                                Если хотите узнать информацию отранзакции, переходите по <a href="/ticket">ссылке</a>
                            </p>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <div class="side_block hide mt-4">
                            <div className="changer_block_timer">
                                {pairValue.value ? (
                                    <>
                                    <div className="changer_block_timer_course">
                                        <p>Текущий курс: 1 {currentFrom.name} = {pairValue.value.toLocaleString('ru-RU', {maximumFractionDigits: 20 }).replace(/,/g, '.')} {currentTo.name}</p>
                                    </div>
                                          
                                    <p>До обновления курса: <b className='blue'>{timer}...</b></p>   
                                    </>
                                          
                                    ) : null}
                            </div>
                            <div className="changer_block_ticket">
                                {ticket ? (
                                        <h3>Номер вашего тикета: <b className='blue'>{ticket}</b></h3>      
                                    ) : null}
                            </div>
                            {/* <button onClick={postTicket} class="changer_btn">Обменять</button> */}
                            <button type="submit" class="changer_btn">Обменять</button>
                        </div>
                        </form>
                    </div>
                    <div class="change_block_center">
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <div class="center_block">
                            <h2>
                                Обмен криптовалюты
                            </h2>
                            <div class="changer_block_inputs">
                                <div class="changer_block_input">
                                    <h3>
                                        Вы отправляете
                                    </h3>

                                    <div class="input_standard input_inp_dd d-flex">
                                        <input name = 'fromValue' 
                                        {...register('from_inp', {
                                            required: "Поле обязательно к заполнению",
                                            pattern: {
                                                value: RegExp(`^\\d+(\\.\\d{0,${currentFrom.len_value}})?$`), // Обновлённый паттерн
                                                message: 'Введите корректное значение'
                                            },
                                            max: {
                                                value: currentFrom.max_value,
                                                message: `Сумма должна быть не более ${currentFrom.max_value}`
                                            },
                                            min: {
                                                value: currentFrom.min_value,
                                                message: `Сумма должна быть не менее ${currentFrom.min_value}`
                                            },
                                        })} 
                                        onChange={e => handleFromInputChange(e)} 
                                        placeholder="Вы отправите" 
                                        value = {fromValue ? fromValue : 0}
                                        />

                                        <div className="input_inp_dd_select">
                                            <Dropdown label="DropdownFrom" 
                                                options={optionsFrom} 
                                                setState={setCurrentFrom} 
                                                currentChoice={currentFrom} 
                                                actOnChange = {handleFromIdChange}
                                                actOnClick = {getCurrencyFrom}
                                            />
                                        </div>
                                        <div className="input_error">
                                            {errors?.from_inp && <>{errors?.from_inp?.message || "Ошибка"}</>}
                                        </div>
                                        
                                    </div>
                                </div>
                                <div class="changer_block_input">
                                    <h3>
                                        Вы получаете
                                    </h3>
                                    <div class="input_standard input_inp_dd d-flex">
                                        {/* <input name='toValue' onChange={handleToInputChange} value = {toValue} placeholder="Вы получите" pattern="^\d+(\.\d{1,7})?$" type="number"/>
                                         */}
                                        <input name = 'toValue' 
                                        {...register('to_inp', {
                                            required: "Поле обязательно к заполнению",
                                            pattern: {
                                                value: RegExp(`^\\d+(\\.\\d{0,${currentTo.len_value}})?$`), // Обновлённый паттерн
                                                message: 'Введите корректное значение'
                                            },
                                            max: {
                                                value: currentTo.max_value,
                                                message: `Сумма должна быть не более ${currentTo.max_value}`
                                            },
                                            min: {
                                                value: currentTo.min_value,
                                                message: `Сумма должна быть не менее ${currentTo.min_value}`
                                            },
                                        })} 
                                        onChange={e => handleToInputChange(e)} 
                                        value = {toValue ? toValue : 0} placeholder="Вы отправите" 
                                        />

                                        <div className="input_inp_dd_select">                                            
                                            <Dropdown label="DropdownTo" 
                                                options={optionsTo} 
                                                setState={setCurrentTo} 
                                                currentChoice={currentTo} 
                                                actOnChange = {handleToIdChange}
                                                actOnClick = {getCurrencyTo}
                                            />
                                        </div>

                                        <div className="input_error">
                                            {errors?.to_inp && <>{errors?.to_inp?.message || "Ошибка"}</>}
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="center_block mt-4">
                            <div class="changer_block_inputs">
                                <div class="changer_block_input">
                                    {currentFromRequisites.type === "fiat" ? (
                                        <h3>
                                            Введите номер карты, с которой будете отправлять средства
                                        </h3>        
                                    ) : (
                                        <h3>
                                            Введите вдрес кошелька, с которого будете отправлять средства
                                        </h3>
                                    )}
                                    <div class="input_standard input_inp_dd d-flex">
                                        {currentFromRequisites.type === "fiat" ? (
                                            
                                            <>
                                            <input name = 'req_inp' 
                                            {...register('req_inp', {
                                                required: "Поле обязательно к заполнению",
                                                pattern: {
                                                    value: `^(\d{4} ?){3}\d{4}$`, // Обновлённый паттерн
                                                    message: 'Введите корректное значение'
                                                },
                                                minLength: {
                                                    value: 19,
                                                    message: 'Введите корректное значение'
                                                }
                                            })} 
                                            onChange={e => handleCardInput(e)} 
                                            value = {fromRequisitesValue} placeholder="Введите номер карты" 
                                            maxLength={19}/>
                                            
                                            </>
                                        ) : (
                                            <input name = 'req_inp' 
                                            {...register('req_inp', {
                                                required: "Поле обязательно к заполнению",
                                                pattern: {
                                                    value: `/[^A-Za-z0-9]/`, // Обновлённый паттерн
                                                    message: 'Неправильный адрес'
                                                },
                                                minLength: {
                                                    value: 20,
                                                    message: 'Неправильный адрес'
                                                }
                                            })} 
                                            // onChange={e => handleCardInput(e)} 
                                            placeholder="Введите адрес кошелька" 
                                            />
                                        )}
                                        <div className="input_inp_dd_select">
                                            <Dropdown label="DropdownFrom" 
                                                options={fromRequisites} 
                                                currentChoice={currentFromRequisites} 
                                                actOnChange = {handleFromRequisitesChange}
                                                actOnClick = {getRequisitesFrom}
                                            />
                                        </div>
                                        <div className="input_error">
                                            {errors?.req_inp && <>{errors?.req_inp?.message || "Ошибка"}</>}
                                        </div>
                                    </div>
                                </div>
                                <div class="changer_block_input">
                                    {currentToRequisitesUser.type === "fiat" ? (
                                        <h3>
                                            Введите номер карты, на которую мы отправим вам средства
                                        </h3>        
                                    ) : (
                                        <h3>
                                            Введите вдрес кошелька, на который мы отправим вам средства
                                        </h3>
                                    )}
                                    <div class="input_standard input_inp_dd d-flex">
                                        {currentToRequisitesUser.type === "fiat" ? (
                                            
                                            <>
                                            <input name = 'req_inp_user' 
                                            {...register('req_inp_user', {
                                                required: "Поле обязательно к заполнению",
                                                pattern: {
                                                    value: `^(\d{4} ?){3}\d{4}$`, // Обновлённый паттерн
                                                    message: 'Введите корректное значение'
                                                },
                                                minLength: {
                                                    value: 19,
                                                    message: 'Введите корректное значение'
                                                }
                                            })} 
                                            onChange={e => handleCardInputUser(e)} 
                                            value = {toRequisitesUserValue} placeholder="Введите номер карты" 
                                            maxLength={19}/>
                                            
                                            </>
                                        ) : (
                                            <input name = 'req_inp_user' 
                                            {...register('req_inp_user', {
                                                required: "Поле обязательно к заполнению",
                                                pattern: {
                                                    value: `/[^A-Za-z0-9]/`, // Обновлённый паттерн
                                                    message: 'Неправильный адрес'
                                                },
                                                minLength: {
                                                    value: 20,
                                                    message: 'Неправильный адрес'
                                                }
                                            })} 
                                            // onChange={e => handleCardInput(e)} 
                                            placeholder="Введите адрес кошелька" 
                                            />
                                        )}
                                        <div className="input_inp_dd_select">
                                            <Dropdown label="DropdownToUser" 
                                                options={toRequisitesUser} 
                                                currentChoice={currentToRequisitesUser} 
                                                actOnChange = {handleToRequisitesChangeUser}
                                                actOnClick = {getRequisitesTo}
                                            />
                                        </div>
                                        <div className="input_error">
                                            {errors?.req_inp_user && <>{errors?.req_inp_user?.message || "Ошибка"}</>}
                                        </div>
                                    </div>
                                </div>
                                <div class="changer_block_input">
                                    <h3>
                                        Введите почту
                                    </h3>
                                    <div class="input_standard input_inp_dd d-flex">
                                        <>
                                            <input name = 'email_inp' 
                                            {...register('email_inp', {
                                                required: "Поле обязательно к заполнению",
                                                pattern: {
                                                    value: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/ , // Обновлённый паттерн
                                                    message: 'Неправильно введена почта'
                                                },
                                                minLength: {
                                                    value: 3,
                                                    message: 'Неправильно введена почта'
                                                }
                                            })} 
                                            onBlur={e => handleEmailInput(e)} 
                                            value = {emailInpValue} placeholder="Введите вашу почту" 
                                            />
                                            
                                        </>
                                        <div className="input_error">
                                            {errors?.email_inp && <>{errors?.email_inp?.message || "Ошибка"}</>}
                                        </div>
                                    </div>
                                </div>
                                <div class="changer_block_input">
                                    {currentToRequisites.type === "fiat" ? (
                                        <h3>
                                            Отправьте средства на эту карту
                                        </h3>        
                                    ) : (
                                        <h3>
                                            Отправьте средства на этот кошелёк
                                        </h3>
                                    )}
                                    <div class="input_standard input_inp_dd d-flex">
                                        <input value = {currentToRequisites.requisites} placeholder="Наши реквизиты" type="text" disabled/>
                                        <div className="input_inp_dd_select">
                                            <Dropdown label="DropdownFrom" 
                                                options={toRequisites} 
                                                currentChoice={currentToRequisites} 
                                                actOnChange = {handleToRequisitesChange}
                                                actOnClick = {getRequisitesTo}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        </form>
                    </div>
                    <div class="change_block_right">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div class="side_block">
                        <div className="changer_block_timer">
                                {pairValue.value ? (
                                    <>
                                    <div className="changer_block_timer_course">
                                        <p>Текущий курс: 1 {currentFrom.name} = {pairValue.value.toLocaleString('ru-RU', {maximumFractionDigits: 20 }).replace(/,/g, '.')} {currentTo.name}</p>
                                    </div>
                                          
                                    <p>До обновления курса: <b className='blue'>{timer}...</b></p>   
                                    </>
                                          
                                    ) : null}
                            </div>
                            <div className="changer_block_ticket">
                                {ticket ? (
                                        <h3>Номер вашего тикета: <b className='blue'>{ticket}</b></h3>      
                                    ) : null}
                            </div>
                            {/* <button onClick={postTicket} class="changer_btn">Обменять</button> */}
                            <button type="submit" class="changer_btn">Обменять</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </section>
    )
}