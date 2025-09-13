import React from 'react';
import Header from '../Header/Header';
import Overview from '../Overview/Overview';
import Library from '../Library/Library';
import Management from '../Management/Management';
import Health from '../Health/Health';
import Cuts from '../Cuts/Cuts';
import Community from '../Community/Community';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <Header />
      <main className="dashboard-grid">
        <div className="grid-col-1">
            <Overview />
            <Health />
        </div>
        <div className="grid-col-2">
            <Library />
            <Cuts />
        </div>
        <div className="grid-col-3">
            <Management />
            <Community />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
