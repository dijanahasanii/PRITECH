import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { ColorScheme } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { validateTitle } from '../utils/validation';

interface TaskFormProps {
  onSubmit: (title: string, description: string) => void;
  submitLabel?: string;
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      gap: 20,
    },
    field: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text,
    },
    inputError: {
      borderColor: colors.error,
    },
    textArea: {
      minHeight: 100,
      paddingTop: 14,
    },
    errorText: {
      color: colors.error,
      fontSize: 13,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonPressed: {
      opacity: 0.9,
    },
    buttonText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
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
