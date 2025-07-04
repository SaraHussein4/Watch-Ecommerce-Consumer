import { createReducer, on } from "@ngrx/store";
import { decreaseFavouriteCounter, increaseFavouriteCounter, initFavouriteCounter } from "./FavouriteCounter.Action";

const initialState = 0;

export const favouriteCounterReducer = createReducer(
    0,
    on(initFavouriteCounter, (state, { initialCount }) => initialCount),
    on(increaseFavouriteCounter, (state) => state + 1),
    on(decreaseFavouriteCounter, (state) => state - 1)
);