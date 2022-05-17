import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const New = () => {
  const navigate = useNavigate();

  const dropdownVals = [
    "Shooter",
    "Action adventure",
    "Simulation",
    "Racing",
    "Strategy",
    "Sports",
    "Puzzle platform",
    "Action platform",
    "Online board games",
    "Fighting",
  ];

  const [game_title, setGame_title] = useState();
  const [description, setDescription] = useState();
  const [genre, setGenre] = useState();
  const [image_url, setImage_url] = useState();
  const [release_year, setRelease_year] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    const game = {
      game_title,
      description,
      genre,
      image_url,
      release_year,
    };

    fetch("http://localhost:5000/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    }).then((resp) => {
      navigate("/admin/games");
    });
  };
  return (
    <>
      <h1>Nytt spel</h1>

      <form method="post" onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              value={game_title}
              onChange={(e) => setGame_title(e.target.value)}
              className="form-control"
              placeholder="Titel"
              //   required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <textarea
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              placeholder="beskrivning av spelet"
              //   required
            ></textarea>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <select
              type="text"
              className="form-select"
              placeholder="genre"
              defaultValue={"DEFAULT"}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="DEFAULT" disabled="disabled" required>
                Välj genre
              </option>
              {dropdownVals.map((dropdownVal) => (
                <option
                  key={dropdownVal}
                  value={dropdownVal}
                  onChange={(e) => setGenre(e.target.value)}
                >
                  {dropdownVal}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              value={image_url}
              onChange={(e) => setImage_url(e.target.value)}
              className="form-control"
              placeholder="url till bilden"
              //   required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name=""
              value={release_year}
              onChange={(e) => setRelease_year(e.target.value)}
              className="form-control"
              placeholder="lanseringsår"
              // required
            />
          </div>
        </div>
        <button className="btn btn-primary">Lägg till</button>
      </form>
    </>
  );
};

export default New;
