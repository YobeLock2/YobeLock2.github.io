import './payment.css'
import {useForm} from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { parseISO, add, isBefore, differenceInSeconds } from 'date-fns';

export function PaymentMain() {

    const [ticketCurrent, setTicketCurrent] = useState([]);
    const [stage, setStage] = useState(0);
    const [expired, setExpired] = useState(0);
    const { ticketId } = useParams();


    const [countdown, setCountdown] = useState('00:00:00');

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      };
    
      const checkTime = () => {
        if (ticketCurrent.length === 0) {
          console.log(ticketCurrent.length);
          return;
        }
        const dateTimeString = ticketCurrent[0].created_at;
        const timeToAdd = ticketCurrent[0].ttl;
    
        // Парсинг строки в дату
        const parsedDate = parseISO(dateTimeString);
    
        // Разделение времени для добавления на часы, минуты и секунды
        const [hours, minutes, seconds] = timeToAdd.split(':').map(Number);
    
        // Добавление времени к дате
        const newDateTime = add(parsedDate, {
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        });
    
        // Получение текущего времени в UTC+0
        const nowUTC = new Date();
    
        // Сравнение нового времени с текущим временем в UTC+0
        if (isBefore(nowUTC, newDateTime)) {
          setExpired(0);
          const remainingSeconds = differenceInSeconds(newDateTime, nowUTC);
          setCountdown(formatTime(remainingSeconds));
        } else {
          setExpired(1);
          setCountdown('00:00:00');
          if (ticketCurrent[0].repaid === 0) {
            setStage(3);
          }
        }
      };
    
      useEffect(() => {
        // Проверка времени сразу при монтировании компонента
        checkTime();
    
        // Проверка времени каждую секунду
        const intervalId = setInterval(checkTime, 1000);
    
        // Очищаем интервал при размонтировании компонента
        return () => clearInterval(intervalId);
      }, [ticketCurrent]);

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
        //alert(JSON.stringify(1));
        setStage(1);
        paymentConfirmation();
        //getTicket(ticketInpValue)
    
    }

    useEffect(() => {
        getTicket();
        const intervalId = setInterval(getTicket, 10000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (ticketCurrent.length > 0) {
            if (ticketCurrent[0].pressed == 0) {
                setStage(0);
            }
            if (ticketCurrent[0].pressed == 1) {
                setStage(1);
            }
            if (ticketCurrent[0].open == 0) {
                setStage(2);
            }
        }
        checkTime();
    }, [ticketCurrent]);

    function getTicket(){
        fetch(`http://changemycrypto.online/api/getTicket?id=${ticketId}`, {
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

    function paymentConfirmation(){
        fetch(`http://changemycrypto.online/api/payment?id=${ticketId}`, {
            method : "POST",
            header : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": ticketId,
              })
            
        })
        .then(response => response.json())
        .then(data => {
            if(!data["error"] && data.length != []) {
                
                getTicket();
                
                //alert(JSON.stringify(data))
            }
            
        })
        .catch(error => {console.error('Error fetching data:', error); setTicketCurrent([])});
    }

    

    return (
        <>
            
            <section id="payment_section">
                <div className="container">
                    <div class="row justify-content-center">
                        <div className="payment_main_block">
                            <div className="payment_main_block_top">
                                <div className="payment_main_block_top_send">
                                    <p>
                                        Сумма к отправлению
                                    </p>
                                    <p>
                                        
                                        {ticketCurrent.length > 0 ? 
                                            (ticketCurrent[0].type == 1 ? 
                                                (ticketCurrent[0].value).toLocaleString('ru-RU', {maximumFractionDigits: 2 }).replace(/,/g, '.')
                                            :
                                                (ticketCurrent[0].value).toLocaleString('ru-RU', {maximumFractionDigits: 10 }).replace(/,/g, '.')
                                            )
                                        : null}
                                        {ticketCurrent.length > 0 ?
                                            " " + ticketCurrent[0].currency_from
                                        : null}
                                    </p>
                                </div>
                                <div className="payment_main_block_top_receive">
                                    <p>
                                        Сумма к получению
                                    </p>
                                    <p>
                                        {ticketCurrent.length > 0 ? 
                                            (ticketCurrent[0].type == 1 ? 
                                                (ticketCurrent[0].value * ticketCurrent[0].price).toLocaleString('ru-RU', {maximumFractionDigits: 10 }).replace(/,/g, '.')
                                            :
                                                (ticketCurrent[0].value * ticketCurrent[0].price).toLocaleString('ru-RU', {maximumFractionDigits: 2 }).replace(/,/g, '.')
                                            )
                                        : null}
                                        {ticketCurrent.length > 0 ?
                                            " " + ticketCurrent[0].currency_to
                                        : null}
                                    </p>
                                </div>
                                
                            </div>
                            <div className="payment_main_block_bottom">
                                <div className="payment_main_block_bottom_from">
                                    <p>
                                        {ticketCurrent.length > 0 ? (
                                            ticketCurrent[0].type == 1 ? "Номер банковской карты, с которой совершите платеж:" : 
                                            "Адрес кошелька, с которого совершите платеж:"
                                        ) : null}
                                        
                                    </p>
                                    <div className="payment_req_info">
                                        <div className="payment_req_info_data">
                                            {ticketCurrent.length > 0 ? ticketCurrent[0].requisites_from: null}
                                        </div>:
                                        <div className="payment_req_info_type">
                                            { ticketCurrent.length > 0 ? ticketCurrent[0].requisites_from_id: null}
                                        </div>
                                    </div>
                                </div>
                                <div className="payment_main_block_bottom_user">
                                    <p>
                                        {ticketCurrent.length > 0 ? (
                                            ticketCurrent[0].type == 1 ? "Адрес кошелька, на который отправим средства:" : "Номер карты, на который отправим средства:"
                                        ) : null}
                                    </p>
                                    <div className="payment_req_info">
                                        <div className="payment_req_info_data">
                                            {ticketCurrent.length > 0 ? ticketCurrent[0].user_requisites: null}
                                        </div>:
                                        <div className="payment_req_info_type">
                                            {ticketCurrent.length > 0 ? ticketCurrent[0].user_requisites_id: null}
                                        </div>
                                    </div>
                                </div>
                                <div className="payment_main_block_bottom_to">
                                    <p>
                                        {ticketCurrent.length > 0 ? (
                                            ticketCurrent[0].type == 1 ? "Номер банковской карты для перевода средств:" : "Адрес кошелька для перевода средств:"
                                        ) : null}
                                    </p>
                                    <div className="payment_req_info">
                                        <div className="payment_req_info_data">
                                            {ticketCurrent.length > 0 ? ticketCurrent[0].requisites_get + ":": null}
                                        </div>:
                                        <div className="payment_req_info_type">
                                            {ticketCurrent.length > 0 ? ticketCurrent[0].requisites_get_id: null}
                                        </div>
                                    </div>
                                </div>
                                <div className="payment_main_block_bottom_timer">
                                    {stage === 2 ? 
                                    <p>
                                        Сделка завершена
                                    </p>
                                    :
                                    <>
                                    <p>
                                        Необходимо совершить перевод в течении: <b>{countdown}</b>
                                    </p>
                                    <p>
                                        Внесите платеж в течении 30 минут, иначе заказ будет отменен
                                    </p>
                                    </>
                                    }
                                    
                                </div>
                                {stage === 0 ? 
                                    <form onSubmit={handleSubmit(onSubmit)} className='paymentConfirm'>
                                        <button type="submit" class="paymentConfirm_btn">Подтверждение перевода</button>
                                    </form>
                                : null}
                            </div>
                        </div>
                        <div className="payment_progress">
                        <div className="payment_progress_block">
                        {stage === 0 ? 
                            <>
                            <div className="payment_progress_block_stage stage_second">
                                Ожидание оплаты
                            </div>
                            <div className="payment_progress_block_stage stage_third">
                                Ожидание перевода
                            </div>
                            <div className="payment_progress_block_stage stage_third">
                                Сделка завершена
                            </div>
                            </> : null
                        }
                        {stage === 1 ? 
                            <>
                            <div className="payment_progress_block_stage stage_first">
                                Ожидание оплаты
                            </div>
                            <div className="payment_progress_block_stage stage_second">
                                Ожидание перевода
                            </div>
                            <div className="payment_progress_block_stage stage_third">
                                Сделка завершена
                            </div>
                            </> : null
                        }
                        {stage === 2 ? 
                            <>
                            <div className="payment_progress_block_stage stage_first">
                                Ожидание оплаты
                            </div>
                            <div className="payment_progress_block_stage stage_first">
                                Ожидание перевода
                            </div>
                            <div className="payment_progress_block_stage stage_second">
                                Сделка завершена
                            </div>
                            </> : null
                        }
                        {stage === 3 ? 
                            <>
                            <div className="payment_progress_block_stage stage_first">
                                Ожидание оплаты
                            </div>
                            <div className="payment_progress_block_stage stage_first">
                                Ожидание перевода
                            </div>
                            <div className="payment_progress_block_stage stage_first">
                                Сделка завершена
                            </div>
                            <div className="payment_progress_block_stage stage_second">
                                Вы не перевели средства
                            </div>
                            </> : null
                        }
                        </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}