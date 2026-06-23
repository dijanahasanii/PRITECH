import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '../context/ThemeContext';

const BUTTON_SIZE = 36;
const ICON_SIZE = 20;

const ThemeToggleButton = () => {
  const { isDark, colors, toggleTheme } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      hitSlop={6}>
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={ICON_SIZE}
        color={colors.text}
        style={isDark ? styles.sunIcon : styles.moonIcon}
      />
    </Pressable>
  );
};

export default ThemeToggleButton;

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  sunIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    lineHeight: ICON_SIZE,
    textAlign: 'center',
  },
  moonIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    lineHeight: ICON_SIZE,
    textAlign: 'center',
    transform: [{ translateY: -1 }],
  },
});
