import {connect} from 'react-redux';
import Station from '../components/Station';
import { generateStationsFromSongs, convertSong } from '../utils';
import { toggleSong } from '../action-creators/player';

function mapStateToProps(state, ownProps){
  // we need:
  // genre
  // song mapped by genre and converted for playing
  return {
    genre: ownProps.genre,
    songs: (generateStationsFromSongs(state.songs)[ownProps.genre]||[]).map(song => convertSong(song)),
    currentSong: state.player.currentSong,
    isPlaying: state.player.isPlaying
  };
}
function mapDispatchToProps(dispatch,ownProps){
  return {
    toggleOne: ((song, list) => dispatch(toggleSong(song,list)))
  };
}

const ContainerCreator = connect(mapStateToProps, mapDispatchToProps);

const StationContainer = ContainerCreator(Station);

export default StationContainer;