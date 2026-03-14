import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ManageAdmins() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');

  const admins = [
    { _id: '1', email: 'admin@ishelf.com', role: 'superadmin', isSetupComplete: true },
    { _id: '2', email: 'test@ishelf.com', role: 'admin', isSetupComplete: false },
  ];

  const handleAddAdmin = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter email');
      return;
    }
    Alert.alert('Success', 'Invitation sent to ' + email);
    setEmail('');
    setShowAddForm(false);
  };

  const handleDeleteAdmin = (adminEmail: string) => {
    Alert.alert('Delete Admin', `Delete ${adminEmail}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Deleted', adminEmail) }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Admins</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(!showAddForm)}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {showAddForm && (
          <View style={styles.addForm}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'admin' && styles.roleButtonActive]}
                onPress={() => setRole('admin')}
              >
                <Text style={[styles.roleButtonText, role === 'admin' && styles.roleButtonTextActive]}>
                  Admin
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === 'superadmin' && styles.roleButtonActive]}
                onPress={() => setRole('superadmin')}
              >
                <Text style={[styles.roleButtonText, role === 'superadmin' && styles.roleButtonTextActive]}>
                  Super Admin
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleAddAdmin}>
              <Text style={styles.submitButtonText}>Send Invitation</Text>
            </TouchableOpacity>
          </View>
        )}

        {admins.map((admin, index) => (
          <View key={admin._id} style={styles.adminCard}>
            <View style={styles.adminInfo}>
              <Text style={styles.adminEmail}>{admin.email}</Text>
              <Text style={styles.adminRole}>{admin.role}</Text>
              <View style={[styles.statusBadge, admin.isSetupComplete ? styles.confirmed : styles.pending]}>
                <Text style={styles.statusText}>
                  {admin.isSetupComplete ? 'Confirmed' : 'Pending'}
                </Text>
              </View>
            </View>
            {index !== 0 && (
              <TouchableOpacity onPress={() => handleDeleteAdmin(admin.email)}>
                <Ionicons name="trash-outline" size={24} color="#E85D54" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E85D54',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#E85D54',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addForm: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  roleButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E85D54',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#E85D54',
  },
  roleButtonText: {
    color: '#E85D54',
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    height: 48,
    backgroundColor: '#E85D54',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  adminCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  adminInfo: {
    flex: 1,
  },
  adminEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  adminRole: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pending: {
    backgroundColor: '#FFF3CD',
  },
  confirmed: {
    backgroundColor: '#D4EDDA',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
