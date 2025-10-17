export const searchMovie = ({
  title,
  year,
}: {
  title: string;
  year?: number;
}) => {
  console.log(
    `EXECUTING[searchMovie]: Searching for ${title} (${year ?? "any year"})! 🎥`
  );
  return {
    ok: true,
    code: 200,
    data: {
      title,
      year,
      director: "Edward Berger",
      imdbScore: 8.5,
      watchlisted: false,
    },
  };
};

const watchlist: { title: string; year: number }[] = [];
export const addToWatchlist = ({
  title,
  year,
}: {
  title: string;
  year: number;
}) => {
  console.log(
    `EXECUTING[addToWatchlist]: Adding ${title} (${year}) to watchlist! 📺`
  );
  if (watchlist.find((movie) => movie.title === title && movie.year === year)) {
    console.log(`Movie ${title} (${year}) already exists in watchlist!`);
    return {
      ok: false,
      code: 201,
      message: "Movie already exists in watchlist",
    };
  }
  watchlist.push({ title, year });
  return {
    ok: true,
    code: 200,
  };
};

export const getWatchlist = () => {
  console.log(`Getting watchlist! 📺`);
  return {
    watchlist,
    ok: true,
    code: 200,
  };
};
