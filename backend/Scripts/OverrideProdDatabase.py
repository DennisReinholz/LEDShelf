import shutil
import platform
import argparse

def datenbank_ueberschreiben(quelle, ziel):
    try:
        # Datei kopieren und Ziel überschreiben
        shutil.copy(quelle, ziel)
        print(f"{ziel} wurde erfolgreich mit {quelle} überschrieben.")
    
    except Exception as e:
        print(f"Fehler beim Überschreiben der Datei: {e}")

# Kommandozeilenargumente parsen
def main():
    parser = argparse.ArgumentParser(description='Überschreibe eine Datenbankdatei mit einer Backup-Datei.')
    
    # Argumente für Quelle und Ziel
    parser.add_argument('quelle', type=str, help='Pfad zur Quelldatei (z.B. backup.db)')
    parser.add_argument('ziel', type=str, help='Pfad zur Zieldatei (z.B. Ledshelf.db)')
    
    # Argumente parsen
    args = parser.parse_args()
    
    # Funktion aufrufen und die Pfade übergeben
    datenbank_ueberschreiben(args.quelle, args.ziel)

if __name__ == '__main__':
    main()
