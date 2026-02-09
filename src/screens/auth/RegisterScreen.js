import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Nama tidak boleh kosong';
    }
    if (!email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!password) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak boleh kosong';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    if (!validate()) return;
    await register(name.trim(), email.trim(), password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.header}>
          <Text style={styles.title}>Daftar</Text>
          <Text style={styles.subtitle}>
            Buat akun baru untuk mulai berbelanja.
          </Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{error}</Text>
          </View>
        )}

        <Input
          label="Nama Lengkap"
          value={name}
          onChangeText={setName}
          placeholder="Masukkan nama lengkap"
          autoCapitalize="words"
          error={errors.name}
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="nama@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Minimal 6 karakter"
          secureTextEntry
          error={errors.password}
        />

        <Input
          label="Konfirmasi Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Ulangi password"
          secureTextEntry
          error={errors.confirmPassword}
        />

        <Button
          title="Daftar"
          onPress={handleRegister}
          loading={isLoading}
          style={styles.button}
        />

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => {
            clearError();
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.linkText}>
            Sudah punya akun?{' '}
            <Text style={styles.linkBold}>Masuk</Text>
          </Text>
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  errorBox: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBoxText: {
    color: Colors.danger,
    fontSize: 14,
  },
  button: {
    marginTop: 8,
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  linkBold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default RegisterScreen;
