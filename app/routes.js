

import LandingComponent from './components/Landing/Landing.jsx';
import MissionComponent from './components/Mission/Mission.jsx';
import CreditsComponent from './components/Credits/Credits.jsx';

export default [
  {
    path: '/',
    component: LandingComponent
  },
  {
    path: 'mission',
    component: MissionComponent,
    childRoutes: [
      {
        path: '/?key',
        component: MissionComponent
      }
    ]
  },
  {
    path: 'credits',
    component: CreditsComponent
  }
];
