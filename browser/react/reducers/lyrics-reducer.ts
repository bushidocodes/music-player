import {
  SET_LYRICS
} from '../constants';

const initialLyricsState = {
  text: null
};

export default function (state = initialLyricsState, action) {

  switch (action.type) {

    case SET_LYRICS:
      return { ...state, text: action.text };

    default:
      return state;

  }

}
