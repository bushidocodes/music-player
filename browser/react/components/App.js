import React from 'react';
import { Outlet } from 'react-router-dom';

import SidebarContainer from '../containers/SidebarContainer';
import PlayerContainer from '../containers/PlayerContainer';

export default function () {
  return (
    <div id="main" className="container-fluid">
      <div className="col-2">
        <SidebarContainer />
      </div>
      <div className="col-10">
        <Outlet />
      </div>
      <PlayerContainer />
    </div>
  );
}
