import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useProductsStore } from '../store/useStore';

export default function HomeScreen({ navigation }: any) {
  const loadAll = useProductsStore((s: any) => s.loadAll);

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Chemes Mobile</Text>
      <Button title="Importar" onPress={() => navigation.navigate('Import')} />
      <View style={{ height: 12 }} />
      <Button title="Buscar productos" onPress={() => navigation.navigate('Search')} />
    </View>
  );
}
