import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../components/theme-provider';

export default function AccountScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    // TODO: Implement save functionality
    Alert.alert('Success', 'Profile updated successfully');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome
            name="arrow-left"
            size={20}
            color={isDark ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          Account Settings
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>
            First Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#333' : '#f5f5f5',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            placeholderTextColor={isDark ? '#999' : '#666'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>
            Last Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#333' : '#f5f5f5',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            placeholderTextColor={isDark ? '#999' : '#666'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>
            Phone Number
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#333' : '#f5f5f5',
                color: isDark ? '#fff' : '#000',
              },
            ]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor={isDark ? '#999' : '#666'}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: isDark ? '#fff' : '#000' }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: isDark ? '#000' : '#fff' }]}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  saveButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 