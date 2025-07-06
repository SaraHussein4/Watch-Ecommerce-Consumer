import { createAction, props } from "@ngrx/store";

export const increaseFavouriteCounter = createAction("increaseCounter");
export const decreaseFavouriteCounter = createAction("decreaseCounter");
export const initFavouriteCounter = createAction(
  'init',
  props<{ initialCount: number }>()
);