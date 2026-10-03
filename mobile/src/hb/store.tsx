import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

import {
  ACCOUNTS,
  CUSTOMER_NOTIFS,
  SITES,
  SUPERVISOR_NOTIFS,
  WORK_STATUS,
  type Account,
  type Notif,
  type Role,
  type Site,
  type UpdateRow,
  type WorkStatusId,
} from './data';
import { darkTheme, lightTheme, type Theme } from './theme';

export type Route =
  | 'splash' | 'login' | 'otp' | 'role'
  | 'cHome' | 'cDesign' | 'cDesignDetail' | 'cBuild' | 'cBuildUpdate'
  | 'cFinance' | 'cMilestones' | 'cSchedule' | 'cNotifications' | 'cProfile'
  | 'sHome' | 'sTasks' | 'sUpdates' | 'sProfile' | 'sNotifications'
  | 'sNew1' | 'sNew2' | 'sNew3' | 'sDone';

const homeOf = (role: Role | null): Route => (role === 'supervisor' ? 'sHome' : 'cHome');

function customerNotifFor(row: UpdateRow): Notif {
  const status = WORK_STATUS.find((w) => w.id === row.status) ?? WORK_STATUS[0];
  const blocked = row.status === 'blocked';
  return {
    id: row.token,
    kind: blocked ? 'Site Blocker Reported' : 'Site Progress Update',
    when: 'Just now',
    accent: blocked ? '#B91C1C' : '#0B7A4F',
    tint: blocked ? '#FDE8E6' : '#D6F5E6',
    icon: blocked ? 'alert-triangle' : 'tool',
    body: `${row.cat} at ${row.where} logged by ${row.by} — ${status.label.toLowerCase()}, ${row.photos} photo${row.photos > 1 ? 's' : ''} uploaded.`,
    photos: row.photos,
  };
}

export function useAppState() {
  const [route, setRoute] = useState<Route>('splash');
  const [stack, setStack] = useState<Route[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(ACCOUNTS);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [phone, setPhone] = useState('');
  const [regName, setRegName] = useState('');
  const [otp, setOtp] = useState('');

  const [done, setDone] = useState<Record<number, boolean>>({});
  const [approved, setApproved] = useState(false);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const [supDismissed, setSupDismissed] = useState<Record<string, boolean>>({});
  const [extraNotifs, setExtraNotifs] = useState<Notif[]>([]);
  const [extraSupNotifs, setExtraSupNotifs] = useState<Notif[]>([]);

  const [siteIdx, setSiteIdx] = useState(0);
  const [siteSheet, setSiteSheet] = useState(false);
  const [online, setOnline] = useState(true);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  const [wizardCat, setWizardCat] = useState<string | null>(null);
  const [wizLocation, setWizLocation] = useState<string | null>(null);
  const [wizStatus, setWizStatus] = useState<WorkStatusId>('in_progress');
  const [photos, setPhotos] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const [feed, setFeed] = useState<UpdateRow[]>([]);
  const [queue, setQueue] = useState<UpdateRow[]>([]);
  const [syncing, setSyncing] = useState(false);
  const seq = useRef(0);

  const site: Site = SITES[siteIdx];
  const theme: Theme = dark ? darkTheme : lightTheme;

  const go = useCallback((next: Route, push = false) => {
    setStack((s) => (push ? [...s, route] : []));
    setRoute(next);
  }, [route]);

  const back = useCallback(() => {
    if (!stack.length) {
      setRoute(homeOf(role));
      return;
    }
    setRoute(stack[stack.length - 1]);
    setStack(stack.slice(0, -1));
  }, [stack, role]);

  const signIn = useCallback(() => {
    const digits = phone.replace(/\D/g, '');
    const acct = accounts.find((a) => a.digits === digits) ?? accounts[0];
    setRole(acct.role);
    setOtp('');
    setStack([]);
    setRoute(homeOf(acct.role));
  }, [phone, accounts]);

  const registerAs = useCallback((r: Role) => {
    const digits = phone.replace(/\D/g, '');
    const fallback = ACCOUNTS.find((a) => a.role === r)!;
    const acct: Account = {
      digits: digits || fallback.digits,
      phone: phone || fallback.phone,
      role: r,
      name: regName.trim() || fallback.name,
      tag: fallback.tag,
    };
    setAccounts((list) => list.filter((a) => a.digits !== acct.digits).concat(acct));
    setRole(r);
    setRegName('');
    setOtp('');
    setAuthMode('signin');
    setStack([]);
    setRoute(homeOf(r));
  }, [phone, regName]);

  const logout = useCallback(() => {
    setRole(null);
    setPhone('');
    setOtp('');
    setStack([]);
    setRoute('login');
  }, []);

  const startUpdate = useCallback(() => {
    setWizardCat(null);
    setWizLocation(null);
    setWizStatus('in_progress');
    setPhotos(0);
    setRecording(false);
    setRecorded(false);
    go('sNew1', true);
  }, [go]);

  const submitUpdate = useCallback(() => {
    if (!recorded) return;
    seq.current += 1;
    const row: UpdateRow = {
      token: `upd-${site.code}-${seq.current}`,
      cat: wizardCat ?? 'Civil',
      where: wizLocation ?? site.where,
      site: site.name,
      siteCode: site.code,
      status: wizStatus,
      photos: Math.max(1, photos),
      when: 'Just now',
      by: accounts.find((a) => a.role === 'supervisor')?.name ?? 'Vikram Singh',
    };
    if (online) {
      setFeed((f) => [row, ...f]);
      setExtraNotifs((n) => [customerNotifFor(row), ...n]);
    } else {
      setQueue((q) => [...q, row]);
    }
    setStack([]);
    setRoute('sDone');
  }, [recorded, site, wizardCat, wizLocation, wizStatus, photos, online, accounts]);

  const syncNow = useCallback(() => {
    if (!online || !queue.length || syncing) return;
    setSyncing(true);
    const pending = queue;
    setTimeout(() => {
      setSyncing(false);
      setQueue([]);
      setFeed((f) => [...pending].reverse().concat(f));
      setExtraNotifs((n) => pending.map(customerNotifFor).reverse().concat(n));
    }, 900);
  }, [online, queue, syncing]);

  const approvePayment = useCallback(() => {
    if (approved) return;
    setApproved(true);
    setExtraSupNotifs((n) => [
      {
        id: 'pay-released', kind: 'Payment Released', when: 'Just now', accent: '#0B7A4F', tint: '#D6F5E6', icon: 'credit-card',
        body: 'Homeowner released ₹12,75,000 for Slab Casting & Beam Reinforcement. Milestone marked paid.',
      },
      ...n,
    ]);
  }, [approved]);

  const customerNotifs = useMemo(
    () => extraNotifs.concat(CUSTOMER_NOTIFS).filter((n) => !dismissed[n.id]),
    [extraNotifs, dismissed],
  );
  const supervisorNotifs = useMemo(
    () => extraSupNotifs.concat(SUPERVISOR_NOTIFS).filter((n) => !supDismissed[n.id]),
    [extraSupNotifs, supDismissed],
  );

  return {
    route, go, back, stack,
    role, accounts, authMode, setAuthMode, phone, setPhone, regName, setRegName, otp, setOtp,
    signIn, registerAs, logout,
    done, toggleTask: (i: number) => setDone((d) => ({ ...d, [i]: !d[i] })),
    approved, approvePayment,
    dismiss: (id: string) => setDismissed((d) => ({ ...d, [id]: true })),
    supDismiss: (id: string) => setSupDismissed((d) => ({ ...d, [id]: true })),
    customerNotifs, supervisorNotifs,
    siteIdx, setSiteIdx, site, siteSheet, setSiteSheet,
    online, toggleOnline: () => setOnline((v) => !v),
    dark, toggleDark: () => setDark((v) => !v), theme,
    lang, toggleLang: () => setLang((l) => (l === 'English' ? 'हिन्दी' : 'English')),
    wizardCat, setWizardCat, wizLocation, setWizLocation, wizStatus, setWizStatus,
    photos, addPhoto: () => setPhotos((p) => Math.min(4, p + 1)),
    recording, recorded,
    toggleRec: () => {
      if (recording) {
        setRecording(false);
        setRecorded(true);
      } else {
        setRecording(true);
      }
    },
    startUpdate, submitUpdate,
    feed, queue, syncing, syncNow,
  };
}

export type AppState = ReturnType<typeof useAppState>;

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const state = useAppState();
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside <AppProvider>');
  return v;
}
