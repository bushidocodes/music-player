import { Outlet } from 'react-router-dom';
import PlayerContainer from '../containers/PlayerContainer';
import SidebarContainer from '../containers/SidebarContainer';

export default function App() {
  return (
    <div id="main" className="container-fluid">
      <div className="row">
        <div className="col-2">
          <SidebarContainer />
        </div>
        <div className="col-10">
          <Outlet />
        </div>
      </div>
      <PlayerContainer />
    </div>
  );
}
