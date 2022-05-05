import React from 'react';

function DashCard({amount=0, card_type='lent', title=''}) {
   const card_variant = card_type ==='lent' ? 'bg-success' : 'bg-danger'
   
    return (
        <>
            <div className= {`card text-white ${card_variant} mb-3 mt-3`}>
                <div className="card-header text-center"><h1>{title}</h1></div>
                <div className="card-body">
                    <h1 className="card-title text-center">{amount} $</h1>
                    </div>
                </div>
        </>

    )
} 

export default DashCard
