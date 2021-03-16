import firebase from "firebase";
import { useState, useEffect } from 'react';

function VotePoll(props) {

    const [poll, setPoll] = useState("");
    const [answers, setAnswers] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [options, setOptions] = useState("");

    const key = props.match.params.uniqueKey;

    const dbRef = firebase.database().ref("polls").child(key);

    useEffect(() => {

        dbRef.once('value', (data) => {
            console.log("db value", data.val());

            const dbData = data.val();
            const answers = [];

            //For each option
            for (let option in dbData.answers) {
                answers.push({
                    title: dbData.answers[option].title,
                    vote: dbData.answers[option].vote
                })
            }

            setPoll(dbData);

            setOptions(answers);

            setIsLoading(false);

        })
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const copiedPoll = { ...poll };

        let answerCount = poll[answers];
        answerCount++;
        copiedPoll[answers] = answerCount;

        const dbRef = firebase.database().ref("polls").child(key);
        dbRef.set(copiedPoll);

        console.log(`/results/${key}`);
        dbRef.on('value', () => {
            window.location.replace(`/results/${key}`);
        });



    }

    const handleChange = (e) => {
        console.log(e.target.value);
        setAnswers(e.target.value);   
    }

    const handleRadio = (e) => {
        console.log(e);
    }

    console.log("answers", options);

    return (
        <section className="poll">
            {
                isLoading ? <h2>Loading poll...</h2>
                    :
                    !poll
                        ? <h1>Sorry! Poll not found.</h1>
                        :
                        <>
                            <h1>{poll.title}</h1>
                            <form onSubmit={handleSubmit}>
                                <h2>{poll.question}</h2>
                                <div className="radioGroup" onChange={handleRadio}>
                                {
                                    options.map((option, i) => {
                                        return (
                                            
                                        // <div className="radio" key={i}>
                                        //     <input type="radio" id={i} name={i} value={opt.title}  />
                                        //     <label htmlFor={i}>{opt.title}</label>
                                        // </div>

                                        <label key={i}>
                                            <input 
                                            type="radio"
                                            className={i}
                                            checked={options.checked == i? true: false}
                                            key={i}
                                            onRadio={handleRadio}
                                            value={option.title}
                                            />
                                            {option.title}
                                        </label>
                                        )
                                    })
                                }
                                </div>
                                {/* <div className="radio">
                                    <input type="radio" id="option1" name="option" value="Yes" required onChange={handleChange} />
                                    <label htmlFor="option1">Yes</label>
                                </div>
                                <div className="radio">
                                    <input type="radio" id="option2" name="option" value="No" required onChange={handleChange} />
                                    <label htmlFor="option2">No</label>
                                </div> */}
                                <button>Vote</button>
                            </form>
                        </>

            }
        </section>
    )
}

export default VotePoll;