import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    // protoze pouzivame fetchMoviesHandler v useEffectu, tak by se vytvorilo infinite loop,
    // protoze fetchMoviesHandler je funkce a tak by se pokazda recreatovala. Proto ji hodime do useCallbacku. Nema zadne depedencies.
    setIsLoading(true);
    setError(null);
    try {
      // try methoda zkusi tenhle kod.
      const response = await fetch(
        "https://films-82e3b-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        // pokud response neni ok (napriklad pokud mame spatne napsanou tu url), vytvori se tento error.
        throw new Error("Something went wrong!");
      }

      const data = await response.json(); // pokud to je ok, tak se na ten response pusti json() metoda.

      const loadedMovies=[];
      for (const key in data) {
        loadedMovies.push({
          id:key,
          title:data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        })
      }
      
      setMovies(loadedMovies);
    } catch (error) {
      // tohle chyta ten error a nastavi setError na tu konkretni hlasku 'Something went wrong!'.
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  async function addMovieHandler(movie) {
    const response = await fetch("https://films-82e3b-default-rtdb.firebaseio.com/movies.json", {
      method: "POST",
      body: JSON.stringify(movie),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data)
  }

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]); // kdyz zmackneme ten cudlik, tak se fetchnou data. my ale chceme aby se ty data fetchnuly i pri spusteni te stranky.
  // ale pak muze byt problem s tim, ze to fetchMoviesHandler je funkce (tedy objekt) a ta se bude pokazde recreatovat. proto pridame useCallback na tuto fci.

  let content = <p>Found no movies.</p>; // budeme menit content dle daneho stavu.

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>; // vypise ta errorova hlaska
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
/*
  const dummyMovies = [
    {
      id: 1,
      title: 'Some Dummy Movie',
      openingText: 'This is the opening text of the movie',
      releaseDate: '2021-05-18',
    },
    {
      id: 2,
      title: 'Some Dummy Movie 2',
      openingText: 'This is the second opening text of the movie',
      releaseDate: '2021-05-19',
    },
  ];

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;

*/
