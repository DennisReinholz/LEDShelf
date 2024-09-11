import sqlite3

def export_db_structure(db_file, output_file):
    # Verbindung zur Datenbank herstellen
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    # Alle Tabellen abfragen
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    # Öffne die Ausgabedatei
    with open(output_file, 'w') as f:
        for table_name in tables:
            table_name = table_name[0]
            f.write(f"-- Struktur der Tabelle: {table_name}\n")
            f.write(f"CREATE TABLE {table_name} (\n")

            # Spalteninformationen abrufen
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()

            column_definitions = []
            for column in columns:
                column_name = column[1]
                column_type = column[2]
                not_null = "NOT NULL" if column[3] else ""
                default_value = f"DEFAULT {column[4]}" if column[4] is not None else ""
                pk = "PRIMARY KEY" if column[5] else ""

                column_definitions.append(f"  {column_name} {column_type} {not_null} {default_value} {pk}".strip())

            f.write(",\n".join(column_definitions))
            f.write("\n);\n\n")

    # Verbindung schließen
    conn.close()
    print(f"Die Datenbankstruktur wurde in {output_file} exportiert.")

if __name__ == '__main__':
    db_file = 'Ledshelf.db'
    output_file = 'db_structure.sql'
    export_db_structure(db_file, output_file)
