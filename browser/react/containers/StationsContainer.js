import {connect} from 'react-redux';
import Stations from '../components/Stations';

function mapStateToProps(state){
  return {
    stations: generateStationsFromSongs(state.songs)
  };
}
function mapDispatchToProps(dispatch){
  return {};
}

function generateStationsFromSongs(songs) {
  let resultObj = {};
  songs.forEach((song) => {
    resultObj[song.genre] = resultObj[song.genre] || [];
    resultObj[song.genre].push(song);
  })
  return resultObj;
}

const ContainerCreator = connect(mapStateToProps, mapDispatchToProps);

const StationsContainer = ContainerCreator(Stations);

export default StationsContainer