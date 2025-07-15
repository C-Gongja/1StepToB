import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { User, UserPreferences } from '../types/User';
import { TodoPriority } from '../types/Todo';
import { generateId } from '../utils/dateUtils';

export const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User>({
    id: generateId(),
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date(),
    preferences: {
      theme: 'light',
      notifications: true,
      defaultTodoPriority: 'medium',
      weekStartsOn: 'sunday',
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: editName.trim(),
      email: editEmail.trim(),
    }));
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setIsEditing(false);
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatJoinDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
            </View>
          </View>
          
          {isEditing ? (
            <View style={styles.editForm}>
              <TextInput
                style={styles.editInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Name"
                autoFocus
              />
              <TextInput
                style={styles.editInput}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.editButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.joinDate}>
                Member since {formatJoinDate(user.createdAt)}
              </Text>
              <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.editProfileButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Theme</Text>
              <Text style={styles.preferenceDescription}>App appearance</Text>
            </View>
            <View style={styles.themeButtons}>
              {(['light', 'dark', 'auto'] as const).map((theme) => (
                <TouchableOpacity
                  key={theme}
                  style={[
                    styles.themeButton,
                    user.preferences.theme === theme && styles.themeButtonActive
                  ]}
                  onPress={() => updatePreference('theme', theme)}
                >
                  <Text style={[
                    styles.themeButtonText,
                    user.preferences.theme === theme && styles.themeButtonTextActive
                  ]}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Notifications</Text>
              <Text style={styles.preferenceDescription}>Push notifications for reminders</Text>
            </View>
            <Switch
              value={user.preferences.notifications}
              onValueChange={(value) => updatePreference('notifications', value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={user.preferences.notifications ? '#007AFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Default Todo Priority</Text>
              <Text style={styles.preferenceDescription}>Priority for new todos</Text>
            </View>
            <View style={styles.priorityButtons}>
              {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    user.preferences.defaultTodoPriority === priority && styles.priorityButtonActive,
                    { borderColor: getPriorityColor(priority) }
                  ]}
                  onPress={() => updatePreference('defaultTodoPriority', priority)}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    user.preferences.defaultTodoPriority === priority && { color: '#fff' }
                  ]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Week Starts On</Text>
              <Text style={styles.preferenceDescription}>First day of the week</Text>
            </View>
            <View style={styles.weekButtons}>
              {(['sunday', 'monday'] as const).map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.weekButton,
                    user.preferences.weekStartsOn === day && styles.weekButtonActive
                  ]}
                  onPress={() => updatePreference('weekStartsOn', day)}
                >
                  <Text style={[
                    styles.weekButtonText,
                    user.preferences.weekStartsOn === day && styles.weekButtonTextActive
                  ]}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Todos Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Events Scheduled</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Days Streak</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>App Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Build</Text>
            <Text style={styles.aboutValue}>2024.01</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return '#FF3B30';
    case 'high': return '#FF9500';
    case 'medium': return '#FFCC00';
    case 'low': return '#34C759';
    default: return '#8E8E93';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  editProfileButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  editForm: {
    width: '100%',
    alignItems: 'center',
  },
  editInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  themeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  themeButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  themeButtonTextActive: {
    color: '#fff',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  priorityButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  priorityButtonActive: {
    backgroundColor: 'currentColor',
  },
  priorityButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  weekButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  weekButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  weekButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  weekButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  weekButtonTextActive: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  aboutLabel: {
    fontSize: 16,
    color: '#333',
  },
  aboutValue: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});