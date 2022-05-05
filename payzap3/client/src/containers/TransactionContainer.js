import React, {useState, useEffect} from 'react'
import { urlpaths } from "../CONSTANTS";
import {getSessionUser} from "../utils";
import Alert from '../components/Alert';
import DashCard from '../components/DashCard'
import SendMoney from '../components/SendMoney'


function TransactionContainer() {
    const [show, setShow] = useState(false)
    const [lentAmount, setLentAmount] = useState(0);
    const [borrowedAmount, setborrowedAmount] = useState(0);
    const [error, setError] = useState(false);
    
    const {user_transaction: url, api_login:loginUrl} = urlpaths;
    const currentUser = getSessionUser();

    useEffect(()=> {

        const isLoggedIn = () => {
            if(!currentUser) {
                window.location.href = '/login'
            }
            setShow(true)
            return true
        }
        
        const getUserTransactions = async () => {
            try {
                const response = await fetch(`${url}${currentUser}`, {credentials:'include'})
                const transactions= await response.json()
                const userLentTransactions = transactions.filter((transaction)=> transaction.transaction_from === currentUser )
                const userBorrowedTransactions = transactions.filter((transaction)=> transaction.transaction_with === currentUser )
                const lent = userLentTransactions.reduce((acc, item) => acc +  Number(item.amount), 0)
                const borrowed = userBorrowedTransactions.reduce((acc, item) => acc + Number(item.amount), 0)
                setLentAmount(lent);
                setborrowedAmount(borrowed);
                
            } catch(error) {
                setError(true)
            }
            
        }
        isLoggedIn();
        getUserTransactions();
    })
    return (
        <>
            {error ? <Alert msg={'Error Occured while Fetching Transactions'}/> : null}
            <div className="container ">
                <div className="row">
                    <div className="col-xl-6 text-center">
                        <DashCard amount={lentAmount} title={"Lent"}/>
                    </div>
                    <div className="col-xl-6">
                        <DashCard amount={borrowedAmount} card_type={"borrow"} title={"Borrowed"}/> 
                    </div>
                    
                </div>
                <div className="row">
                    <SendMoney />
                </div>
            </div>
        </>
    )
} 

export default TransactionContainer
