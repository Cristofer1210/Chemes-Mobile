import React, { useMemo, useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { calculateCredit, AVAILABLE_TERMS, AVAILABLE_PROTECTIONS } from '../services/creditoChemes';
import { Product } from '../models/Product';
import { useNavigation } from '@react-navigation/native';

export default function FinanceScreen({ route }: any) {
  const product: Product = route.params?.product;
  const priceBase = Number(product?.LISTA_2 ?? 0);

  const [term, setTerm] = useState<number>(12);
  const [delivery, setDelivery] = useState<'con'|'sin'>('con');
  const [protectionYears, setProtectionYears] = useState<number>(0);

  const result = useMemo(() => calculateCredit(priceBase, { term, delivery, protectionYears }), [priceBase, term, delivery, protectionYears]);
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{product?.CODIGO} — {product?.DESCRIPCION}</Text>
      <Text style={{ marginTop: 8 }}>Precio base (LISTA_2): {priceBase.toFixed(2)}</Text>

      <View style={{ marginTop: 12 }}>
        <Text>Modalidad de entrega:</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Button title="Con entrega" onPress={() => setDelivery('con')} color={delivery==='con'?'#2e86de':undefined} />
          <View style={{ width: 12 }} />
          <Button title="Sin entrega" onPress={() => setDelivery('sin')} color={delivery==='sin'?'#2e86de':undefined} />
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <Text>Plazo (meses):</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
          {AVAILABLE_TERMS.map(t => (
            <TouchableOpacity key={t} onPress={() => setTerm(t)} style={{ padding: 8, borderWidth: 1, marginRight: 8, marginBottom: 8, backgroundColor: term===t? '#dff0ff' : undefined }}>
              <Text>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <Text>Protección (años):</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          {AVAILABLE_PROTECTIONS.map(p => (
            <TouchableOpacity key={p} onPress={() => setProtectionYears(p)} style={{ padding: 8, borderWidth: 1, marginRight: 8, backgroundColor: protectionYears===p? '#dff0ff' : undefined }}>
              <Text>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 16, borderTopWidth: 1, paddingTop: 12 }}>
        <Text>Precio base: {result.priceBase.toFixed(2)}</Text>
        <Text>Protección (%): {(result.protectionPercent*100).toFixed(2)}%</Text>
        <Text>Precio con protección: {result.priceWithProtection.toFixed(2)}</Text>
        <Text>Total financiado: {result.totalFinanced.toFixed(2)}</Text>
        <Text>Valor cuota ({term} meses): {result.monthlyPayment.toFixed(2)}</Text>
        <Text>Diferencia vs contado: {result.differenceAgainstCash.toFixed(2)}</Text>
      </View>
      <View style={{ marginTop: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 8 }}>Comparar tarjetas / bancos</Text>
        <Button title="Comparar" onPress={() => navigation.navigate('FinanceComparison', { product, term })} />
      </View>
    </View>
  );
}
