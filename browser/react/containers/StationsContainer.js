import {connect} from 'react-redux';
import Stations from '../components/Stations';
import { generateStationsFromSongs } from '../utils';

function mapStateToProps(state){
  return {
    stations: generateStationsFromSongs(state.songs)
  };
}
function mapDispatchToProps(dispatch){
  return {};
}

const ContainerCreator = connect(mapStateToProps, mapDispatchToProps);

const StationsContainer = ContainerCreator(Stations);

export default StationsContainer;