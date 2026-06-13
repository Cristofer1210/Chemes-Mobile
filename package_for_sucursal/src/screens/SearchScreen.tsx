import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import ProductList from '../components/ProductList';
import { searchProducts } from '../services/sqliteService';
import { useNavigation } from '@react-navigation/native';
import { Product } from '../models/Product';

export default function SearchScreen() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  const navigation = useNavigation<any>();

  const handleSearch = async () => {
    if (!q || q.trim().length === 0) {
      setResults([]);
      return;
    }
    const res = await searchProducts(q.trim());
    setResults(res);
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <TextInput
        placeholder="Buscar por código o descripción"
        value={q}
        onChangeText={setQ}
        style={{ borderWidth: 1, padding: 8 }}
      />
      <View style={{ height: 12 }} />
      <Button title="Buscar" onPress={handleSearch} />
      <Text style={{ marginTop: 8 }}>Resultados: {results.length}</Text>
      <ProductList data={results} onItemPress={(p) => navigation.navigate('Finance', { product: p })} />
    </View>
  );
}
