import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { compareAllCards } from '../services/cardCalculator';

export default function FinanceComparisonScreen({ route }: any) {
  const product = route.params?.product;
  const term = route.params?.term ?? 12;

  const results = useMemo(() => compareAllCards(product, term), [product, term]);

  const cheapest = results[0];

  return (
    <View style={{ flex:1, padding: 12 }}>
      <Text style={{ fontWeight: '700', fontSize: 16 }}>Comparador de financiación — {term} meses</Text>
      <Text style={{ marginTop: 8 }}>Producto: {product?.CODIGO} — {product?.DESCRIPCION}</Text>

      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: '600' }}>{item.name} {item.id === cheapest.id ? '🏆 Opción recomendada' : ''}</Text>
            <Text>Lista usada: {item.listKey} — Precio lista: {item.listPrice.toFixed(2)}</Text>
            <Text>Total financiado: {item.totalFinanced.toFixed(2)} — Cuota: {item.monthlyPayment.toFixed(2)}</Text>
            <Text>Diferencia vs contado: {item.differenceAgainstCash.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}
