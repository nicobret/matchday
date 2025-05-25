import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../components/auth-provider';
import { useTheme } from '../components/theme-provider';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={styles.form}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          Sign In
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#333' : '#f5f5f5',
              color: isDark ? '#fff' : '#000',
            },
          ]}
          placeholder="Email"
          placeholderTextColor={isDark ? '#999' : '#666'}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#333' : '#f5f5f5',
              color: isDark ? '#fff' : '#000',
            },
          ]}
          placeholder="Password"
          placeholderTextColor={isDark ? '#999' : '#666'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isDark ? '#fff' : '#000' }]}
          onPress={handleSignIn}
        >
          <Text style={[styles.buttonText, { color: isDark ? '#000' : '#fff' }]}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 