import shutil
import argparse

def overrideProdDatabase(quelle, ziel):
    try:
        # Datei kopieren und Ziel überschreiben
        shutil.copy2(quelle, ziel)
        print(f"{ziel} wurde erfolgreich mit {quelle} überschrieben.")
    
    except Exception as e:
        print(f"Fehler beim Überschreiben der Datei: {e}")

def main():
    parser = argparse.ArgumentParser(description='Überschreibe eine Datenbankdatei mit einer Backup-Datei.')
    
    parser.add_argument('quelle', type=str, help='Pfad zur Quelldatei (z.B. backup.db)')
    parser.add_argument('ziel', type=str, help='Pfad zur Zieldatei (z.B. Ledshelf.db)')
    
    args = parser.parse_args()
    
    overrideProdDatabase(args.quelle, args.ziel)

if __name__ == '__main__':
    main()
