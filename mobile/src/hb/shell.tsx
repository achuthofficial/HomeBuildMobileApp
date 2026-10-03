import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from './data';
import { useApp, type Route } from './store';
import { palette } from './theme';
import { T } from './ui';

const CUSTOMER_TABS: { id: Route; icon: IconName; label: string }[] = [
  { id: 'cHome', icon: 'home', label: 'Home' },
  { id: 'cDesign', icon: 'edit-2', label: 'Design' },
  { id: 'cBuild', icon: 'tool', label: 'Build' },
  { id: 'cFinance', icon: 'credit-card', label: 'Finance' },
  { id: 'cSchedule', icon: 'calendar', label: 'Schedule' },
];
const SUP_TABS: { id: Route; icon: IconName; label: string }[] = [
  { id: 'sHome', icon: 'home', label: 'Home' },
  { id: 'sTasks', icon: 'check-square', label: 'Tasks' },
  { id: 'sUpdates', icon: 'repeat', label: 'Updates' },
  { id: 'sProfile', icon: 'user', label: 'Profile' },
];

const TAB_OF: Partial<Record<Route, Route>> = {
  cHome: 'cHome', cNotifications: 'cHome', cProfile: 'cHome',
  cDesign: 'cDesign', cDesignDetail: 'cDesign',
  cBuild: 'cBuild', cBuildUpdate: 'cBuild',
  cFinance: 'cFinance', cMilestones: 'cFinance',
  cSchedule: 'cSchedule',
  sHome: 'sHome', sTasks: 'sTasks', sUpdates: 'sUpdates', sProfile: 'sProfile',
  sNotifications: 'sHome', sNew1: 'sHome', sNew2: 'sHome', sNew3: 'sHome', sDone: 'sHome',
};
const BACK_ROUTES: Route[] = ['cDesignDetail', 'cBuildUpdate', 'cMilestones', 'cNotifications', 'cProfile', 'sNotifications', 'sNew1', 'sNew2', 'sNew3'];
const NO_NAV: Route[] = ['sNew1', 'sNew2', 'sNew3', 'sDone'];

export function Shell({ children }: { children: React.ReactNode }) {
  const { route, role, go, back, theme, online, supervisorNotifs, customerNotifs } = useApp();
  const insets = useSafeAreaInsets();
  const isSup = role === 'supervisor';
  const showBack = BACK_ROUTES.includes(route);
  const tabs = isSup ? SUP_TABS : CUSTOMER_TABS;
  const activeTab = TAB_OF[route];
  const showNav = !NO_NAV.includes(route);
  const bellCount = isSup ? supervisorNotifs.length : customerNotifs.length;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }}>
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.card }]}>
        {showBack ? (
          <Pressable accessibilityLabel="Back" onPress={back} hitSlop={10} style={styles.round}>
            <Feather name="arrow-left" size={20} color={theme.text} />
          </Pressable>
        ) : !isSup ? (
          <Pressable accessibilityLabel="Profile" onPress={() => go('cProfile', true)} hitSlop={10} style={[styles.round, { backgroundColor: theme.tintBlue }]}>
            <Feather name="user" size={18} color={palette.primary} />
          </Pressable>
        ) : null}
        <T style={{ fontSize: 20, fontWeight: '800', color: isSup ? theme.text : palette.primary, marginLeft: 8 }}>HomeBuild</T>
        {!online && (
          <View style={{ marginLeft: 8, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5, backgroundColor: '#FDE8D2' }}>
            <T style={{ fontSize: 9.5, fontWeight: '800', color: '#92650F', letterSpacing: 0.6 }}>OFFLINE</T>
          </View>
        )}
        <View style={{ flex: 1 }} />
        <Pressable
          accessibilityLabel="Notifications"
          onPress={() => go(isSup ? 'sNotifications' : 'cNotifications', true)}
          hitSlop={10}
          style={styles.round}>
          <Feather name="bell" size={20} color={theme.text} />
          {bellCount > 0 && <View style={styles.dot} />}
        </Pressable>
        {isSup && (
          <Pressable onPress={() => go('sProfile')} style={{ marginLeft: 8, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99, backgroundColor: theme.tintGreen }}>
            <T style={{ fontSize: 11.5, fontWeight: '700', color: palette.green }}>Site Supervisor</T>
          </Pressable>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 28, gap: 14 }} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>

      {showNav && (
        <View style={[styles.nav, { backgroundColor: theme.card, borderTopColor: theme.border, paddingBottom: Math.max(insets.bottom, 8) }]}>
          {tabs.map((t) => {
            const on = t.id === activeTab;
            const bg = on ? (isSup ? theme.tintGreen : palette.primary) : 'transparent';
            const fg = on ? (isSup ? palette.green : '#fff') : theme.sub;
            return (
              <Pressable key={t.id} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => go(t.id)} style={styles.tab}>
                <View style={{ backgroundColor: bg, borderRadius: 99, paddingHorizontal: 14, paddingVertical: 6 }}>
                  <Feather name={t.icon} size={19} color={fg} />
                </View>
                <T style={{ fontSize: 10.5, fontWeight: on ? '700' : '500', color: on ? (isSup ? palette.green : palette.primary) : theme.sub }}>{t.label}</T>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  round: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#DC2626' },
  nav: { flexDirection: 'row', borderTopWidth: 1, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
});
