import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ACTION_ITEMS, DOCS, PLANS, ROOMS, SPEND, TIMELINE, WORK_STATUS } from './data';
import { useApp } from './store';
import { palette } from './theme';
import {
  Badge, Card, Chip, ChipRow, EmptyState, Icon, IconTile, Kicker, OutlineButton, Placeholder, PrimaryButton, Progress, T,
} from './ui';

function Row({ children, gap = 10, style }: { children: React.ReactNode; gap?: number; style?: object }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  const { theme } = useApp();
  return (
    <Card style={{ flex: 1 }}>
      <Kicker>{label}</Kicker>
      <T style={{ fontSize: 22, fontWeight: '800', marginTop: 6, color: color ?? theme.text }}>{value}</T>
      {sub ? <T style={{ color: theme.sub, fontSize: 12, marginTop: 2 }}>{sub}</T> : null}
    </Card>
  );
}

export function CustomerHome() {
  const { go, theme } = useApp();
  const hub = [
    { label: 'DESIGN', icon: 'edit-2' as const, color: '#1D6FE0', route: 'cDesign' as const },
    { label: 'BUILD', icon: 'tool' as const, color: '#0B9A63', route: 'cBuild' as const },
    { label: 'FINANCE', icon: 'credit-card' as const, color: '#D97706', route: 'cFinance' as const },
    { label: 'SCHEDULE', icon: 'calendar' as const, color: '#7C3AED', route: 'cSchedule' as const },
  ];
  const milestones = [
    { title: 'Foundation', sub: 'Completed Nov 12', dot: '#0B9A63', icon: 'check' as const, active: false },
    { title: 'Slab Work', sub: 'Current Phase - 45%', dot: '#0B57D0', icon: 'tool' as const, active: true },
    { title: 'Brick Work', sub: 'Next: Dec 05', dot: '#d8dde5', icon: 'circle' as const, active: false },
  ];
  return (
    <>
      <View>
        <Row gap={6}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#0B9A63' }} /><Kicker>ACTIVE PROJECT</Kicker></Row>
        <T style={{ fontSize: 26, fontWeight: '800', marginTop: 6 }}>Sharma Residence</T>
        <Row gap={6} style={{ marginTop: 4 }}><Icon name="map-pin" size={14} color={theme.sub} /><T style={{ color: theme.sub }}>Sector 45, Gurgaon, India</T></Row>
      </View>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <T style={{ fontWeight: '700', color: palette.primary }}>PLOT HB-9921</T>
          <Badge label="PREMIUM" bg={theme.tintAmber} color={palette.amber} />
        </Row>
        <Row gap={32} style={{ marginTop: 14 }}>
          <View><Kicker>AREA</Kicker><T style={{ fontSize: 22, fontWeight: '800', marginTop: 4 }}>3,200 <T style={{ fontSize: 13, color: theme.sub }}>sqft</T></T></View>
          <View><Kicker>STRUCTURE</Kicker><T style={{ fontSize: 22, fontWeight: '800', marginTop: 4 }}>G+2</T></View>
        </Row>
      </Card>

      <Card style={{ paddingVertical: 18 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {hub.map((n) => (
            <Pressable key={n.label} accessibilityRole="button" onPress={() => go(n.route)} style={{ width: '47.8%', alignItems: 'center', gap: 8, padding: 14, borderRadius: 16, backgroundColor: theme.field }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: n.color, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name={n.icon} size={22} color="#fff" />
              </View>
              <T style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>{n.label}</T>
            </Pressable>
          ))}
        </View>
        <Row style={{ justifyContent: 'center', marginTop: 12 }} gap={8}>
          <Kicker>STATUS</Kicker><T style={{ color: palette.green, fontWeight: '800' }}>On Track</T>
        </Row>
      </Card>

      <Card>
        <Kicker>PHASE MILESTONES</Kicker>
        <View style={{ marginTop: 12, gap: 14 }}>
          {milestones.map((m) => (
            <Row key={m.title} gap={14}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: m.dot, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name={m.icon} size={16} color={m.dot === '#d8dde5' ? '#8b94a3' : '#fff'} />
              </View>
              <View>
                <T style={{ fontWeight: '700', color: m.active ? palette.primary : theme.text }}>{m.title}</T>
                <T style={{ color: theme.sub, fontSize: 12.5 }}>{m.sub}</T>
              </View>
            </Row>
          ))}
        </View>
      </Card>

      <Card onPress={() => go('cFinance')}>
        <Kicker>FINANCE HEALTH</Kicker>
        <Row style={{ justifyContent: 'space-between', marginTop: 8 }}>
          <T style={{ fontSize: 24, fontWeight: '800' }}>₹ 42.5L</T>
          <T style={{ color: palette.green, fontWeight: '700' }}>+2.4% Budget</T>
        </Row>
        <View style={{ marginTop: 10 }}><Progress pct={64} /></View>
      </Card>

      <Row gap={12}>
        <Card style={{ flex: 1 }}>
          <Kicker>OVERALL COMPLETION</Kicker>
          <T style={{ fontSize: 30, fontWeight: '800', marginTop: 6, color: palette.primary }}>65%</T>
          <T style={{ color: theme.sub, fontSize: 12.5 }}>Phases 4 of 7 done</T>
        </Card>
        <Card style={{ flex: 1 }}>
          <Kicker>DAYS REMAINING</Kicker>
          <T style={{ fontSize: 30, fontWeight: '800', marginTop: 6 }}>120 <T style={{ fontSize: 13, color: theme.sub }}>Days</T></T>
          <Row gap={4}><Icon name="alert-triangle" size={12} color={palette.orange} /><T style={{ color: palette.orange, fontSize: 12 }}>+4 Day delay in Slab Work</T></Row>
        </Card>
      </Row>

      <Card onPress={() => go('cBuild')}>
        <Kicker>CURRENT ACTIVITY</Kicker>
        <T style={{ fontSize: 22, fontWeight: '800', marginTop: 6 }}>Slab Work</T>
        <Row gap={6} style={{ marginTop: 6 }}><Icon name="users" size={15} color={theme.sub} /><T style={{ color: theme.sub }}>12 Laborers Active</T></Row>
      </Card>
      <PrimaryButton label="Daily Site Log" icon="camera" onPress={() => go('cBuild')} />
    </>
  );
}

export function CustomerDesign() {
  const { go, theme } = useApp();
  const [tab, setTab] = useState<keyof typeof PLANS>('AI Recommended');
  const plan = PLANS[tab];
  return (
    <>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><Kicker>ACTIVE SITE</Kicker><Badge label="VERIFIED" bg={theme.tintGreen} color={palette.green} /></Row>
        <T style={{ fontSize: 22, fontWeight: '800', marginTop: 6 }}>Plot HB-9921</T>
        <Row gap={24} style={{ marginTop: 12 }}>
          <View><Row gap={5}><Icon name="maximize" size={13} color={theme.sub} /><T style={{ color: theme.sub, fontSize: 12 }}>Area</T></Row><T style={{ fontWeight: '700' }}>2,400 sq. ft.</T></View>
          <View><Row gap={5}><Icon name="map-pin" size={13} color={theme.sub} /><T style={{ color: theme.sub, fontSize: 12 }}>Location</T></Row><T style={{ fontWeight: '700' }}>New Delhi, IN</T></View>
        </Row>
        <Row style={{ justifyContent: 'space-between', marginTop: 12 }}>
          <T style={{ color: theme.sub, fontSize: 12.5 }}>Design Phase: Iteration</T>
          <T style={{ color: palette.primary, fontWeight: '600', fontSize: 12.5 }}>Edit Plot</T>
        </Row>
      </Card>
      <ChipRow>{(Object.keys(PLANS) as (keyof typeof PLANS)[]).map((k) => <Chip key={k} label={k} active={tab === k} onPress={() => setTab(k)} />)}</ChipRow>
      <Row style={{ justifyContent: 'space-between' }}>
        <T style={{ fontSize: 18, fontWeight: '800' }}>AI Generated Plans</T>
        <T style={{ color: palette.primary, fontWeight: '600', fontSize: 12.5 }}>3 Models Ready</T>
      </Row>
      <Card>
        <Placeholder icon="layout" height={170} />
        <T style={{ marginTop: 10, fontWeight: '800', letterSpacing: 0.6 }}>{plan.label}</T>
        <Row gap={12} style={{ marginTop: 12 }}>
          <View style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: theme.field }}><Kicker>VASTU SCORE</Kicker><T style={{ fontSize: 20, fontWeight: '800', marginTop: 4 }}>{plan.vastu}</T></View>
          <View style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: theme.field }}><Kicker>EFFICIENCY</Kicker><T style={{ fontSize: 20, fontWeight: '800', marginTop: 4 }}>{plan.eff}</T></View>
        </Row>
        <Row style={{ justifyContent: 'space-between', marginTop: 14 }}>
          <View><T style={{ color: theme.sub, fontSize: 12.5 }}>Estimated Cost</T><T style={{ fontSize: 20, fontWeight: '800' }}>{plan.cost}</T></View>
          <PrimaryButton label="Select Plan" onPress={() => go('cDesignDetail', true)} style={{ height: 44, paddingHorizontal: 18 }} />
        </Row>
      </Card>
      <Card onPress={() => go('cDesignDetail', true)}>
        <Row gap={14}><IconTile icon="bar-chart-2" tint={theme.tintBlue} color={palette.primary} /><View style={{ flex: 1 }}><T style={{ fontWeight: '700' }}>Cost Optimizer</T><T style={{ color: theme.sub, fontSize: 12.5 }}>Compare materials across plans.</T></View></Row>
      </Card>
      <Card onPress={() => go('cDesignDetail', true)}>
        <Row gap={14}><IconTile icon="box" tint={theme.tintPurple} color="#5B3FD1" /><View style={{ flex: 1 }}><T style={{ fontWeight: '700' }}>3D Walkthrough</T><T style={{ color: theme.sub, fontSize: 12.5 }}>Preview Plan A in immersive 3D.</T></View></Row>
      </Card>
    </>
  );
}

export function CustomerDesignDetail() {
  const { theme } = useApp();
  const [tab, setTab] = useState('Modern AI');
  const vastu = [
    { icon: 'sun' as const, title: 'Pooja Room (Ishanya)', body: 'Perfectly placed in the North-East corner for maximum spiritual energy.' },
    { icon: 'home' as const, title: 'Master Bedroom (Nairutya)', body: 'South-West placement ensures stability and prosperity for the head of house.' },
    { icon: 'alert-triangle' as const, title: 'Staircase Suggestion', body: 'Current anti-clockwise direction.' },
  ];
  return (
    <>
      <ChipRow>{['Modern AI', 'Traditional', 'Minimal'].map((k) => <Chip key={k} label={k} active={tab === k} onPress={() => setTab(k)} />)}</ChipRow>
      <Card>
        <Placeholder icon="layout" height={220} />
        <Row gap={8} style={{ marginTop: 10 }}><Icon name="compass" size={15} color={theme.sub} /><Kicker>VASTU ORIENT</Kicker><T style={{ fontWeight: '800' }}>N-E</T></Row>
      </Card>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {ROOMS.map((r) => (
          <Card key={r.name} style={{ width: '47.8%' }}>
            <T style={{ color: theme.sub, fontSize: 12.5 }}>{r.name}</T>
            <T style={{ fontSize: 18, fontWeight: '800', marginTop: 2 }}>{r.val}</T>
            <Row gap={5} style={{ marginTop: 4 }}><Icon name={r.icon} size={13} color={r.noteColor} /><T style={{ color: r.noteColor, fontSize: 12 }}>{r.note}</T></Row>
          </Card>
        ))}
      </View>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><Kicker>ESTIMATED CONSTRUCTION COST</Kicker><Badge label="LIVE" bg={theme.tintGreen} color={palette.green} /></Row>
        <T style={{ fontSize: 28, fontWeight: '800', marginTop: 8 }}>₹78.4 Lakhs</T>
        <T style={{ color: theme.sub, fontSize: 12.5 }}>Approx. ₹3,200 / sqft in Delhi NCR</T>
        <View style={{ marginTop: 14, gap: 12 }}>
          <View style={{ gap: 6 }}><Row style={{ justifyContent: 'space-between' }}><T>Civil & Structure</T><T style={{ fontWeight: '700' }}>₹42.5 L</T></Row><Progress pct={54} /></View>
          <View style={{ gap: 6 }}><Row style={{ justifyContent: 'space-between' }}><T>Finishing & Interiors</T><T style={{ fontWeight: '700' }}>₹35.9 L</T></Row><Progress pct={46} color="#7C3AED" /></View>
        </View>
        <OutlineButton label="Download Full Quotation" icon="download" onPress={() => {}} style={{ marginTop: 14 }} />
      </Card>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><T style={{ fontSize: 17, fontWeight: '800' }}>Vastu Compliance</T><Badge label="94%" bg={theme.tintGreen} color={palette.green} /></Row>
        <View style={{ marginTop: 12, gap: 14 }}>
          {vastu.map((v) => (
            <Row key={v.title} gap={12} style={{ alignItems: 'flex-start' }}>
              <IconTile icon={v.icon} tint={theme.tintBlue} color={palette.primary} size={38} />
              <View style={{ flex: 1 }}><T style={{ fontWeight: '700' }}>{v.title}</T><T style={{ color: theme.sub, fontSize: 12.5, marginTop: 2 }}>{v.body}</T></View>
            </Row>
          ))}
        </View>
      </Card>
      <Row gap={12}>
        <OutlineButton label="Edit Plan" icon="edit-2" onPress={() => {}} style={{ flex: 1 }} />
        <OutlineButton label="Share PDF" icon="share-2" onPress={() => {}} style={{ flex: 1 }} />
      </Row>
    </>
  );
}

export function CustomerBuild() {
  const { go, theme, feed } = useApp();
  const phases = [
    { label: 'Foundation', done: true }, { label: 'Masonry', done: true },
    { label: 'Roofing', current: true }, { label: 'Finishing' },
  ] as { label: string; done?: boolean; current?: boolean }[];
  return (
    <>
      <Card>
        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View><T style={{ color: theme.sub }}>Overall Completion</T><T style={{ fontSize: 34, fontWeight: '800', color: palette.primary }}>65%</T></View>
          <View style={{ alignItems: 'flex-end' }}><T style={{ fontWeight: '800', fontSize: 12 }}>PHASE 3: STRUCTURAL</T><T style={{ color: theme.sub, fontSize: 12 }}>Est. Completion: Oct 2026</T></View>
        </Row>
        <View style={{ marginVertical: 12 }}><Progress pct={65} /></View>
        <Row style={{ justifyContent: 'space-between' }}>
          {phases.map((p) => (
            <Row key={p.label} gap={4}>
              <Icon name={p.done ? 'check' : p.current ? 'disc' : 'circle'} size={13} color={p.done ? palette.greenBright : p.current ? palette.primary : theme.mute} />
              <T style={{ fontSize: 11.5, color: p.done || p.current ? theme.text : theme.mute }}>{p.label}</T>
            </Row>
          ))}
        </Row>
      </Card>
      <Row gap={12}>
        <Stat label="QUALITY STATUS" value="Verified" sub="Last audit: 2 hours ago" color={palette.green} />
        <Stat label="ON-SITE CREW" value="12 Workers" sub="Shift: 08:00 - 18:00" />
      </Row>
      <Stat label="SAFETY INCIDENTS" value="0 Today" sub="142 Days incident free" />
      <Row style={{ justifyContent: 'space-between' }}>
        <T style={{ fontSize: 18, fontWeight: '800' }}>Daily Site Updates</T>
        <Pressable onPress={() => go('cBuildUpdate', true)}><T style={{ color: palette.primary, fontWeight: '700' }}>View All</T></Pressable>
      </Row>
      {feed.map((u) => {
        const w = WORK_STATUS.find((x) => x.id === u.status) ?? WORK_STATUS[0];
        return (
          <Card key={u.token} onPress={() => go('cBuildUpdate', true)}>
            <Row style={{ justifyContent: 'space-between' }}><T style={{ color: palette.green, fontWeight: '800', fontSize: 11.5 }}>NEW · {u.when}</T><Badge label={w.label.toUpperCase()} bg={w.bg} color={w.color} /></Row>
            <T style={{ fontWeight: '700', marginTop: 6 }}>{u.cat} — {u.where}</T>
            <Row gap={16} style={{ marginTop: 6 }}>
              <Row gap={5}><Icon name="user" size={13} color={theme.sub} /><T style={{ color: theme.sub, fontSize: 12.5 }}>{u.by}</T></Row>
              <Row gap={5}><Icon name="image" size={13} color={theme.sub} /><T style={{ color: theme.sub, fontSize: 12.5 }}>{u.photos} photos</T></Row>
            </Row>
          </Card>
        );
      })}
      {[
        { when: 'Yesterday', title: 'Exterior Masonry Complete', body: 'Final brickwork on the north facade has been finished and cleaned.' },
        { when: 'Aug 12, 2024', title: 'Electrical Rough-in Done', body: 'All primary electrical lines for the ground floor have been successfully laid.' },
      ].map((u) => (
        <Card key={u.title} onPress={() => go('cBuildUpdate', true)} style={{ padding: 0, overflow: 'hidden' }}>
          <Placeholder height={120} style={{ borderRadius: 0 }} />
          <View style={{ padding: 14 }}>
            <T style={{ color: theme.sub, fontSize: 12 }}>{u.when}</T>
            <T style={{ fontWeight: '800', fontSize: 16, marginTop: 2 }}>{u.title}</T>
            <T style={{ color: theme.sub, marginTop: 4 }}>{u.body}</T>
          </View>
        </Card>
      ))}
    </>
  );
}

export function CustomerBuildUpdate() {
  const { theme } = useApp();
  return (
    <>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><Badge label="CIVIL" bg={theme.tintBlue} color={palette.primary} /><T style={{ color: theme.sub, fontSize: 12.5 }}>Oct 24, 2026</T></Row>
        <T style={{ fontSize: 20, fontWeight: '800', marginTop: 8 }}>Site Update: Level 2 Slab</T>
        <Row gap={5} style={{ marginTop: 4 }}><Icon name="map-pin" size={13} color={theme.sub} /><T style={{ color: theme.sub }}>Sector 45, Gurgaon</T></Row>
      </Card>
      <View>
        <Placeholder height={200} />
        <View style={{ position: 'absolute', left: 14, bottom: 12 }}>
          <T style={{ fontWeight: '800' }}>Live View</T><T style={{ color: theme.sub, fontSize: 12.5 }}>Reinforcement Grid Layout · Updated 2h ago</T>
        </View>
      </View>
      <Card>
        <Row gap={12}><IconTile icon="users" tint={theme.tintBlue} color={palette.primary} /><View><T style={{ fontWeight: '700' }}>Rajesh Kumar</T><T style={{ color: theme.sub, fontSize: 12.5 }}>Site Supervisor</T></View></Row>
        <T style={{ marginTop: 12, lineHeight: 21, color: theme.sub }}>
          “Rebar placement for second floor slab completed. Quality check passed. Electrical conduits are being positioned now. Concrete pouring scheduled for tomorrow 08:00 AM.”
        </T>
        <Row style={{ justifyContent: 'space-between', marginTop: 12 }}>
          <Row gap={6}><Icon name="award" size={15} color={palette.green} /><T style={{ color: palette.green, fontWeight: '700' }}>QC Approved</T></Row>
          <T style={{ color: palette.primary, fontWeight: '700' }}>View Report</T>
        </Row>
      </Card>
      <T style={{ fontSize: 18, fontWeight: '800' }}>Daily Progress Evolution</T>
      <Row gap={12}>
        <View style={{ flex: 1, gap: 6 }}><Placeholder height={130} /><T style={{ fontSize: 11, fontWeight: '700', color: theme.sub }}>BEFORE (Yesterday)</T></View>
        <View style={{ flex: 1, gap: 6 }}><Placeholder height={130} /><T style={{ fontSize: 11, fontWeight: '700', color: theme.sub }}>AFTER (Today)</T></View>
      </Row>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <Card style={{ width: '47.8%' }}><Kicker>COMPLETION</Kicker><T style={{ fontSize: 22, fontWeight: '800', marginTop: 4 }}>42%</T><T style={{ color: palette.green, fontSize: 12 }}>+4% today</T><View style={{ marginTop: 8 }}><Progress pct={42} /></View></Card>
        <Card style={{ width: '47.8%' }}><Kicker>BUDGET USED</Kicker><T style={{ fontSize: 22, fontWeight: '800', marginTop: 4 }}>₹24.8L</T><T style={{ color: palette.green, fontSize: 12 }}>On track</T></Card>
        <Card style={{ width: '47.8%' }}><Kicker>SAFETY STATUS</Kicker><T style={{ fontSize: 22, fontWeight: '800', marginTop: 4, color: palette.green }}>Safe</T></Card>
        <Card style={{ width: '47.8%' }}><Kicker>MATERIALS</Kicker><T style={{ fontSize: 22, fontWeight: '800', marginTop: 4 }}>Available</T></Card>
      </View>
    </>
  );
}

export function CustomerFinance() {
  const { go, theme } = useApp();
  return (
    <>
      <Card>
        <Kicker>TOTAL PROJECT BUDGET</Kicker>
        <T style={{ fontSize: 38, fontWeight: '800', marginTop: 6 }}>₹75.0 <T style={{ fontSize: 18, color: theme.sub }}>L</T></T>
        <View style={{ marginVertical: 12 }}><Progress pct={64} /></View>
        <Row gap={12}>
          <View style={{ flex: 1 }}><T style={{ color: theme.sub, fontSize: 12.5 }}>Spent to Date</T><T style={{ fontSize: 20, fontWeight: '800' }}>₹48.0L</T></View>
          <View style={{ flex: 1 }}><T style={{ color: theme.sub, fontSize: 12.5 }}>Remaining</T><T style={{ fontSize: 20, fontWeight: '800', color: palette.green }}>₹27.0L</T></View>
        </Row>
      </Card>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><T style={{ fontSize: 17, fontWeight: '800' }}>Spending Breakdown</T><T style={{ color: palette.primary, fontWeight: '600', fontSize: 12.5 }}>Detailed PDF</T></Row>
        <View style={{ marginTop: 14, gap: 16 }}>
          {SPEND.map((r) => (
            <View key={r.name} style={{ gap: 6 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <View><T style={{ fontWeight: '700' }}>{r.name}</T><T style={{ color: theme.sub, fontSize: 12 }}>{r.sub}</T></View>
                <T style={{ fontWeight: '800' }}>{r.amt}</T>
              </Row>
              <Progress pct={r.w} color={r.bar} />
            </View>
          ))}
        </View>
      </Card>
      <Card onPress={() => go('cMilestones', true)}>
        <Row gap={14}>
          <IconTile icon="file-text" tint={theme.tintAmber} color={palette.amber} />
          <View style={{ flex: 1 }}><T style={{ fontWeight: '700' }}>Milestone Payments</T><T style={{ color: theme.sub, fontSize: 12.5 }}>1 payment awaiting your approval.</T></View>
          <Feather name="chevron-right" size={20} color={theme.mute} />
        </Row>
      </Card>
    </>
  );
}

export function CustomerMilestones() {
  const { theme, approved, approvePayment, back } = useApp();
  return (
    <>
      <View>
        <T style={{ fontSize: 24, fontWeight: '800' }}>Milestone Payments</T>
        <T style={{ color: theme.sub, marginTop: 4, lineHeight: 20 }}>Track your construction progress and authorize secure payments for your project HB-9921.</T>
      </View>
      <Row gap={12}>
        <Stat label="TOTAL DISBURSED" value="₹42,50,000" />
        <Stat label="NEXT DUE" value="₹12,75,000" />
      </Row>
      <Card>
        <Badge label={approved ? 'PAID' : 'AWAITING YOUR RELEASE'} bg={approved ? theme.tintGreen : theme.tintAmber} color={approved ? palette.green : palette.amber} />
        <Row gap={12} style={{ marginTop: 12 }}>
          <IconTile icon="edit-2" tint={theme.tintBlue} color={palette.primary} />
          <View style={{ flex: 1 }}>
            <T style={{ fontWeight: '800', fontSize: 16 }}>Slab Casting & Beam Reinforcement</T>
            <T style={{ color: theme.sub, fontSize: 12.5 }}>Phase 2 of 5 • Scheduled completion: Oct 24, 2026</T>
          </View>
        </Row>
        <View style={{ marginTop: 14, gap: 10 }}>
          <Row style={{ justifyContent: 'space-between' }}><T style={{ color: theme.sub }}>Milestone Amount</T><T style={{ fontWeight: '800' }}>₹12,75,000</T></Row>
          <Row style={{ justifyContent: 'space-between' }}><T style={{ color: theme.sub }}>Verification Status</T><Row gap={5}><Icon name="award" size={14} color={palette.green} /><T style={{ color: palette.green, fontWeight: '700' }}>Site Inspected</T></Row></Row>
          <Row style={{ justifyContent: 'space-between' }}><T style={{ color: theme.sub }}>Due Date</T><T style={{ fontWeight: '700' }}>In 3 Days</T></Row>
        </View>
        <PrimaryButton
          label={approved ? 'Payment Authorized' : 'Approve Payment'}
          icon={approved ? 'check-circle' : 'credit-card'}
          bg={approved ? palette.greenDeep : palette.primary}
          onPress={approvePayment}
          style={{ marginTop: 16 }}
        />
        <OutlineButton label="View Site Reports" onPress={back} style={{ marginTop: 10 }} />
      </Card>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><IconTile icon="layers" tint={theme.tintGreen} color={palette.green} size={38} /><Badge label="PAID" bg={theme.tintGreen} color={palette.green} /></Row>
        <T style={{ fontWeight: '800', marginTop: 10 }}>Excavation & Foundation</T>
        <T style={{ color: theme.sub, fontSize: 12.5 }}>Completed on Sep 12, 2026</T>
        <Row gap={6} style={{ marginTop: 8 }}><Icon name="file-text" size={13} color={theme.sub} /><T style={{ color: theme.sub, fontSize: 12.5 }}>Transaction: #TXN-90211</T></Row>
      </Card>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><IconTile icon="home" tint={theme.chip} color={theme.sub} size={38} /><Badge label="UPCOMING" bg={theme.chip} color={theme.sub} /></Row>
        <T style={{ fontWeight: '800', marginTop: 10 }}>Roofing & External Walls</T>
        <T style={{ color: theme.sub, fontSize: 12.5 }}>Estimated: Nov 15, 2026</T>
        <Row gap={6} style={{ marginTop: 8 }}><Icon name="credit-card" size={13} color={theme.sub} /><T style={{ color: theme.sub, fontSize: 12.5 }}>Est: ₹18,00,000</T></Row>
      </Card>
      <Card>
        <T style={{ fontWeight: '800' }}>Overall Progress</T>
        <Row gap={14} style={{ marginTop: 10 }}>
          <T style={{ fontSize: 30, fontWeight: '800', color: palette.primary }}>40%</T>
          <View style={{ flex: 1 }}><Progress pct={40} /><T style={{ color: theme.sub, fontSize: 11, marginTop: 4 }}>PHASE 2/5</T></View>
        </Row>
        <T style={{ color: theme.sub, marginTop: 8 }}>Next verification visit scheduled for tomorrow, 10:00 AM.</T>
      </Card>
      <Card style={{ backgroundColor: theme.tintBlue, borderColor: theme.tintBlue }}>
        <Row gap={8}><Icon name="shield" size={16} color={palette.primary} /><T style={{ fontWeight: '800' }}>HomeBuild Secure Pay</T></Row>
        <T style={{ color: theme.sub, marginTop: 6, lineHeight: 20 }}>Funds are held in an account and only released when you approve the milestone completion verified by a third-party engineer.</T>
        <Row gap={6} style={{ marginTop: 8 }}><Icon name="lock" size={13} color={palette.primary} /><T style={{ color: palette.primary, fontSize: 11, fontWeight: '800' }}>256-BIT ENCRYPTION</T></Row>
      </Card>
      <Card style={{ alignItems: 'center' }}>
        <Icon name="key" size={22} color={palette.primary} />
        <T style={{ fontWeight: '800', marginTop: 6 }}>Final Handover</T>
        <T style={{ color: theme.sub, fontSize: 12.5 }}>Expected completion: March 2027</T>
      </Card>
    </>
  );
}

export function CustomerSchedule() {
  const { theme } = useApp();
  const [zoom, setZoom] = useState('Month');
  return (
    <>
      <View>
        <T style={{ fontSize: 26, fontWeight: '800' }}>Schedule</T>
        <T style={{ color: theme.sub, marginTop: 4, lineHeight: 20 }}>Real-time construction roadmap for Project HB-9921. Monitoring the bridge between planned milestones and actual progress.</T>
        <Row gap={6} style={{ marginTop: 10 }}><Badge label="3 DAYS AHEAD" bg={theme.tintGreen} color={palette.green} /></Row>
        <T style={{ color: theme.sub, marginTop: 8 }}>Expected Completion: <T style={{ fontWeight: '800' }}>March 2027</T></T>
      </View>
      <Card>
        <T style={{ color: theme.sub }}>Total Progress</T>
        <Row gap={10}><T style={{ fontSize: 30, fontWeight: '800' }}>64%</T><T style={{ color: palette.green, fontWeight: '700' }}>+4% this week</T></Row>
        <View style={{ marginTop: 8 }}><Progress pct={64} color={palette.purple} /></View>
      </Card>
      <Card><T style={{ color: theme.sub }}>Current Phase</T><T style={{ fontSize: 20, fontWeight: '800' }}>First Floor Slab</T><Row gap={6} style={{ marginTop: 4 }}><Icon name="tool" size={14} color={palette.purple} /><T style={{ color: palette.purple }}>Active: Reinforcement Work</T></Row></Card>
      <Card><T style={{ color: theme.sub }}>Upcoming Milestone</T><T style={{ fontSize: 20, fontWeight: '800' }}>Roofing & Sealing</T><Row style={{ justifyContent: 'space-between', marginTop: 4 }}><T style={{ color: theme.sub, fontSize: 12.5 }}>Critical path item</T><T style={{ color: palette.orange, fontWeight: '700', fontSize: 12.5 }}>Starts in 12 days</T></Row></Card>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><T style={{ fontSize: 17, fontWeight: '800' }}>Project Timeline</T><Row gap={10}><Row gap={4}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#DFE3EA' }} /><T style={{ fontSize: 11 }}>Planned</T></Row><Row gap={4}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#8B5CF6' }} /><T style={{ fontSize: 11 }}>Actual</T></Row></Row></Row>
        <View style={{ marginTop: 10 }}><ChipRow>{['Week', 'Month', 'Quarter'].map((k) => <Chip key={k} label={k} active={zoom === k} accent={palette.purple} onPress={() => setZoom(k)} />)}</ChipRow></View>
        <View style={{ marginTop: 14, gap: 14 }}>
          {TIMELINE.map((t) => (
            <View key={t.name} style={{ gap: 6 }}>
              <Row style={{ justifyContent: 'space-between' }}><T style={{ fontWeight: '700', fontSize: 13 }}>{t.name}</T><T style={{ color: t.color, fontSize: 12, fontWeight: '600' }}>{t.state}</T></Row>
              <View style={{ height: 10, borderRadius: 99, backgroundColor: theme.chip }}>
                <View style={{ position: 'absolute', left: `${t.left}%`, width: `${t.width}%`, height: 10, borderRadius: 99, backgroundColor: t.bar }} />
              </View>
            </View>
          ))}
        </View>
      </Card>
      <T style={{ fontSize: 18, fontWeight: '800' }}>Schedule Details</T>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><T style={{ fontWeight: '800' }}>Immediate Action Items</T><Icon name="check-circle" size={18} color={palette.purple} /></Row>
        <View style={{ marginTop: 12, gap: 12 }}>
          {ACTION_ITEMS.map((a) => (
            <Row key={a.n} gap={12}>
              <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: theme.tintPurple, alignItems: 'center', justifyContent: 'center' }}><T style={{ fontWeight: '800', color: palette.purple, fontSize: 12 }}>{a.n}</T></View>
              <T style={{ flex: 1, color: a.dim ? theme.mute : theme.text, fontWeight: '600' }}>{a.title}</T>
              <T style={{ color: theme.sub, fontSize: 12.5 }}>{a.when}</T>
            </Row>
          ))}
        </View>
      </Card>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><T style={{ fontWeight: '800' }}>Timeline Reports</T><Icon name="folder" size={18} color={theme.sub} /></Row>
        <T style={{ color: theme.sub, marginTop: 6 }}>Download detailed breakdown of variances and monthly site supervisor logs.</T>
        <OutlineButton label="Monthly Progress Report (May)" icon="download" onPress={() => {}} style={{ marginTop: 12 }} />
      </Card>
    </>
  );
}

export function NotificationList({ supervisor }: { supervisor: boolean }) {
  const { theme, customerNotifs, supervisorNotifs, dismiss, supDismiss } = useApp();
  const list = supervisor ? supervisorNotifs : customerNotifs;
  const drop = supervisor ? supDismiss : dismiss;
  return (
    <>
      <Row style={{ justifyContent: 'space-between' }}>
        <T style={{ fontSize: 24, fontWeight: '800' }}>Notifications</T>
        <T style={{ color: palette.primary, fontWeight: '700' }}>{list.length} {supervisor ? 'New' : list.length === 1 ? 'New Alert' : 'New Alerts'}</T>
      </Row>
      {list.map((n) => (
        <Card key={n.id}>
          <Row gap={12} style={{ alignItems: 'flex-start' }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: n.tint, alignItems: 'center', justifyContent: 'center' }}><Feather name={n.icon} size={18} color={n.accent} /></View>
            <View style={{ flex: 1 }}>
              <Row style={{ justifyContent: 'space-between' }}><T style={{ fontWeight: '800', flex: 1 }}>{n.kind}</T><T style={{ color: theme.mute, fontSize: 11.5 }}>{n.when}</T></Row>
              <T style={{ color: theme.sub, marginTop: 4, lineHeight: 20 }}>{n.body}</T>
              {supervisor && <Pressable onPress={() => drop(n.id)}><T style={{ color: palette.primary, fontWeight: '700', marginTop: 8 }}>Mark read</T></Pressable>}
            </View>
          </Row>
          {!supervisor && n.cta ? (
            <Row gap={10} style={{ marginTop: 12 }}>
              <PrimaryButton label={n.cta} bg={n.accent} onPress={() => drop(n.id)} style={{ flex: 1, height: 44 }} />
              {n.second ? <OutlineButton label={n.second} onPress={() => drop(n.id)} style={{ flex: 1, height: 44 }} /> : null}
            </Row>
          ) : null}
          {!supervisor && n.photos ? (
            <Row gap={8} style={{ marginTop: 12 }}>
              <Placeholder height={64} style={{ flex: 1 }} /><Placeholder height={64} style={{ flex: 1 }} />
              <View style={{ flex: 1, height: 64, borderRadius: 16, backgroundColor: theme.chip, alignItems: 'center', justifyContent: 'center' }}><T style={{ fontWeight: '700', color: theme.sub }}>+{Math.max(1, n.photos)} More</T></View>
            </Row>
          ) : null}
        </Card>
      ))}
      {list.length === 0 && (
        <EmptyState
          icon="bell"
          title={supervisor ? "You're all caught up" : 'Nothing needs you right now'}
          body={supervisor ? 'New tasks and payment releases will appear here.' : 'Site updates, quality alerts and payment approvals will land here.'}
        />
      )}
    </>
  );
}

export function CustomerProfile() {
  const { theme, logout, accounts } = useApp();
  const me = accounts.find((a) => a.role === 'customer');
  return (
    <>
      <Card style={{ alignItems: 'center' }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: theme.tintBlue, alignItems: 'center', justifyContent: 'center' }}><Feather name="user" size={36} color={palette.primary} /></View>
        <T style={{ fontSize: 22, fontWeight: '800', marginTop: 10 }}>{me?.name ?? 'Ankit Sharma'}</T>
        <T style={{ color: theme.sub }}>Project ID: HB-9921</T>
        <View style={{ alignSelf: 'stretch', marginTop: 14, gap: 12 }}>
          <Row gap={12}><Icon name="map-pin" size={18} color={palette.primary} /><View><T style={{ color: theme.sub, fontSize: 12 }}>Plot Details</T><T style={{ fontWeight: '700' }}>240 Sq Yards, Gurgaon</T></View></Row>
          <Row gap={12}><Icon name="phone" size={18} color={palette.primary} /><View><T style={{ color: theme.sub, fontSize: 12 }}>Contact</T><T style={{ fontWeight: '700' }}>+91 98XXX-X5521</T></View></Row>
        </View>
        <OutlineButton label="Edit Personal Info" onPress={() => {}} style={{ alignSelf: 'stretch', marginTop: 14 }} />
      </Card>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}><Row gap={8}><Icon name="cloud" size={17} color={palette.primary} /><T style={{ fontWeight: '800' }}>Documents Vault</T></Row><Row gap={4}><Icon name="upload" size={14} color={palette.primary} /><T style={{ color: palette.primary, fontWeight: '700', fontSize: 12.5 }}>Upload New</T></Row></Row>
        <View style={{ marginTop: 12, gap: 12 }}>
          {DOCS.map((d) => (
            <Row key={d.name} gap={12}>
              <IconTile icon="file" tint={d.tint} color={d.color} size={38} />
              <View style={{ flex: 1 }}><T style={{ fontWeight: '700' }} numberOfLines={1}>{d.name}</T><T style={{ color: theme.sub, fontSize: 12 }}>{d.meta}</T></View>
            </Row>
          ))}
        </View>
      </Card>
      <PrimaryButton label="Log Out" icon="log-out" bg={palette.red} onPress={logout} />
      <T style={{ color: theme.mute, fontSize: 12, textAlign: 'center' }}>Signed in as Homeowner · HB-9921{'\n'}Log out to sign in with a different role</T>
    </>
  );
}
