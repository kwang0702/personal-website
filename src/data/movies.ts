export type Movie = {
  title: string;
  originalTitle: string;
  year: number;
  director: string;
  cast: string[];
  posterUrl: string;
  review?: string;
};

/**
 * Add movies here. Poster URLs come from TMDB.
 *
 * To add a movie:
 *   1. Search TMDB for the movie
 *   2. Add an entry with poster URL: https://image.tmdb.org/t/p/w500/<poster_path>
 *   3. Fill in metadata (title, originalTitle, year, director, cast)
 *   4. Optionally add a short review
 */
export const movies: Movie[] = [
  {
    title: "Requiem for a Dream",
    originalTitle: "Requiem for a Dream",
    year: 2000,
    director: "Darren Aronofsky",
    cast: ["Ellen Burstyn", "Jared Leto", "Jennifer Connelly", "Marlon Wayans"],
    posterUrl: "https://image.tmdb.org/t/p/w500/nOd6vjEmzCT0k4VYqsA2hwyi87C.jpg",
  },
  {
    title: "Sonatine",
    originalTitle: "ソナチネ",
    year: 1993,
    director: "Takeshi Kitano",
    cast: ["Takeshi Kitano", "Aya Kokumai", "Tetsu Watanabe", "Masanobu Katsumura"],
    posterUrl: "https://image.tmdb.org/t/p/w500/mX9E4fEuG17L2e7bZmhBc0XdRbw.jpg",
  },
];
