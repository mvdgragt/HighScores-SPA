import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Index = () => {

const [ games, setGames ] = useState([]);
useEffect( () => {
    fetch("http://localhost:5000/api/games")
    .then(resp => resp.json())
    .then(games => setGames(games))
},[])

const deleteGame = (id) => {
    fetch(`http://localhost:5000/api/products/${id}`, {
    method: "DELETE"})
    .then(resp => {
        const filteredGames = games.filter(game => game.id !== id);
        setGames(filteredGames);
    })
}
  return (
    <div>
        <h1>Spel</h1>
<Link to={"/admin/games/new"} class="btn btn-primary">
    Nytt spel
</Link>
<table class="table table-striped">
    <thead>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Lanseringsår</th>
        </tr>
    </thead>
    <tbody>
        {games.map(game => (
            <tr key={game.id}>
                <td>{ game.id }</td>
                <td>{ game.game_title }</td>
                <td>{ game.genre }</td>
                <td>{ game.release_year }</td>
                <td>
                    <button className = "btn btn-danger"
                            onClick = {() => deleteGame(game.id)}>Radera</button>
                </td>
            </tr>
         ))}
    </tbody>
</table>
    </div>
  )
}

export default Index