import firebase from "firebase";
import { useState, useEffect } from 'react';

function VotePoll(props) {

    const [poll, setPoll] = useState("");
    const [answers, setAnswers] = useState("");
    const [answersNames, setAnswersNames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const key = props.match.params.uniqueKey;
    const localStorageKey = "PopsiPoll_key"
    
    useEffect(() => {
    
        const dbRef = firebase.database().ref("polls").child(key);

        dbRef.once('value', (data) => {
            const pollData = data.val();
            setPoll(pollData);
            setIsLoading(false);
            const answersNames = Object.keys(pollData.answers);
            setAnswersNames(answersNames);
        })
    }, [props.match.params]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (localStorage.getItem(localStorageKey) !== props.match.params.uniqueKey) {

            localStorage.setItem(localStorageKey, props.match.params.uniqueKey);

            const copiedPoll = {...poll};
            
            for ( let answer in copiedPoll.answers) {
                if ( answers === answer ) {
                    copiedPoll.answers[answer].votes++;
                }
            }

            const dbRef = firebase.database().ref("polls").child(key);
            dbRef.set(copiedPoll);

            console.log(`/results/${key}`);
            dbRef.on('value', () => {
                window.location.replace(`/results/${key}`);
            });
        
        } else {
            alert("You already voted for this question!");
        }

    }

    const handleChange = (e) => {
        setAnswers(e.target.id);
    }
    
    return (
        <section className="poll">
            {
                isLoading ? <h2>Loading poll...</h2>
                :
                    !poll
                    ? <h1>Sorry! Poll not found.</h1>
                    : <>
                    <h1>{poll.title}</h1> 
                    <form onSubmit={handleSubmit}>
                        <h2>{poll.question}</h2>
                        {
                            answersNames.map((answerName, index) => {
                                return (
                                    <div className="radio" key={index}>
                                        <input type="radio" id={answerName} name="option" value={poll.answers[answerName].title} required onChange={handleChange} />
                                        <label htmlFor={answerName}>{poll.answers[answerName].title}</label>
                                    </div>
                                )
                            })
                        }
                        <button>Vote</button>
                    </form>
                    </>
            }           
        </section>
    )
}

export default VotePoll;