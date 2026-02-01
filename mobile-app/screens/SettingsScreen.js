import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import SettingsService from "../services/SettingsService";
import ApiService from "../services/ApiService";

export default function SettingsScreen() {
  const [firstName, setFirstName] = useState(SettingsService.getFirstName());
  const [lastName, setLastName] = useState(SettingsService.getLastName());
  const [serverUrl, setServerUrl] = useState(SettingsService.getServerUrl());
  const [serverMode, setServerMode] = useState(SettingsService.getServerMode());
  const [healthStatus, setHealthStatus] = useState(null); // null, 'online', 'offline'
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSave = () => {
    SettingsService.setNames(firstName, lastName);
    SettingsService.setServerUrl(serverUrl);
    SettingsService.setServerMode(serverMode);
  };

  const handleLocalWifi = () => {
    SettingsService.setLocalWifiUrl();
    setServerUrl(SettingsService.getServerUrl());
    setErrorMessage(null);
    setHealthStatus(null);
  };

  const handleCheckHealth = async () => {
    setIsCheckingHealth(true);
    setHealthStatus(null);
    setErrorMessage(null);

    // Save the current URL before checking
    SettingsService.setServerUrl(serverUrl);

    const result = await ApiService.checkHealth();

    setIsCheckingHealth(false);
    if (result.success) {
      setHealthStatus('online');
      setErrorMessage(null);
    } else {
      setHealthStatus('offline');
      const errorDetail = result.error || 'Unknown error';
      setErrorMessage(`Health check failed: ${errorDetail}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Settings Section */}
      <Text style={styles.sectionTitle}>Profile</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
          placeholderTextColor="#999"
        />
      </View>

      {/* Server Settings Section */}
      <Text style={styles.sectionTitle}>Server Settings</Text>

      {/* Mode Selection Radio Buttons */}
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setServerMode('local')}
        >
          <View style={styles.radioCircle}>
            {serverMode === 'local' && <View style={styles.radioSelected} />}
          </View>
          <Text style={styles.radioLabel}>Local Simulation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setServerMode('server')}
        >
          <View style={styles.radioCircle}>
            {serverMode === 'server' && <View style={styles.radioSelected} />}
          </View>
          <Text style={styles.radioLabel}>Server</Text>
        </TouchableOpacity>
      </View>

      {/* Show server settings only in server mode */}
      {serverMode === 'server' && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Server URL</Text>
            <TextInput
              style={styles.input}
              value={serverUrl}
              onChangeText={setServerUrl}
              placeholder="http://192.168.1.23:3000"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Server Status Badge */}
          {healthStatus && (
            <View style={styles.statusBadgeContainer}>
              <View style={[
                styles.statusBadge,
                healthStatus === 'online' ? styles.statusBadgeOnline : styles.statusBadgeOffline
              ]}>
                <View style={[
                  styles.statusDot,
                  healthStatus === 'online' ? styles.statusOnline : styles.statusOffline
                ]} />
                <Text style={[
                  styles.statusBadgeText,
                  healthStatus === 'online' ? styles.statusTextOnline : styles.statusTextOffline
                ]}>
                  {healthStatus === 'online' ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleLocalWifi}>
              <Text style={styles.secondaryButtonText}>Use Local WiFi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleCheckHealth}
              disabled={isCheckingHealth}
            >
              {isCheckingHealth ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.secondaryButtonText}>Check</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Error Message Display */}
          {errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
        </>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  statusBadgeContainer: {
    marginBottom: 16,
    alignItems: "flex-start",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusBadgeOnline: {
    backgroundColor: "#E8F5E9",
  },
  statusBadgeOffline: {
    backgroundColor: "#FFEBEE",
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusTextOnline: {
    color: "#2E7D32",
  },
  statusTextOffline: {
    color: "#C62828",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusOnline: {
    backgroundColor: "#4CAF50",
  },
  statusOffline: {
    backgroundColor: "#F44336",
  },
  saveButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  radioGroup: {
    marginBottom: 24,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
    marginTop: -16,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
});

