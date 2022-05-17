import ScoreCards from "../../components/ScoreCards/ScoreCards"
import { useEffect, useState } from "react";

const Home = () => {

    const [scores,setScores] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:5000/api/scores')
        .then(x => x.json())
        .then(scores => setScores(scores));
    }, [])

    return(
        <>
        
        <ScoreCards scores={scores} />
        </>
    )
};

export default Home;
