import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const App = () => {
    const [payments, setPayments] = useState([]);
    useEffect(() => {
        const url = '/api/payments/';
        fetch(url)
            .then((response) => {
                if(!response.ok) {
                    throw new Error('Network error: ' + response.status);
                }

                return response.json();
            })
            .then((json) => {
                setPayments(JSON.stringify(json));
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <p>React 万歳!</p>
            <div className="payments-container">
                { payments }
            </div>
        </div>
    );
};

export default App;
ReactDOM.render(<App />, document.getElementById("app"));
