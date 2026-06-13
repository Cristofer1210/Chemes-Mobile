import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import { pickAndImportXLSX } from '../services/xlsxImporter';
import { useProductsStore } from '../store/useStore';

export default function ImportScreen() {
  const [csv, setCsv] = useState('');
  const importAndSave = useProductsStore((s: any) => s.importAndSave);

  const handlePickAndImport = async () => {
    try {
      const { count, items } = await pickAndImportXLSX();
      // save to DB
      await importAndSave(items);
      Alert.alert('Importación', `Importados ${count} registros`);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Error importando: ' + String(e));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Importador CSV/Excel (pegue contenido CSV aquí)</Text>
      <Text style={{ marginTop: 12 }}>Opción: seleccionar archivo Excel (.xlsx)</Text>
      <Button title="Seleccionar & Importar XLSX" onPress={handlePickAndImport} />

      <Text style={{ marginTop: 16 }}>Opción alternativa: Pegar CSV</Text>
      <TextInput
        multiline
        numberOfLines={8}
        style={{ borderWidth: 1, marginTop: 8, padding: 8, minHeight: 140 }}
        value={csv}
        onChangeText={setCsv}
      />
      <Button title="Importar CSV (simulado)" onPress={async () => {
        try {
          const mod = await import('../services/importer');
          const items = await mod.importFromCSV(csv);
          await importAndSave(items as any);
          Alert.alert('Importación', `Importados ${(items as any).length} registros`);
        } catch (e) {
          console.error(e);
          Alert.alert('Error', 'Error importando CSV');
        }
      }} />
    </View>
  );
}
