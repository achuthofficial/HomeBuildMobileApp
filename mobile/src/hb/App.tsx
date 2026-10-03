import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { Login, Otp, RoleSelect, Splash } from './auth';
import {
  CustomerBuild, CustomerBuildUpdate, CustomerDesign, CustomerDesignDetail, CustomerFinance, CustomerHome,
  CustomerMilestones, CustomerProfile, CustomerSchedule, NotificationList,
} from './customer';
import { Shell } from './shell';
import { AppProvider, useApp, type Route } from './store';
import {
  SiteSheet, SupervisorHome, SupervisorProfile, SupervisorTasks, SupervisorUpdates, WizardCategory, WizardDone,
  WizardPhoto, WizardVoice,
} from './supervisor';

const SCREENS: Record<Exclude<Route, 'splash' | 'login' | 'otp' | 'role'>, () => React.JSX.Element> = {
  cHome: CustomerHome,
  cDesign: CustomerDesign,
  cDesignDetail: CustomerDesignDetail,
  cBuild: CustomerBuild,
  cBuildUpdate: CustomerBuildUpdate,
  cFinance: CustomerFinance,
  cMilestones: CustomerMilestones,
  cSchedule: CustomerSchedule,
  cNotifications: () => <NotificationList supervisor={false} />,
  cProfile: CustomerProfile,
  sHome: SupervisorHome,
  sTasks: SupervisorTasks,
  sUpdates: SupervisorUpdates,
  sProfile: SupervisorProfile,
  sNotifications: () => <NotificationList supervisor />,
  sNew1: WizardCategory,
  sNew2: WizardPhoto,
  sNew3: WizardVoice,
  sDone: WizardDone,
};

function Router() {
  const { route, dark } = useApp();
  let body: React.ReactNode;
  switch (route) {
    case 'splash': body = <Splash />; break;
    case 'login': body = <Login />; break;
    case 'otp': body = <Otp />; break;
    case 'role': body = <RoleSelect />; break;
    default: {
      const Screen = SCREENS[route];
      body = (
        <Shell>
          <Screen />
        </Shell>
      );
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={dark && !['splash', 'login', 'otp', 'role'].includes(route) ? 'light' : 'dark'} />
      {body}
      <SiteSheet />
    </View>
  );
}

export default function HomeBuildApp() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
