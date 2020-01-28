import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const useInput = initialValue => {
    const [value, set] = useState(initialValue);
    return typeof initialValue === 'boolean'
        ? { value, onChange: (event) => set(event.target.checked)}
        : { value, onChange: (event) => set(event.target.value)};
};

const INPUT_AMOUNT_MIN = 1;
const INPUT_AMOUNT_MAX = 200000;

const handleSubmit = (amount, paidBy, title, cleared) => {
    const payload = {
        paidBy: Number.parseInt(paidBy.trim(), 10),
        amount: Number.parseInt(amount.trim(), 10),
        title: title.trim(),
        cleared
    };
    const payloadJson = JSON.stringify(payload);
    console.log('json to be sent: ', payloadJson);
};

const App = () => {
    const [payments, setPayments] = useState({});
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
                try {
                    setPayments(json);
                } catch (error) {
                    console.error(error);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const [consumers, setConsumers] = useState([]);
    useEffect(() => {
        const url = '/api/consumers/';
        fetch(url)
            .then((response) => {
                if(!response.ok) {
                    throw new Error('Network error: ' + response.status);
                }

                return response.json();
            })
            .then((json) => {
                try {
                    setConsumers(json);
                } catch (error) {
                    console.error(error);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const [inputAmount, setInputAmount] = useState(undefined);
    const [inputTitle, setInputTitle] = useState(undefined);
    const [inputCleared, setInputCleared] = useState(false);
    const [inputPaidBy, setInputPaidBy] = useState(undefined);
    const [inputErrors, setInputErrors] = useState({amount: [], paidBy: [], title: []});

    const validateInputAmount = amount => {
        const errors = [];
        if (typeof amount === 'undefined' || amount === null) {
            errors.push('variable not set');
            return errors;
        }
        const parsedAmount = Number.parseInt(amount.trim(), 10);
        if (!Number.isFinite(parsedAmount)) {
            errors.push('not a finite number');
        }
        if (parsedAmount < 1) {
            errors.push('too small amount');
        }
        if (parsedAmount > 100000) {
            errors.push('too large amount');
        }
        return errors;
    };

    const validateInputPaidBy = paidBy => {
        const errors = [];
        if (typeof paidBy === 'undefined' || paidBy === null) {
            errors.push('variable not set');
            return errors;
        }
        const parsedPaidBy = Number.parseInt(paidBy.trim(), 10);
        if(!Number.isFinite(parsedPaidBy)) {
            errors.push('invalid input');
        }
        if(!consumers || !consumers.results.map(consumer => consumer.id).includes(parsedPaidBy)) {
            errors.push('input not in consumers');
        }
        return errors;
    };

    const validateInputTitle = title => {
        const errors = [];
        if (typeof title === 'undefined' || title === null) {
            errors.push('variable not set');
            return errors;
        }
        if (title.trim().length <= 0) {
            errors.push('no content');
        }
        return errors;
    };

    return payments && payments.results && consumers && consumers.results ?
        (<div>
            <h1 className="title">割り勘くん</h1>
            <div className="addPaymentForm box">
                <div className="field">
                    <label className="label">支払った人</label>
                    <div className="control">
                        <div className={`select ${
                            inputErrors.paidBy && inputErrors.paidBy.length > 0
                                ? 'is-danger'
                                : 'is-success'
                        }`}>
                            <select required
                                    onChange={(e) => setInputPaidBy(e.target.value)}
                                    onBlur={() => {
                                       console.log('onBlur for paidBy');
                                       setInputErrors({
                                           ...inputErrors,
                                           paidBy: validateInputPaidBy(inputPaidBy)
                                       });
                                    }}>
                                <option value="">-------------</option>
                                {consumers.results.map((consumer) =>
                                    <option value={consumer.id} key={consumer.id}>{consumer.username}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    {inputErrors.paidBy && inputErrors.paidBy.length > 0 &&
                        <p className="help is-danger">支払った人を入力してください</p>}
                </div>
                <div className="field">
                    <label className="label">品目</label>
                    <div className="control">
                        <input className={`input ${inputErrors.title && inputErrors.title.length > 0 ? 'is-danger' : 'is-success'}`}
                               type="text" placeholder="ex. 映画チケット" required
                               value={inputTitle}
                               onChange={(e) => setInputTitle(e.target.value)}
                               onBlur={() => {
                                   console.log('onBlur for title');
                                   setInputErrors({
                                       ...inputErrors,
                                       title: validateInputTitle(inputTitle)
                                   });
                               }}
                        />
                    </div>
                    {inputErrors.title && inputErrors.title.length > 0 &&
                        <p className="help is-danger">品目を入力してください</p>}
                </div>

                <div className="field">
                    <label className="label">金額(円)</label>
                    <div className="control">
                        <input className={`input ${inputErrors.amount && inputErrors.amount.length > 0 ? 'is-danger' : 'is-success'}`}
                               type="number" placeholder="ex. 1200" required min={INPUT_AMOUNT_MIN} max={INPUT_AMOUNT_MAX}
                               value={inputAmount}
                               onChange={(e) =>
                                   setInputAmount(e.target.value)}
                               onBlur={() => {
                                   console.log('onBlur for amount');
                                   setInputErrors({
                                       ...inputErrors,
                                       amount: validateInputAmount(inputAmount)
                                   });
                               }}
                        />
                    </div>
                    {inputErrors.amount && inputErrors.amount.length > 0 &&
                        <p className="help is-danger">正しい金額を入力してください</p>}
                </div>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input type="checkbox"
                                value={inputCleared}
                                onChange={(e) => setInputCleared(e.target.checked)} />
                                清算済みの支払い
                        </label>
                    </div>
                </div>

                <div className="field is-grouped">
                    <div className="control">
                        <button className="button is-link"
                                onClick={() => {
                                    console.log('登録ボタンがクリックされました');
                                    const newInputErrors = {
                                        amount: validateInputAmount(inputAmount),
                                        paidBy: validateInputPaidBy(inputPaidBy),
                                        title: validateInputTitle(inputTitle)
                                    };
                                    setInputErrors(newInputErrors);
                                    console.log('inputErrors at submit: ', newInputErrors);
                                    if ( newInputErrors.amount.length === 0
                                        && newInputErrors.paidBy.length === 0
                                        && newInputErrors.title.length === 0
                                    ) {
                                        handleSubmit(inputAmount, inputPaidBy, inputTitle, inputCleared);
                                    }
                                }}>
                            登録
                        </button>
                    </div>
                    <div className="control">
                        <button className="button is-link is-light"
                                onClick={() => console.log('キャンセルボタンがクリックされました')}>
                            キャンセル
                        </button>
                    </div>
                </div>
            </div>
            <div className="box table-container" style={{overflow: 'hidden'}}>
                <table className="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th>支払い人</th>
                            <th>金額</th>
                            <th>清算済</th>
                            <th>品目</th>
                        </tr>
                    </thead>
                    <tbody>
                        { payments.results.map((payment, index) => (
                            <tr key={index}>
                                <td>{payment.paid_by.username}</td>
                                <td>{payment.amount + '円'}</td>
                                <td>{payment.cleared ? '✔' : '✘'}</td>
                                <td>{payment.title}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>) :
        (<div className="loading"><span>読込中...</span></div>);
};

export default App;
ReactDOM.render(<App />, document.getElementById("app"));
