function SharePoll(props) {

    const baseUrl = window.location.origin;
    const newUrl = baseUrl + "/votepoll/" + props.match.params.uniqueKey;

    const copyUrl = () => {
        const text = document.getElementById("newUrl");
        text.select();
        document.execCommand("copy");
    }

    const redirect = () => {
        window.location.replace(newUrl);
    }

    return (
        <section className="poll">
            <h1>Congrats!</h1>
            <h2>Your poll was created successfully</h2>
            <p>Share your poll with friends:</p>
            <input className="url" readOnly type="text" value={newUrl} id="newUrl"/>
            <div>
                <button onClick={copyUrl}>Copy URL</button>
                <button onClick={redirect}>View Poll</button>
            </div>
        </section>

    )
}

export default SharePoll;