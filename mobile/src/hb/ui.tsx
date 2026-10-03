import { Feather } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import type { IconName } from './data';
import { useApp } from './store';
import { palette } from './theme';

export function Icon({ name, size = 18, color }: { name: IconName; size?: number; color?: string }) {
  const { theme } = useApp();
  return <Feather name={name} size={size} color={color ?? theme.text} />;
}

export function T({ children, style, ...rest }: { children?: ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number }) {
  const { theme } = useApp();
  return (
    <Text style={[{ color: theme.text, fontSize: 14 }, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const { theme } = useApp();
  const base = [styles.card, { backgroundColor: theme.card, borderColor: theme.border }, style];
  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [...base, pressed && { opacity: 0.85 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={base}>{children}</View>;
}

export function Kicker({ children, color }: { children: ReactNode; color?: string }) {
  const { theme } = useApp();
  return <Text style={[styles.kicker, { color: color ?? theme.mute }]}>{children}</Text>;
}

export function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={{ color, fontSize: 10, fontWeight: '800', letterSpacing: 0.6 }}>{label}</Text>
    </View>
  );
}

export function Progress({ pct, color = palette.primary, height = 8 }: { pct: number; color?: string; height?: number }) {
  const { theme } = useApp();
  return (
    <View style={{ height, borderRadius: 99, backgroundColor: theme.track, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: '100%', borderRadius: 99, backgroundColor: color }} />
    </View>
  );
}

export function Chip({ label, active, onPress, accent = palette.primary }: { label: string; active: boolean; onPress: () => void; accent?: string }) {
  const { theme } = useApp();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: active ? accent : theme.chip, borderColor: active ? accent : theme.border },
      ]}>
      <Text style={{ color: active ? '#fff' : theme.sub, fontSize: 13, fontWeight: active ? '700' : '500' }}>{label}</Text>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{children}</View>;
}

export function PrimaryButton({
  label, onPress, icon, bg = palette.primary, disabled, style,
}: { label: string; onPress: () => void; icon?: IconName; bg?: string; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: bg, opacity: disabled ? 0.55 : pressed ? 0.88 : 1 }, style]}>
      {icon ? <Feather name={icon} size={18} color="#fff" /> : null}
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );
}

export function OutlineButton({ label, onPress, icon, style }: { label: string; onPress: () => void; icon?: IconName; style?: StyleProp<ViewStyle> }) {
  const { theme } = useApp();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.border, opacity: pressed ? 0.8 : 1 }, style]}>
      {icon ? <Feather name={icon} size={17} color={theme.text} /> : null}
      <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

export function IconTile({ icon, tint, color, size = 44 }: { icon: IconName; tint: string; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.3, backgroundColor: tint, alignItems: 'center', justifyContent: 'center' }}>
      <Feather name={icon} size={size * 0.45} color={color} />
    </View>
  );
}

export function EmptyState({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  const { theme } = useApp();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 36, gap: 8 }}>
      <Feather name={icon} size={34} color={theme.mute} />
      <T style={{ fontSize: 16, fontWeight: '700' }}>{title}</T>
      <T style={{ color: theme.sub, textAlign: 'center', paddingHorizontal: 24 }}>{body}</T>
    </View>
  );
}

export function Switch({ on, onPress, label }: { on: boolean; onPress: () => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: on }}
      onPress={onPress}
      style={{ width: 46, height: 26, borderRadius: 99, backgroundColor: on ? palette.primary : '#D6DBE3', padding: 3, alignItems: on ? 'flex-end' : 'flex-start' }}>
      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' }} />
    </Pressable>
  );
}

export function BrandMark({ size = 46, color = palette.blue }: { size?: number; color?: string }) {
  return <Feather name="home" size={size} color={color} />;
}

/** Stand-in for the prototype's drop-in image slots until real photos come from Storage. */
export function Placeholder({ icon = 'image', height = 140, tint, style }: { icon?: IconName; height?: number; tint?: string; style?: StyleProp<ViewStyle> }) {
  const { theme } = useApp();
  return (
    <View style={[{ height, borderRadius: 16, backgroundColor: tint ?? theme.chip, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Feather name={icon} size={28} color={theme.mute} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: 1, padding: 16 },
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, borderWidth: 1 },
  button: { height: 54, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
});
