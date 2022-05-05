import React, { useEffect, useState } from 'react';
import Button from "react-bootstrap/Button";
import Select from 'react-select'
import { urlpaths } from "../CONSTANTS";
import Cookies from 'js-cookie'
import {Card, Form} from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import '../styles/sendMoney.css'


const UserSelect = ({valueSetter}) => {
    const [options, setOptions] = useState([]);
    const [error, setEror] = useState(false);
    const { user_list:userList_url} = urlpaths;
    useEffect(()=> {
        const setUserList = async() => {
            const response = await fetch(userList_url, {credentials:'include'});
            const response_item= await response.json();
            const user_list = response_item.map(item => ({'value': item.username , 'label': item.username}))
            setOptions(user_list)
        }
        setUserList()
        
    }, [])
    
    return (
        <Select
            options={options}
            onChange={option => valueSetter(option.value)}
            placeholder={"Select Fund Reciever "}
        />
    );
};

const sendAmount = async(receiver, amount, reason, submitTextSetter)=> {
    submitTextSetter('Sending...')
    const { post_transaction:sendMoneyUrl} = urlpaths;
    const data = {
        amount,
        reason,
        transaction_with: receiver,
        'transaction_type':'lend'
    }
    try {
        const response = await fetch(sendMoneyUrl, {
            method: 'post',
            headers: {'Content-Type':'application/json', 'x-CSRFToken':Cookies.get('csrftoken')},
            body: JSON.stringify(data),
            credentials:'include'
        })
        if(response.status === 201) {
            toast.success("Transaction Completed Successfully.");
            // temproarary worka around . need to use context
            window.location.href = '/home'
            
        } else {
            toast.error("Transaction Failed.");
        }
    } catch {
        toast.error("Transaction Failed.");
    } finally {
        submitTextSetter('Send Money')
    }
    
    
}


function SendMoney() {
    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [buttonText, setButtonText] = useState('Send Money');
    return (
        <>
        <Toaster />
        <Form className="payment-container">
            <Form.Group className="mb-3 text-center ">
                <div className="mb-2">
                    <UserSelect  valueSetter={setReceiver}/>
                </div>
                <div className="mb-2">
                    <input type="number"  step=".01" placeholder='amount'className="form-control" onChange={event => setAmount(event.target.value)} />
                </div>
                <div className=" mb-2">
                    <Form.Control as="textarea" value={reason} onChange={event=>setReason(event.target.value)} placeholder='reason' maxLength='25' rows={3} />
                </div>
                <Button variant="primary" onClick={(event) => sendAmount(receiver,amount, reason, setButtonText)} disabled={!(amount && receiver) || buttonText !== 'Send Money'}>{buttonText}</Button>
            </Form.Group>
        </Form>
        </>
    )
} 

export default SendMoney
