export type Album = {
  title: string;
  artist: string;
  year: number;
  coverUrl: string;
  spotifyId: string; // album or track ID for embed player
  type: "album" | "track";
};
