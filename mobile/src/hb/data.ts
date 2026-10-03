import type { ComponentProps } from 'react';
import type { Feather } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Feather>['name'];

export type Role = 'customer' | 'supervisor';

export type Account = {
  digits: string;
  phone: string;
  role: Role;
  name: string;
  tag: string;
};

export const ACCOUNTS: Account[] = [
  { digits: '9811125521', phone: '98111 25521', role: 'customer', name: 'Ankit Sharma', tag: 'Homeowner' },
  { digits: '9876543210', phone: '98765 43210', role: 'supervisor', name: 'Vikram Singh', tag: 'Site Supervisor' },
];

export type Site = { code: string; name: string; where: string; pct: number; phase: string; target: string };

/** Mirrors public.site_updates / milestones in the shared Supabase schema. */
export const SITES: Site[] = [
  { code: 'HB-9921', name: 'Sharma Residence', where: 'Sector 45, Gurugram', pct: 65, phase: 'Roofing', target: 'July 2026' },
  { code: 'HB-8814', name: 'Emerald Villa Complex', where: 'Gurugram, Sector 45', pct: 38, phase: 'Masonry', target: 'Nov 2026' },
  { code: 'HB-7702', name: 'Heights Apartment 4B', where: 'Noida, Extension Phase 2', pct: 82, phase: 'Finishing', target: 'Mar 2026' },
];

export type WorkStatusId = 'in_progress' | 'done' | 'blocked';

export const WORK_STATUS: { id: WorkStatusId; label: string; color: string; bg: string }[] = [
  { id: 'in_progress', label: 'In Progress', color: '#0B57D0', bg: '#E4ECFB' },
  { id: 'done', label: 'Done', color: '#0B7A4F', bg: '#D6F5E6' },
  { id: 'blocked', label: 'Blocked', color: '#B91C1C', bg: '#FDE8E6' },
];

export const LOCATIONS = ['Block A - Floor 1', 'Block A - Floor 2', 'Block B', 'Site Boundary', 'Basement'];

export type UpdateRow = {
  token: string;
  cat: string;
  where: string;
  site: string;
  siteCode: string;
  status: WorkStatusId;
  photos: number;
  when: string;
  by: string;
};

export type Notif = {
  id: string;
  kind: string;
  when: string;
  accent: string;
  tint: string;
  icon: IconName;
  body: string;
  cta?: string;
  second?: string;
  photos?: number;
};

export const CUSTOMER_NOTIFS: Notif[] = [
  {
    id: 'q', kind: 'Quality Alert Escalated', when: '10m ago', accent: '#DC2626', tint: '#FEE9E7', icon: 'alert-triangle',
    body: 'Slab pouring in Sector 4 shows potential curing deviation. Requesting immediate supervisor verification.',
    cta: 'Urgent Review', second: 'Dismiss',
  },
  {
    id: 'p', kind: 'Payment Approval Required', when: '2h ago', accent: '#B45309', tint: '#FDF0DC', icon: 'credit-card',
    body: 'Vendor invoice #HB-9921-A for cement procurement (₹1,42,000) is pending your digital signature.',
    cta: 'Authorize Payment',
  },
  {
    id: 's', kind: 'Site Progress Update', when: 'Yesterday', accent: '#0B7A4F', tint: '#D6F5E6', icon: 'tool',
    body: 'Internal electrical conduit installation completed for the first floor. Site photos uploaded to the vault.',
    photos: 3,
  },
];

export const SUPERVISOR_NOTIFS: Notif[] = [
  {
    id: 'task', kind: 'New Task Assigned', when: '25m ago', accent: '#0B57D0', tint: '#E4ECFB', icon: 'clipboard',
    body: 'Project manager assigned "Verify Beam Casting" for Block A - Floor 2. Due today, 11:00 AM.',
  },
  {
    id: 'verify', kind: 'Milestone Verified', when: '3h ago', accent: '#B45309', tint: '#FDF0DC', icon: 'award',
    body: 'Slab Casting & Beam Reinforcement passed PM verification. Waiting on the homeowner to release payment.',
  },
  {
    id: 'ai', kind: 'Fix Assigned By PM', when: 'Yesterday', accent: '#B91C1C', tint: '#FDE8E6', icon: 'alert-triangle',
    body: 'PM reviewed an AI curing-deviation alert on your slab photos and assigned the fix to you. Re-check and log a follow-up update.',
  },
];

export const WORK_CATEGORIES: { label: string; sub: string; icon: IconName; tint: string; color: string }[] = [
  { label: 'Brickwork', sub: 'Walls & masonry', icon: 'grid', tint: '#E4ECFB', color: '#0B57D0' },
  { label: 'Painting', sub: 'Interior & exterior', icon: 'edit-3', tint: '#D6F5E6', color: '#0B7A4F' },
  { label: 'Plumbing', sub: 'Pipes & fixtures', icon: 'droplet', tint: '#FDE8D2', color: '#B45309' },
  { label: 'Electrical', sub: 'Wiring & power', icon: 'zap', tint: '#E7E6FB', color: '#5B3FD1' },
  { label: 'Flooring', sub: 'Tiles & wood', icon: 'layers', tint: '#D6F5E6', color: '#0B7A4F' },
  { label: 'Roofing', sub: 'Structure & tiles', icon: 'home', tint: '#FDE8D2', color: '#B45309' },
];

export const SUP_TASKS = [
  { title: 'Verify Beam Casting', sub: 'Block A - Floor 2', rail: '#1D6FE0', due: 'Due 11:00 AM', when: 'Today' },
  { title: 'Electrical Inspection', sub: 'Master Suite Conduits', rail: '#B45309', due: 'Due 02:30 PM', when: 'Today' },
  { title: 'Labor Safety Audit', sub: 'Entire Site Boundary', rail: '#DC2626', due: 'Due 05:00 PM', when: 'Today' },
  { title: 'Material Delivery Check', sub: 'Cement — 40 bags', rail: '#0B7A4F', due: 'Logged 08:15 AM', when: 'Today' },
  { title: 'Curing Water Log', sub: 'Slab, Floor 2', rail: '#1D6FE0', due: 'Logged 07:40 AM', when: 'This Week' },
];

/** The first three supervisor tasks double as the dashboard's "Today's Tasks". */
export const TODAY_TASK_COUNT = 3;

export const HISTORY = [
  { date: 'OCT 24, 2023', title: 'Brickwork & Masonry', time: '09:30 AM', who: 'Rajesh K.', n: 12, status: 'COMPLETED', days: 1, cat: 'Brickwork' },
  { date: 'OCT 23, 2023', title: 'Foundation Pouring', time: '02:15 PM', who: 'Arun Singh', n: 8, status: 'IN PROGRESS', days: 2, cat: 'Civil' },
  { date: 'OCT 22, 2023', title: 'Electrical Rough-in', time: '11:45 AM', who: 'Vikram J.', n: 5, status: 'COMPLETED', days: 3, cat: 'Electrical' },
  { date: 'OCT 21, 2023', title: 'Roof Truss Installation', time: '04:30 PM', who: 'Rajesh K.', n: 19, status: 'COMPLETED', days: 21, cat: 'Roofing' },
  { date: 'SEP 28, 2023', title: 'Interior Painting', time: '10:05 AM', who: 'Arun Singh', n: 6, status: 'COMPLETED', days: 44, cat: 'Painting' },
  { date: 'SEP 12, 2023', title: 'Plumbing Stack Test', time: '03:20 PM', who: 'Vikram J.', n: 4, status: 'COMPLETED', days: 60, cat: 'Plumbing' },
];

export const HISTORY_CATS = ['All', 'Civil', 'Brickwork', 'Electrical', 'Plumbing', 'Painting', 'Roofing'];

export const PROJECTS: { name: string; where: string; icon: IconName; tint: string; color: string }[] = [
  { name: 'Emerald Villa Complex', where: 'Gurugram, Sector 45', icon: 'edit-2', tint: '#E4ECFB', color: '#0B57D0' },
  { name: 'Heights Apartment 4B', where: 'Noida, Extension Phase 2', icon: 'briefcase', tint: '#D6F5E6', color: '#0B7A4F' },
  { name: 'Riverside Row Houses', where: 'Greater Noida', icon: 'home', tint: '#FDE8D2', color: '#B45309' },
];

export const DOCS = [
  { name: 'Approved Floor Plan_V2.pdf', meta: 'Modified Sep 12, 2026 • 4.2 MB', tint: '#E4ECFB', color: '#0B57D0' },
  { name: 'Structural Stability Report.pdf', meta: 'Modified Aug 28, 2026 • 1.8 MB', tint: '#FDE8D2', color: '#B45309' },
  { name: 'Payment Ledger_Q3.pdf', meta: 'Modified Sep 02, 2026 • 0.9 MB', tint: '#D6F5E6', color: '#0B7A4F' },
];

export const PLANS = {
  'AI Recommended': { label: 'PLAN A: HORIZON', vastu: '95%', eff: '88%', cost: '₹72.4 Lacs' },
  Modern: { label: 'PLAN B: MERIDIAN', vastu: '89%', eff: '94%', cost: '₹81.2 Lacs' },
  Traditional: { label: 'PLAN C: ANGAN', vastu: '98%', eff: '81%', cost: '₹68.9 Lacs' },
};

export const ROOMS: { name: string; val: string; note: string; icon: IconName; noteColor: string }[] = [
  { name: 'Master Bedroom', val: "16' x 14'", note: 'Vastu Compliant', icon: 'check-circle', noteColor: '#0B7A4F' },
  { name: 'Living Area', val: "22' x 18'", note: 'East Facing', icon: 'sun', noteColor: '#0B7A4F' },
  { name: 'Kitchen', val: "12' x 10'", note: 'Agni Corner', icon: 'thermometer', noteColor: '#B45309' },
  { name: 'Total Built-up', val: '2,450 sqft', note: '4 BHK Layout', icon: 'home', noteColor: '#4B5563' },
];

export const TIMELINE = [
  { name: 'Foundation & Earthwork', state: 'Completed', color: '#0B7A4F', left: 4, width: 34, bar: '#5FBF93' },
  { name: 'RCC Frame & Slabs', state: 'In Progress', color: '#7C3AED', left: 30, width: 38, bar: '#8B5CF6' },
  { name: 'Masonry & Plastering', state: 'Upcoming', color: '#8B94A3', left: 52, width: 26, bar: '#DFE3EA' },
  { name: 'Plumbing & Electrical', state: 'Upcoming', color: '#8B94A3', left: 62, width: 24, bar: '#DFE3EA' },
  { name: 'Finishing & Flooring', state: 'Final Phase', color: '#8B94A3', left: 74, width: 22, bar: '#DFE3EA' },
];

export const ACTION_ITEMS = [
  { n: '1', title: 'Slab Reinforcement Audit', when: 'Tomorrow', dim: false },
  { n: '2', title: 'Concrete Pouring (1st Floor)', when: 'Friday', dim: false },
  { n: '3', title: 'Electrical Conduit Laying', when: 'Jul 02', dim: true },
];

export const SPEND = [
  { name: 'Civil Work', sub: 'Foundations, Walls, Slab', amt: '₹30.0L', w: 86, bar: '#0B57D0' },
  { name: 'Electrical & Plumbing', sub: 'Wiring, Fixtures, Piping', amt: '₹5.0L', w: 32, bar: '#D97706' },
  { name: 'Interior Design', sub: 'Modular, Finishes, Paint', amt: '₹13.0L', w: 54, bar: '#7C3AED' },
];
