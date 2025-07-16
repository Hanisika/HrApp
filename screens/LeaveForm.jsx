import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator,Text } from 'react-native';


export default function LeaveForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
   const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !reason) {
      Alert.alert('Please fill all fields');
      return;
    }
     setLoading(true); // start loading
    try {
      const response = await fetch('http://192.168.190.151:5000/apply-leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, reason }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Leave application submitted successfully!');
      } else {
        Alert.alert('Submission failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      Alert.alert('Error submitting form', error.message);
    }finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Reason for Leave"
        value={reason}
        onChangeText={setReason}
        multiline
      /> {loading ? (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10 }}>Submitting...</Text>
        </View>
      ) : (
        <Button title="Submit" onPress={handleSubmit} />
      )}
    </View>
  );
}
