import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Product } from '../models/Product';

export default function ProductList({ data, onItemPress }: { data: Product[]; onItemPress?: (p: Product) => void }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i.CODIGO}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onItemPress && onItemPress(item)}>
          <View style={{ padding: 8, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: '600' }}>{item.CODIGO} — {item.DESCRIPCION}</Text>
            <Text>Stock: {item.SALDO ?? 0} — Sucursal: {item.SUCURSAL}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
