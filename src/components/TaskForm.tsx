import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import {
  createInputStyle,
  createPrimaryButtonStyle,
  createPrimaryButtonTextStyle,
  pressedStyle,
} from '../styles/common';
import { validateTitle } from '../utils/validation';

interface TaskFormProps {
  onSubmit: (title: string, description: string) => void;
  submitLabel?: string;
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      gap: spacing.xl,
    },
    field: {
      gap: spacing.sm,
    },
    label: {
      ...typography.label,
      color: colors.text,
    },
    input: {
      ...createInputStyle(colors),
      fontSize: typography.body.fontSize,
      color: colors.text,
    },
    inputError: {
      borderColor: colors.error,
    },
    textArea: {
      minHeight: 120,
      paddingTop: spacing.md + 2,
      textAlignVertical: 'top',
    },
    errorText: {
      color: colors.error,
      ...typography.bodySmall,
    },
    button: createPrimaryButtonStyle(colors),
    buttonPressed: pressedStyle,
    buttonText: createPrimaryButtonTextStyle(colors),
  });

const TaskForm = ({ onSubmit, submitLabel = 'Create Task' }: TaskFormProps) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const validationError = validateTitle(title);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSubmit(title, description);
    setTitle('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (error) {
              setError(null);
            }
          }}
          placeholder="Enter task title"
          placeholderTextColor={colors.placeholder}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add a description (optional)"
          placeholderTextColor={colors.placeholder}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleSubmit}>
        <Text style={styles.buttonText}>{submitLabel}</Text>
      </Pressable>
    </View>
  );
};

export default TaskForm;
