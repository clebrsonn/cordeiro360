import React from 'react';
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
      <main className="dashboard-grid">
        <Overview />
        <Health />
        <Library />
        <Cuts />
        <Management />
        <Community />
      </main>
    </div>
  );
};

export default Dashboard;
