import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { BrandMark, Card, Icon, PrimaryButton, T } from './ui';
import { useApp } from './store';
import { palette } from './theme';

export function Splash() {
  const { go } = useApp();
  useEffect(() => {
    const t = setTimeout(() => go('login'), 1700);
    return () => clearTimeout(t);
  }, [go]);
  return (
    <View style={[styles.center, { backgroundColor: '#fff' }]}>
      <BrandMark size={74} />
      <T style={{ fontSize: 34, fontWeight: '800', color: '#14181f', marginTop: 24 }}>HomeBuild</T>
      <T style={{ color: '#6b7280', marginTop: 8 }}>Site Management Made Simple</T>
    </View>
  );
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#EEF3FB' }} contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
      <View style={{ alignItems: 'center', paddingTop: 28, paddingBottom: 20 }}>
        <BrandMark size={46} />
        <T style={{ fontSize: 29, fontWeight: '800', color: '#14181f', marginTop: 10 }}>HomeBuild</T>
        <T style={{ color: '#6b7280', marginTop: 4 }}>Start your building journey</T>
      </View>
      {children}
      <View style={styles.trust}>
        {(['shield', 'briefcase', 'check-circle'] as const).map((n, i) => (
          <View key={n} style={{ alignItems: 'center', gap: 6 }}>
            <Feather name={n} size={20} color="#4b5563" />
            <T style={{ fontSize: 9, fontWeight: '700', letterSpacing: 1, color: '#4b5563' }}>
              {['RERA SECURE', 'GST READY', 'ISO CERTIFIED'][i]}
            </T>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 18 }}>
      <T style={styles.fieldLabel}>{label}</T>
      <View style={styles.field}>{children}</View>
    </View>
  );
}

export function Login() {
  const { authMode, setAuthMode, phone, setPhone, regName, setRegName, go } = useApp();
  const register = authMode === 'register';
  return (
    <AuthShell>
      <View style={styles.sheet}>
        <View style={styles.seg}>
          {(['signin', 'register'] as const).map((m) => {
            const on = authMode === m;
            return (
              <Pressable key={m} onPress={() => setAuthMode(m)} style={[styles.segItem, on && { backgroundColor: '#fff' }]}>
                <T style={{ color: on ? palette.primary : '#6b7280', fontWeight: on ? '700' : '500', fontSize: 14.5 }}>
                  {m === 'signin' ? 'Sign In' : 'Register'}
                </T>
              </Pressable>
            );
          })}
        </View>
        <T style={{ fontSize: 22, fontWeight: '700', color: '#14181f', marginTop: 20 }}>{register ? 'Create Account' : 'Welcome back'}</T>
        <T style={{ color: '#5b6472', lineHeight: 21, marginTop: 8 }}>
          {register ? 'Verify your number, then choose the kind of account you need.' : 'Sign in with your registered mobile number.'}
        </T>
        {register && (
          <Field label="FULL NAME">
            <Feather name="user" size={17} color="#9aa3b2" />
            <TextInput value={regName} onChangeText={setRegName} placeholder="Your name" placeholderTextColor="#9aa3b2" style={styles.input} />
          </Field>
        )}
        <Field label="MOBILE NUMBER">
          <T style={{ color: '#9aa3b2', fontWeight: '600', fontSize: 15.5 }}>+91</T>
          <View style={{ width: 1, height: 20, backgroundColor: '#dfe3ea' }} />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={11}
            placeholder="00000 00000"
            placeholderTextColor="#9aa3b2"
            style={styles.input}
          />
        </Field>
        <PrimaryButton label="Send OTP" icon="arrow-right" onPress={() => go('otp')} style={{ marginTop: 18 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 22 }}>
          <View style={styles.rule} />
          <T style={{ fontSize: 11, fontWeight: '600', color: '#9aa3b2' }}>OR</T>
          <View style={styles.rule} />
        </View>
        <Pressable onPress={() => go('otp')} style={styles.outline}>
          <T style={{ color: '#2b3340', fontWeight: '500', fontSize: 15.5 }}>{register ? 'Sign up with Gmail' : 'Continue with Gmail'}</T>
        </Pressable>
      </View>
    </AuthShell>
  );
}

const DEMO_OTP = '482913';

export function Otp() {
  const { otp, setOtp, phone, go, authMode, signIn } = useApp();
  const verify = () => (authMode === 'register' ? go('role') : signIn());
  return (
    <AuthShell>
      <View style={styles.sheet}>
        <Pressable onPress={() => go('login')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Feather name="arrow-left" size={17} color={palette.primary} />
          <T style={{ color: palette.primary, fontWeight: '600' }}>Edit number</T>
        </Pressable>
        <T style={{ fontSize: 23, fontWeight: '700', color: '#14181f', marginTop: 16 }}>Verify Phone</T>
        <T style={{ color: '#5b6472', lineHeight: 21, marginTop: 8 }}>Enter the code sent to{'\n'}+91 {phone || '98XXX-XXXXX'}</T>
        <View style={{ flexDirection: 'row', gap: 9, marginTop: 22 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const active = otp.length === i;
            return (
              <Pressable
                key={i}
                onPress={() => setOtp(DEMO_OTP.slice(0, i + 1))}
                style={[styles.otpCell, { backgroundColor: active ? '#fff' : '#f1f3f8', borderColor: active ? palette.primary : '#eceff5' }]}>
                <T style={{ fontSize: 21, fontWeight: '700', color: '#14181f' }}>{otp[i] ?? ''}</T>
              </Pressable>
            );
          })}
        </View>
        <T style={{ textAlign: 'center', color: '#5b6472', marginTop: 22 }}>Didn&apos;t receive the code?</T>
        <T style={{ textAlign: 'center', color: palette.primary, fontWeight: '700', marginTop: 6 }}>Resend OTP</T>
        <PrimaryButton label="Verify & Continue" onPress={verify} style={{ marginTop: 22 }} />
      </View>
    </AuthShell>
  );
}

export function RoleSelect() {
  const { authMode, go, registerAs } = useApp();
  const register = authMode === 'register';
  const options = [
    { role: 'customer' as const, icon: 'home' as const, title: 'Homeowner', sub: register ? 'Plan, approve and pay for your build' : 'Ankit Sharma · Project HB-9921', meta: 'Design · Build · Finance · Schedule', tint: '#E8F0FE', color: palette.primary },
    { role: 'supervisor' as const, icon: 'tool' as const, title: 'Site Supervisor', sub: register ? 'Log site progress and daily tasks' : 'Vikram Singh · ID SUP-992104', meta: 'Daily logs · Tasks · 3 sites', tint: '#D6F5E6', color: palette.green },
  ];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#EEF3FB' }} contentContainerStyle={{ padding: 16 }}>
      <Pressable onPress={() => go('login')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 12 }}>
        <Feather name="arrow-left" size={17} color={palette.primary} />
        <T style={{ color: palette.primary, fontWeight: '600' }}>Back</T>
      </Pressable>
      <T style={{ fontSize: 11, fontWeight: '700', letterSpacing: 1, color: '#6b7280' }}>{register ? 'SELECT ACCOUNT TYPE' : 'SELECT YOUR ACCESS'}</T>
      <T style={{ fontSize: 24, fontWeight: '700', color: '#14181f', marginTop: 6 }}>{register ? 'Register as' : 'Continue as'}</T>
      <View style={{ gap: 14, marginTop: 20 }}>
        {options.map((o) => (
          <Card key={o.role} onPress={() => registerAs(o.role)} style={{ flexDirection: 'row', alignItems: 'center', gap: 15, backgroundColor: '#fff', borderColor: '#e6ebf3' }}>
            <View style={{ width: 54, height: 54, borderRadius: 16, backgroundColor: o.tint, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name={o.icon} size={24} color={o.color} />
            </View>
            <View style={{ flex: 1 }}>
              <T style={{ fontSize: 17, fontWeight: '700', color: '#14181f' }}>{o.title}</T>
              <T style={{ color: '#5b6472', marginTop: 2 }}>{o.sub}</T>
              <T style={{ color: '#8b94a3', fontSize: 12, marginTop: 4 }}>{o.meta}</T>
            </View>
            <Feather name="chevron-right" size={20} color="#9aa3b2" />
          </Card>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 24, padding: 14, borderRadius: 14, backgroundColor: '#E4ECFB' }}>
        <Icon name="lock" size={16} color={palette.primary} />
        <T style={{ flex: 1, color: '#334155', fontSize: 12.5, lineHeight: 18 }}>
          One account, one role. Budgets, payments and design approvals stay with the homeowner; site logging stays with the supervisor. To use the other role, log out and sign in again.
        </T>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sheet: { backgroundColor: '#fff', borderRadius: 26, marginHorizontal: 16, padding: 22, paddingBottom: 26 },
  seg: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 12, backgroundColor: '#F0F3F8' },
  segItem: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 9 },
  fieldLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: '#8b94a3' },
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 52, marginTop: 8, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#f3f5fa', borderWidth: 1, borderColor: '#e6e9f0' },
  input: { flex: 1, minWidth: 0, fontSize: 15.5, fontWeight: '600', color: '#14181f', padding: 0 },
  rule: { flex: 1, height: 1, backgroundColor: '#e6e9f0' },
  outline: { marginTop: 16, height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#dfe3ea', alignItems: 'center', justifyContent: 'center' },
  otpCell: { flex: 1, aspectRatio: 1, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  trust: { flexDirection: 'row', justifyContent: 'center', gap: 34, marginTop: 28, opacity: 0.45 },
});
