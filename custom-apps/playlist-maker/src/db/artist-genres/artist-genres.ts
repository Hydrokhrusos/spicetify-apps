/**
 * Saved artist genres.
 */
export type ArtistGenres = {
    /**
     * Artist URI (unique).
     */
    artistUri: string;
    /**
     * Artist name.
     */
    artistName: string;
    /**
     * Timestamp (in ms) when the genres were saved.
     */
    expiry: number;
    /**
     * List of genres.
     */
    genres: string[];
};
