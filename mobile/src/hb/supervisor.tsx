import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, TextInput, View } from 'react-native';

import {
  HISTORY, HISTORY_CATS, LOCATIONS, PROJECTS, SITES, SUP_TASKS, TODAY_TASK_COUNT, WORK_CATEGORIES, WORK_STATUS,
} from './data';
import { useApp } from './store';
import { palette } from './theme';
import { Badge, Card, Chip, ChipRow, EmptyState, Icon, IconTile, Kicker, OutlineButton, PrimaryButton, Progress, Switch, T } from './ui';

const Row = ({ children, gap = 10, style }: { children: React.ReactNode; gap?: number; style?: object }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>
);

function TaskRow({ index, title, sub, rail, due }: { index: number; title: string; sub: string; rail: string; due?: string }) {
  const { theme, done, toggleTask } = useApp();
  const on = !!done[index];
  const logged = !!due && /Logged/.test(due);
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={() => toggleTask(index)}>
      <Row gap={12} style={{ paddingVertical: 10 }}>
        <View style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, backgroundColor: rail }} />
        <View style={{ flex: 1 }}>
          <T style={{ fontWeight: '700', textDecorationLine: on ? 'line-through' : 'none', color: on ? theme.mute : theme.text }}>{title}</T>
          <T style={{ color: theme.sub, fontSize: 12.5 }}>{sub}</T>
          {due ? (
            <Row gap={5} style={{ marginTop: 4 }}>
              <Icon name="clock" size={11} color={on ? theme.mute : logged ? palette.green : palette.amber} />
              <T style={{ fontSize: 11.5, fontWeight: '600', color: on ? theme.mute : logged ? palette.green : palette.amber }}>{due}</T>
            </Row>
          ) : null}
        </View>
        <View style={{ width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: on ? palette.greenBright : '#cfd6e0', backgroundColor: on ? palette.greenBright : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {on && <Feather name="check" size={14} color="#fff" />}
        </View>
      </Row>
    </Pressable>
  );
}

export function SupervisorHome() {
  const { theme, site, setSiteSheet, queue, syncing, syncNow, online, startUpdate, go, done } = useApp();
  const pending = TODAY_TASK_COUNT - Array.from({ length: TODAY_TASK_COUNT }, (_, i) => i).filter((i) => done[i]).length;
  const doneCount = TODAY_TASK_COUNT - pending;
  return (
    <>
      <Card onPress={() => setSiteSheet(true)}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Kicker>CURRENT SITE</Kicker>
            <Row gap={6} style={{ marginTop: 4 }}><T style={{ fontSize: 20, fontWeight: '800', flexShrink: 1 }}>{site.name}</T><Feather name="chevron-down" size={18} color={theme.sub} /></Row>
          </View>
          <Badge label={site.code} bg={theme.tintBlue} color={palette.primary} />
        </Row>
        <Row gap={6} style={{ marginTop: 6 }}><Icon name="map-pin" size={13} color={theme.sub} /><T style={{ color: theme.sub }}>{site.where}</T></Row>
        <Row style={{ justifyContent: 'space-between', marginTop: 10 }}>
          <T style={{ color: palette.primary, fontSize: 12.5, fontWeight: '600' }}>{SITES.length} assigned sites · switch</T>
          <T style={{ color: theme.sub, fontSize: 12.5 }}>Today, 21 Sep</T>
        </Row>
      </Card>

      {queue.length > 0 && (
        <Card style={{ backgroundColor: theme.tintOrange, borderColor: theme.tintOrange }}>
          <Row gap={12}>
            <Icon name="cloud-off" size={20} color={palette.orange} />
            <View style={{ flex: 1 }}>
              <T style={{ fontWeight: '800' }}>{queue.length === 1 ? '1 update waiting to sync' : `${queue.length} updates waiting to sync`}</T>
              <T style={{ color: theme.sub, fontSize: 12 }}>Saved on device with a retry token</T>
            </View>
            <Pressable onPress={syncNow} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, backgroundColor: online && !syncing ? palette.primary : '#9EB9E4' }}>
              <T style={{ color: '#fff', fontWeight: '700', fontSize: 12.5 }}>{syncing ? 'Syncing…' : online ? 'Sync now' : 'Offline'}</T>
            </Pressable>
          </Row>
        </Card>
      )}

      <Pressable onPress={startUpdate} accessibilityRole="button" style={{ borderRadius: 22, backgroundColor: palette.primary, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}><Feather name="camera" size={24} color="#fff" /></View>
        <View style={{ flex: 1 }}><T style={{ color: '#fff', fontSize: 19, fontWeight: '800' }}>Start Daily Update</T><T style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12.5 }}>Category, photos, voice note</T></View>
        <Feather name="chevron-right" size={22} color="#fff" />
      </Pressable>

      <Card onPress={() => go('sUpdates')}>
        <Row gap={14}>
          <IconTile icon="clock" tint={theme.tintGreen} color={palette.green} />
          <View style={{ flex: 1 }}><T style={{ fontWeight: '700' }}>View History</T><T style={{ color: theme.sub, fontSize: 12.5 }}>Logs & past updates</T></View>
          <Feather name="chevron-right" size={20} color={theme.mute} />
        </Row>
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}><Kicker>PROJECT COMPLETION</Kicker><T style={{ color: palette.green, fontWeight: '700', fontSize: 12 }}>On Schedule</T></Row>
        <Row gap={8} style={{ marginTop: 6, alignItems: 'baseline' }}><T style={{ fontSize: 34, fontWeight: '800' }}>{site.pct}%</T><T style={{ color: theme.sub }}>of total work</T></Row>
        <View style={{ marginVertical: 10 }}><Progress pct={site.pct} /></View>
        <Row gap={24}>
          <View><Kicker>PHASE</Kicker><T style={{ fontWeight: '800', marginTop: 2 }}>{site.phase}</T></View>
          <View><Kicker>TARGET</Kicker><T style={{ fontWeight: '800', marginTop: 2 }}>{site.target}</T></View>
        </Row>
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Row gap={8}><Icon name="clipboard" size={17} color={palette.primary} /><T style={{ fontWeight: '800', fontSize: 16 }}>Today&apos;s Tasks</T></Row>
          <T style={{ color: palette.amber, fontWeight: '700', fontSize: 12.5 }}>{pending} pending</T>
        </Row>
        <Row gap={10} style={{ marginVertical: 10 }}>
          <View style={{ flex: 1 }}><Progress pct={(doneCount / TODAY_TASK_COUNT) * 100} color={palette.greenBright} height={6} /></View>
          <T style={{ color: theme.sub, fontSize: 12 }}>{doneCount}/{TODAY_TASK_COUNT} done</T>
        </Row>
        {SUP_TASKS.slice(0, TODAY_TASK_COUNT).map((t, i) => <TaskRow key={t.title} index={i} title={t.title} sub={t.sub} rail={t.rail} />)}
        <Pressable onPress={() => go('sTasks')}><T style={{ color: palette.primary, fontWeight: '700', textAlign: 'center', marginTop: 8 }}>View All Tasks</T></Pressable>
      </Card>
    </>
  );
}

export function SupervisorTasks() {
  const { theme, site, done, startUpdate } = useApp();
  const [filter, setFilter] = useState('Today');
  const visible = SUP_TASKS.map((t, i) => ({ ...t, i })).filter((t) => filter === 'All' || t.when === filter);
  const doneN = visible.filter((t) => done[t.i]).length;
  const pct = visible.length ? Math.round((doneN / visible.length) * 100) : 0;
  return (
    <>
      <View><T style={{ fontSize: 24, fontWeight: '800' }}>Tasks</T><T style={{ color: theme.sub, marginTop: 2 }}>Assigned checks for {site.name}.</T></View>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><T style={{ fontWeight: '700' }}>{doneN} of {visible.length} done</T><T style={{ color: palette.green, fontWeight: '700' }}>{pct}% complete</T></Row>
        <View style={{ marginTop: 10 }}><Progress pct={pct} color={palette.greenBright} /></View>
      </Card>
      <ChipRow>{['Today', 'This Week', 'All'].map((k) => <Chip key={k} label={k} active={filter === k} onPress={() => setFilter(k)} />)}</ChipRow>
      {visible.map((t) => (
        <Card key={t.title} style={{ paddingVertical: 4 }}><TaskRow index={t.i} title={t.title} sub={t.sub} rail={t.rail} due={t.due} /></Card>
      ))}
      {visible.length === 0 && <EmptyState icon="check-square" title="Nothing in this view" body="Switch the filter to see other assigned checks." />}
      <PrimaryButton label="Log Today's Update" icon="camera" onPress={startUpdate} />
    </>
  );
}

export function SupervisorUpdates() {
  const { theme, feed } = useApp();
  const [range, setRange] = useState('All Time');
  const [cat, setCat] = useState('All');
  const [query, setQuery] = useState('');
  const days = range === 'Last 7 Days' ? 7 : range === 'Last 30 Days' ? 30 : 9999;
  const submitted = feed.map((r) => ({
    date: 'TODAY', title: `${r.cat} — ${r.where}`, time: r.when, who: r.by, n: r.photos, days: 0, cat: r.cat,
    status: r.status === 'done' ? 'COMPLETED' : r.status === 'blocked' ? 'BLOCKED' : 'IN PROGRESS',
  }));
  const q = query.trim().toLowerCase();
  const rows = submitted.concat(HISTORY).filter((x) =>
    x.days <= days && (cat === 'All' || x.cat === cat) && (!q || `${x.title} ${x.who} ${x.date} ${x.cat}`.toLowerCase().includes(q)));
  const statusColors = (s: string) =>
    s === 'COMPLETED' ? { bg: theme.tintGreen, fg: palette.green } : s === 'BLOCKED' ? { bg: theme.tintRed, fg: palette.red } : { bg: theme.tintOrange, fg: palette.amber };
  return (
    <>
      <View><T style={{ fontSize: 24, fontWeight: '800' }}>Update History</T><T style={{ color: theme.sub, marginTop: 2 }}>Review daily construction reports and logs.</T></View>
      <Row gap={10} style={{ height: 48, paddingHorizontal: 14, borderRadius: 14, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border }}>
        <Icon name="search" size={17} color={theme.mute} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search by category or date..." placeholderTextColor={theme.mute} style={{ flex: 1, color: theme.text, fontSize: 14.5, padding: 0 }} />
      </Row>
      <ChipRow>{['All Time', 'Last 7 Days', 'Last 30 Days'].map((k) => <Chip key={k} label={k} active={range === k} onPress={() => setRange(k)} />)}</ChipRow>
      <View style={{ gap: 8 }}>
        <Kicker>CATEGORY</Kicker>
        <ChipRow>{HISTORY_CATS.map((k) => <Chip key={k} label={k} active={cat === k} onPress={() => setCat(k)} />)}</ChipRow>
      </View>
      {rows.map((h, i) => {
        const c = statusColors(h.status);
        return (
          <Card key={`${h.date}-${h.title}-${i}`}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Row gap={6}><Icon name="image" size={14} color={theme.sub} /><T style={{ color: theme.sub, fontSize: 11.5, fontWeight: '700' }}>{h.n} PHOTOS</T></Row>
              <Badge label={h.status} bg={c.bg} color={c.fg} />
            </Row>
            <T style={{ color: theme.mute, fontSize: 11.5, fontWeight: '700', marginTop: 8 }}>{h.date}</T>
            <T style={{ fontWeight: '800', fontSize: 16, marginTop: 2 }}>{h.title}</T>
            <Row gap={16} style={{ marginTop: 6 }}>
              <Row gap={5}><Icon name="clock" size={12} color={theme.sub} /><T style={{ color: theme.sub, fontSize: 12.5 }}>{h.time}</T></Row>
              <Row gap={5}><Icon name="user" size={12} color={theme.sub} /><T style={{ color: theme.sub, fontSize: 12.5 }}>{h.who}</T></Row>
            </Row>
          </Card>
        );
      })}
      {rows.length === 0 && <EmptyState icon="search" title="No updates match" body="Try a different range, category or search term." />}
    </>
  );
}

export function SupervisorProfile() {
  const { theme, lang, toggleLang, online, toggleOnline, dark, toggleDark, logout } = useApp();
  return (
    <>
      <Card style={{ alignItems: 'center' }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: theme.tintGreen, alignItems: 'center', justifyContent: 'center' }}><Feather name="user" size={36} color={palette.green} /></View>
        <T style={{ fontSize: 22, fontWeight: '800', marginTop: 10 }}>Vikram Singh</T>
        <T style={{ color: palette.green, fontWeight: '800', fontSize: 11.5, letterSpacing: 1 }}>SITE SUPERVISOR</T>
        <Row gap={12} style={{ marginTop: 14, alignSelf: 'stretch' }}>
          <View style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: theme.field }}><Kicker>ID</Kicker><T style={{ fontWeight: '800', marginTop: 2 }}>SUP-992104</T></View>
          <View style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: theme.field }}><Kicker>CONTACT</Kicker><T style={{ fontWeight: '800', marginTop: 2 }}>98765 43210</T></View>
        </Row>
      </Card>
      <Card>
        <Kicker>PREFERENCES</Kicker>
        <View style={{ marginTop: 12, gap: 16 }}>
          <Row gap={12}>
            <Icon name="globe" size={18} color={theme.sub} /><T style={{ flex: 1, fontWeight: '600' }}>App Language</T>
            <Pressable onPress={toggleLang} accessibilityRole="button" style={{ flexDirection: 'row', padding: 3, borderRadius: 99, backgroundColor: theme.chip }}>
              {(['English', 'हिन्दी'] as const).map((l) => (
                <View key={l} style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99, backgroundColor: lang === l ? palette.primary : 'transparent' }}>
                  <T style={{ color: lang === l ? '#fff' : theme.sub, fontSize: 12.5, fontWeight: '700' }}>{l}</T>
                </View>
              ))}
            </Pressable>
          </Row>
          <Row gap={12}>
            <Icon name="cloud-off" size={18} color={theme.sub} />
            <View style={{ flex: 1 }}><T style={{ fontWeight: '600' }}>Offline Mode</T><T style={{ color: theme.sub, fontSize: 12 }}>Queue updates on device</T></View>
            <Switch on={!online} onPress={toggleOnline} label="Offline mode" />
          </Row>
          <Row gap={12}>
            <Icon name="moon" size={18} color={theme.sub} /><T style={{ flex: 1, fontWeight: '600' }}>Dark Mode</T>
            <Switch on={dark} onPress={toggleDark} label="Dark mode" />
          </Row>
        </View>
      </Card>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><Kicker>ASSIGNED PROJECTS</Kicker><Badge label="3 ACTIVE" bg={theme.tintGreen} color={palette.green} /></Row>
        <View style={{ marginTop: 12, gap: 12 }}>
          {PROJECTS.map((p) => (
            <Row key={p.name} gap={12}>
              <IconTile icon={p.icon} tint={p.tint} color={p.color} size={40} />
              <View style={{ flex: 1 }}><T style={{ fontWeight: '700' }}>{p.name}</T><T style={{ color: theme.sub, fontSize: 12 }}>{p.where}</T></View>
              <Feather name="chevron-right" size={18} color={theme.mute} />
            </Row>
          ))}
        </View>
      </Card>
      <PrimaryButton label="Logout" icon="log-out" bg={palette.red} onPress={logout} />
      <T style={{ color: theme.mute, fontSize: 12, textAlign: 'center' }}>Log out to sign in with a different role{'\n'}Version 4.2.1-stable · © 2026 HomeBuild</T>
    </>
  );
}

function StepHeader({ step, title }: { step: number; title?: string }) {
  const { theme } = useApp();
  return (
    <View style={{ gap: 8 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <T style={{ color: palette.primary, fontWeight: '800' }}>Step {step} of 3</T>
        {title ? <T style={{ color: theme.sub }}>{title}</T> : null}
      </Row>
      <Progress pct={(step / 3) * 100} height={6} />
    </View>
  );
}

export function WizardCategory() {
  const { theme, wizardCat, setWizardCat, go } = useApp();
  return (
    <>
      <StepHeader step={1} />
      <View><T style={{ fontSize: 24, fontWeight: '800' }}>What are you doing today?</T><T style={{ color: theme.sub, marginTop: 4 }}>Select the primary task category for this update.</T></View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {WORK_CATEGORIES.map((c) => {
          const on = wizardCat === c.label;
          return (
            <Pressable key={c.label} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => setWizardCat(c.label)}
              style={{ width: '47.8%', padding: 16, borderRadius: 18, borderWidth: 2, borderColor: on ? palette.primary : theme.border, backgroundColor: on ? theme.tintBlue : theme.card, gap: 6 }}>
              <IconTile icon={c.icon} tint={c.tint} color={c.color} size={40} />
              <T style={{ fontWeight: '800', marginTop: 4 }}>{c.label}</T>
              <T style={{ color: theme.sub, fontSize: 12 }}>{c.sub}</T>
            </Pressable>
          );
        })}
      </View>
      <PrimaryButton label="Next Step" icon="arrow-right" disabled={!wizardCat} onPress={() => go('sNew2', true)} />
    </>
  );
}

export function WizardPhoto() {
  const { theme, wizLocation, setWizLocation, photos, addPhoto, go } = useApp();
  return (
    <>
      <StepHeader step={2} title="Capture Site Condition" />
      <View><T style={{ fontSize: 24, fontWeight: '800' }}>Take a Photo</T><T style={{ color: theme.sub, marginTop: 4 }}>Provide visual proof of the project progress for the daily log. Capture at least one clear photo.</T></View>
      <Kicker>LOCATION ON SITE</Kicker>
      <ChipRow>{LOCATIONS.map((l) => <Chip key={l} label={l} active={wizLocation === l} onPress={() => setWizLocation(l)} />)}</ChipRow>
      <Pressable onPress={addPhoto} accessibilityRole="button" style={{ height: 150, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed', borderColor: palette.primary, backgroundColor: theme.tintBlue, alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Feather name="camera" size={30} color={palette.primary} />
        <T style={{ color: palette.primary, fontWeight: '800' }}>Tap to Camera</T>
        <T style={{ color: theme.sub, fontSize: 12.5 }}>{photos} captured</T>
      </Pressable>
      <Row gap={10}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ flex: 1, height: 76, borderRadius: 14, backgroundColor: photos > i ? theme.tintBlue : theme.chip, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="image" size={22} color={photos > i ? palette.primary : theme.mute} />
          </View>
        ))}
      </Row>
      <PrimaryButton label="Next Step" icon="chevron-right" disabled={photos === 0} onPress={() => go('sNew3', true)} />
    </>
  );
}

export function WizardVoice() {
  const { theme, wizStatus, setWizStatus, recording, recorded, toggleRec, submitUpdate } = useApp();
  return (
    <>
      <StepHeader step={3} title="Record Description" />
      <View><T style={{ fontSize: 24, fontWeight: '800' }}>Press and Speak</T><T style={{ color: theme.sub, marginTop: 4 }}>Describe the construction progress or any issues found today.</T></View>
      <Kicker>WORK STATUS</Kicker>
      <Row gap={8}>
        {WORK_STATUS.map((w) => {
          const on = wizStatus === w.id;
          return (
            <Pressable key={w.id} onPress={() => setWizStatus(w.id)} style={{ flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 12, borderWidth: 1.5, borderColor: on ? w.color : theme.border, backgroundColor: on ? w.bg : theme.field }}>
              <T style={{ color: on ? w.color : theme.sub, fontWeight: on ? '700' : '500', fontSize: 13 }}>{w.label}</T>
            </Pressable>
          );
        })}
      </Row>
      <View style={{ alignItems: 'center', gap: 14, paddingVertical: 20 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Record voice note" onPress={toggleRec}
          style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: recording ? palette.red : palette.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="mic" size={36} color="#fff" />
        </Pressable>
        <T style={{ color: theme.sub, fontWeight: '700', letterSpacing: 0.8, fontSize: 12 }}>
          {recording ? 'RECORDING… TAP TO STOP' : recorded ? 'RECORDED · TAP TO REDO' : 'TAP TO START'}
        </T>
      </View>
      <PrimaryButton label="Finish & Submit" icon="check-circle" bg={recorded ? palette.greenDeep : '#8FB9A4'} disabled={!recorded} onPress={submitUpdate} />
    </>
  );
}

export function WizardDone() {
  const { theme, online, photos, go } = useApp();
  return (
    <View style={{ alignItems: 'center', gap: 12, paddingTop: 24 }}>
      <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: online ? '#7EE6A9' : theme.tintOrange, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name={online ? 'check' : 'cloud-off'} size={42} color={online ? palette.greenDeep : palette.amber} />
      </View>
      <T style={{ fontSize: 22, fontWeight: '800', textAlign: 'center' }}>{online ? 'Update Submitted Successfully' : 'Saved On This Device'}</T>
      <T style={{ color: theme.sub, textAlign: 'center', lineHeight: 21, paddingHorizontal: 12 }}>
        {online
          ? 'Your project progress has been documented and synced with the cloud.'
          : 'No connection right now. The update is queued and will sync automatically when you are back online.'}
      </T>
      <Card style={{ alignSelf: 'stretch', marginTop: 8, gap: 12 }}>
        <Row style={{ justifyContent: 'space-between' }}><Row gap={8}><Icon name="clock" size={15} color={theme.sub} /><T style={{ color: theme.sub }}>Submission time</T></Row><T style={{ fontWeight: '700' }}>{new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</T></Row>
        <Row style={{ justifyContent: 'space-between' }}><Row gap={8}><Icon name="image" size={15} color={theme.sub} /><T style={{ color: theme.sub }}>{Math.max(1, photos)} Photo{photos > 1 ? 's' : ''} uploaded</T></Row></Row>
      </Card>
      <PrimaryButton label="Return to Dashboard" icon="arrow-right" onPress={() => go('sHome')} style={{ alignSelf: 'stretch', marginTop: 8 }} />
      <OutlineButton label="View Submission Receipt" onPress={() => go('sUpdates')} style={{ alignSelf: 'stretch' }} />
    </View>
  );
}

export function SiteSheet() {
  const { theme, siteSheet, setSiteSheet, siteIdx, setSiteIdx } = useApp();
  return (
    <Modal visible={siteSheet} transparent animationType="slide" onRequestClose={() => setSiteSheet(false)}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(15,20,30,0.45)', justifyContent: 'flex-end' }} onPress={() => setSiteSheet(false)}>
        <Pressable style={{ backgroundColor: theme.card, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, paddingBottom: 32, gap: 10 }}>
          <T style={{ fontSize: 20, fontWeight: '800' }}>Switch site</T>
          <T style={{ color: theme.sub }}>You are assigned to {SITES.length} sites.</T>
          {SITES.map((s, i) => {
            const on = i === siteIdx;
            return (
              <Pressable key={s.code} onPress={() => { setSiteIdx(i); setSiteSheet(false); }} accessibilityRole="button"
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 2, borderColor: on ? palette.primary : theme.border, backgroundColor: on ? theme.tintBlue : theme.card }}>
                <Icon name="briefcase" size={18} color={on ? palette.primary : theme.sub} />
                <View style={{ flex: 1 }}><T style={{ fontWeight: '700' }}>{s.name}</T><T style={{ color: theme.sub, fontSize: 12 }}>{s.code} · {s.where}</T></View>
                <Icon name="check-circle" size={20} color={on ? palette.primary : theme.border} />
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
