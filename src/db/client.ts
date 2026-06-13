import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabase('chemes.db');

export function executeSql(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, err) => {
          reject(err);
          return false;
        }
      );
    });
  });
}
