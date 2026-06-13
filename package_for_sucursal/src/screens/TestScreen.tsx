import React from 'react';
import { View, Text, Button, Alert } from 'react-native';

export default function TestScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Chemes Mobile funcionando</Text>
      <Button title="Test" onPress={() => Alert.alert('Test OK')} />
    </View>
  );
}
