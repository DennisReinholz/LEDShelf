import sqlite3
import os

def create_database_and_insert_data(db_file):
    # Verbindung zur SQLite-Datenbank herstellen (wird erstellt, falls nicht vorhanden)
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    try:
        # Erstellen der Tabellen (einzeln)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user (
                userid INTEGER PRIMARY KEY,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                role INT
            );
        ''')
        print("Tabelle 'user' erstellt.")
        

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS role (
                roleid INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            );
        ''')
        print("Tabelle 'role' erstellt.")

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS shelf (
                shelfid INTEGER PRIMARY KEY,
                shelfname TEXT NOT NULL,
                place TEXT,
                countCompartment INT,
                controllerId INT
            );
        ''')
        print("Tabelle 'shelf' erstellt.")

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS article (
                articleid INTEGER PRIMARY KEY,
                articlename TEXT NOT NULL,
                count INT,
                compartment INT,
                shelf INT,
                unit TEXT,
                categoryid INT,
                company TEXT,
                commission TEXT,
                minRequirement INT
            );
        ''')
        print("Tabelle 'article' erstellt.")

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS compartment (
                compartmentId INTEGER PRIMARY KEY,
                compartmentname TEXT NOT NULL,
                articleId INT,
                shelfId INT,
                number INT
            );
        ''')
        print("Tabelle 'compartment' erstellt.")

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ledController (
                ledControllerid INTEGER PRIMARY KEY,
                ipAdresse TEXT NOT NULL,
                shelfid INT,
                numberCompartment INT,
                status TEXT
            );
        ''')
        print("Tabelle 'ledController' erstellt.")

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS category (
                categoryid INTEGER PRIMARY KEY,
                categoryname TEXT NOT NULL
            );
        ''')
        print("Tabelle 'category' erstellt.")

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ControllerFunctions (
                controllerfunctionId INTEGER PRIMARY KEY,
                controllerId INT,
                functionName TEXT,
                compartmentid INT
            );
        ''')
        print("Tabelle 'ControllerFunctions' erstellt.")

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS company (
                companyId INTEGER PRIMARY KEY,
                companyName TEXT,
                street TEXT,
                plz TEXT
            );
        ''')
        print("Tabelle 'company' erstellt.")

        # Einfügen von Daten (ebenfalls einzeln)
        password = "admin"
        saltRounds = 12

        # Insert User
        cursor.execute('INSERT INTO user (username, password, role) VALUES (?, ?, ?)', ('admin', '$2b$12$vVr6P4EVInVpFjC45/kGNeEV2jGF9wsoUoST7rCBGT3vkmx3TB7Ou', 1))
        print("Daten in Tabelle 'user' eingefügt.")

        #Insert Role
        cursor.execute('INSERT INTO role (name) VALUES (?)', ('Administrator',))
        print("Daten in Tabelle 'role' eingefügt.")

        #Insert Shelf
        cursor.execute('INSERT INTO shelf (shelfname, place, countCompartment, controllerId) VALUES (?, ?, ?, ?)',
                       ('Shelf A', 'Place A', 3, 1))
        print("Daten in Tabelle 'shelf' eingefügt.")

        #Insert Article
        cursor.execute('''
            INSERT INTO article (articlename, count, compartment, shelf, unit, categoryid, company, commission, minRequirement)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            ('Article A', 100, 1, 1, 'Meter', 1, 1, 'Commission A', 10))
        print("Daten in Tabelle 'article' eingefügt.")

        #Insert Compartment
        for inserts in range(5):
            compartment_name = f'Compartment {inserts}'
    
            # Ausführen des Inserts
            cursor.execute('INSERT INTO compartment (compartmentname, articleId, shelfId, number) VALUES (?, ?, ?, ?)',
                       (compartment_name, None, 1, 0))        
        print("Daten in Tabelle 'compartment' eingefügt.")

        #Insert LedController
        cursor.execute('INSERT INTO ledController (ipAdresse, shelfid, numberCompartment, status) VALUES (?, ?, ?, ?)',
                       ('192.168.1.1', 1, 5, 'active'))
        print("Daten in Tabelle 'ledController' eingefügt.")

        #Insert Category
        cursor.execute('INSERT INTO category (categoryname) VALUES (?)', ('Category A',))
        print("Daten in Tabelle 'category' eingefügt.")

        #Insert Controllerfunctions
        cursor.execute('INSERT INTO ControllerFunctions (controllerId, functionName, compartmentid) VALUES (?, ?, ?)',
                       (1, 'Function A', 1))
        print("Daten in Tabelle 'ControllerFunctions' eingefügt.")

        #Insert Company
        cursor.execute('INSERT INTO company (companyName, street, plz) VALUES (?, ?, ?)',
                       ('Company A', 'Street A', '12345'))
        print("Daten in Tabelle 'company' eingefügt.")

        # Änderungen speichern
        conn.commit()

    except sqlite3.Error as e:
        print(f"Fehler beim Erstellen der Tabellen oder beim Einfügen von Daten: {e}")
    finally:
        # Verbindung schließen
        conn.close()
        print("Datenbankverbindung geschlossen.")

if __name__ == '__main__':   

    # Pfad aus Umgebungsvariable holen
    database_folder = os.getenv('REACT_APP_DATABASE_Folder')

    if not database_folder:
        print("Fehler: REACT_APP_DATABASE_Folder ist nicht in der .env-Datei definiert.")
    else:
        # Datenbankpfad erstellen
        db_file = os.path.join(database_folder, 'Ledshelf.db')
        
        create_database_and_insert_data(db_file)
