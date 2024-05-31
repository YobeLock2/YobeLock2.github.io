import './TicketInfo.css'
import {useForm} from 'react-hook-form';
import React, { useState, useEffect } from 'react';

export function TicketInfo() {

    const [ticketCurrent, setTicketCurrent] = useState([]);

    const [questFlag, setQuestFlag] = useState(false);

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
    
    const ticketInpValue = watch('ticket_id_inp'); 
    
    const handleTicketIdInputChange = (event) => {
        let value = event.target.value;
    
        if(value.match(RegExp(/^[1-9]\d*$/)) || value === "") {
            setValue('ticket_id_inp', value); // Обновляем значение с помощью react-hook-form
            
        } else {
            // Обрезаем значение до последнего допустимого ввода
            value = ticketInpValue;
            setValue('ticket_id_inp', value);
        }
    
        trigger('ticket_id_inp')
    
    }
    
    const onSubmit = (data) => {
        //alert(JSON.stringify(data));
        getTicket(ticketInpValue)
    
    }

    const {
        register: register2,
        formState: {
            errors: errors2,
        },
        handleSubmit: handleSubmit2,
        setValue: setValue2,
        watch: watch2,
        trigger: trigger2,
        clearErrors: clearErrors2,
    } = useForm({
        mode: 'all'
    });

    const questionIdInp = watch2('ticket_id_question_inp'); 
    const questionEmailInp = watch2('ticket_email_question_inp'); 
    const questionTextInp = watch2('ticket_textarea_question_inp'); 

    const onSubmit2 = (data) => {
        //alert(JSON.stringify(data))
        postQuestion()
    }

    function getTicket(ticket_id){
        fetch(`http://changemycrypto.online/api/getTicket?id=${ticket_id}`, {
            method : "GET",
            header : {
                'Content-Type': 'application/json'
            },
            
        })
        .then(response => response.json())
        .then(data => {
            if(!data["error"] && data.length != []) {
                setTicketCurrent(data);
                //alert(JSON.stringify(data))
            } else {
                setTicketCurrent([]);
            }
            
        })
        .catch(error => {console.error('Error fetching data:', error); setTicketCurrent([])});
    }

    function postQuestion(){

        fetch("http://changemycrypto.online/api/feedback", {
            method : "POST",
            header : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "ticket_id": questionIdInp,
                "user_email": questionEmailInp,
                "text": questionTextInp,
              })
        })
        .then(response => response.json())
        .then(data => {
            setQuestFlag(true)
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    return (
        <section id="ticket_info_section">
            <div className="container">
                <div class="row justify-content-center">
                    <div className="col-lg-5 justify-content-center flex">
                        <div className="side_block ticket_info_search">
                            
                            <form onSubmit={handleSubmit(onSubmit)} className='ticket_form'>
                                <p>
                                    Номер тикета:
                                </p>
                                <input name = 'ticket_id_inp' className="ticket_id_inp"
                                            {...register('ticket_id_inp', {
                                                required: "Поле обязательно к заполнению",
                                                pattern: {
                                                    value: /^[1-9]\d*$/, // Паттерн для целых чисел больше 0
                                                    message: 'Введите положительное целое число'
                                                }
                                            })} 
                                            onChange={e => handleTicketIdInputChange(e)} 
                                            placeholder="Введите номер" 
                                            type='number'/>
                                <button type="submit" className="ticket_id_btn">✓</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div className="col-lg-9 justify-content-center flex">
                        <div className="side_block ticket_info_block">
                            <div className="side_block_table">
                                <div className="side_block_table_title">
                                    <table>
                                        <tr>
                                            <td>Статус</td>
                                            <td>Валюта</td>
                                            <td>Курс валюты</td>
                                            <td>Отправленная сумма</td>
                                            <td>Полученная сумма</td>
                                        </tr>
                                    </table>
                                </div>
                                {ticketCurrent.length !== 0 ? ticketCurrent.map(option => (
                                <div className="side_block_table_info">
                                    <table>

                                        
                                            <tr>
                                                <td>{option.open ? "Открыт" : "Закрыт"}</td>
                                                <td>{option.currency_from}/{option.currency_to}</td>
                                                <td>1 {option.currency_from} = {
                                                option.price.toLocaleString('ru-RU', {maximumFractionDigits: 10 }).replace(/,/g, '.')} {option.currency_to
                                                }
                                                </td>
                                                <td>{option.value}</td>
                                                <td>{option.value * option.price}</td>
                                            </tr>
                                        
                                    </table>
                                </div>
                                )) : 
                                    
                                    <div className="side_block_table_info">
                                        <table>

                                            
                                            <tr>
                                                <td>Нет данных{ticketCurrent}</td>
                                            </tr>
                                            
                                        </table>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div className="col-lg-9 justify-content-center flex column">
                        <div className="side_block ticket_info_question">
                            <form onSubmit={handleSubmit2(onSubmit2)} className='question_form_inp'>
                                <p>
                                    Хотите задать нам вопрос, сообщить об ошибке или проблеме с транзакцией, сделайте это здесь
                                </p>
                                <div className="ticket_info_question_block">
                                    <div className="ticket_id_question">
                                        <p className='ticket_info_question_title'>
                                            Введите номер тикета:
                                        </p>
                                        <input name = 'ticket_id_question_inp' className="ticket_id_question_inp"
                                                {...register2('ticket_id_question_inp', {
                                                    required: "Поле обязательно к заполнению",
                                                    pattern: {
                                                        value: /^[1-9]\d*$/, // Паттерн для целых чисел больше 0
                                                        message: 'Введите положительное целое число'
                                                    }
                                                })} 
                                                
                                                placeholder="Введите номер" 
                                                type='number'/>
                                        <div className="input_error">
                                            {errors2?.ticket_id_question_inp && <>{errors2?.ticket_id_question_inp?.message || "Ошибка"}</>}
                                        </div>
                                    </div>
                                    <div className="ticket_email_question">
                                        <p>
                                            Введите адрес вашей почты:
                                        </p>
                                        <input name = 'ticket_email_question_inp' className="ticket_email_question_inp"
                                                {...register2('ticket_email_question_inp', {
                                                    required: "Поле обязательно к заполнению",
                                                    pattern: {
                                                        value: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/ , // Обновлённый паттерн
                                                        message: 'Неправильно введена почта'
                                                    }
                                                })} 
                                                
                                                placeholder="Введите почту" 
                                                />
                                        <div className="input_error">
                                            {errors2?.ticket_email_question_inp && <>{errors2?.ticket_email_question_inp?.message || "Ошибка"}</>}
                                        </div>
                                    </div>
                                </div>
                                <textarea name = 'ticket_textarea_question_inp' className="ticket_textarea_question_inp"
                                                {...register2('ticket_textarea_question_inp', {
                                                    required: "Поле обязательно к заполнению",
                                                })} 
                                                onChange={e => handleTicketIdInputChange(e)} 
                                                placeholder="Опишите вашу проблему" 
                                                />
                                <div className="input_error">
                                    {errors2?.ticket_textarea_question_inp && <>{errors2?.ticket_textarea_question_inp?.message || "Ошибка"}</>}
                                </div>
                            </form>
                        </div>
                        
                            {questFlag ? (<div className="side_block ticket_info_question">
                                <div className="side_block_table_info side_block_table_info_answer mt-0">
                                    <h3 className='answer_info'>Вопрос отправлен. Наши специалисты свяжуться с вами в течении 3-ёх рабочих дней. <b className='blue'></b></h3>
                                </div></div>      
                            ) : null}
                        
                        <div className="question_block_btn">
                        <form onSubmit={handleSubmit2(onSubmit2)} className='question_form_btn'>
                            <button type="submit" class="question_btn">Отправить</button>
                        </form>
                        </div>
                        
                    </div>
                </div>
            </div>
        </section>
    )
}