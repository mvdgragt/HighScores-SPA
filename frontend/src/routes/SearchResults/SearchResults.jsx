import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ScoreCardsWithImage from "../../components/ScoreCards/ScoreCardsWithImage";



const SearchResults = () => {
  
    const [searchParams ] = useSearchParams();

    const [games,setGames] = useState([]);

    const searchTerm = searchParams.get('q');

    useEffect(() => {
  
    fetch(`http://localhost:5000/api/games?title=${searchTerm}`)
      .then(resp => resp.json())
      .then(games => setGames(games))
  },[searchParams,searchTerm])

    return (
      <section className="search-results mb-4">
      <div className="text-center mb-4">
        <h2>Hittade { games.length } träffar  på "{ searchTerm }"</h2>
      </div>

      <div className="row">
        {games.map((game ) => (
          <ScoreCardsWithImage game={game} key={game.id} />
        ))}
      </div>  
    </section>
  );
}

export default SearchResults;