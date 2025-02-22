import os
import sqlite3
import platform

def createLedshelfDb(db_file):

    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    try:
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
                countCompartment INT
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
                height FLOAT,
                articleId INT,
                shelfId INT,
                number INT,
                countLed INT,
                startLed INT,
                endLed INT
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
        
        # Insert User
        cursor.execute('INSERT INTO user (username, password, role) VALUES (?, ?, ?)', ('admin', '$2b$12$vVr6P4EVInVpFjC45/kGNeEV2jGF9wsoUoST7rCBGT3vkmx3TB7Ou', 1))
        cursor.execute('INSERT INTO user (username, password, role) VALUES (?, ?, ?)', ('ledshelfadmin', '$2b$12$yCytsaCfyMmEIetIAbUlcu9mqXzdqxG7CKmNgOgyQ/ILSwRV8Hv2m', 1))
        print("Daten in Tabelle 'user' eingefügt.")

        #Insert Role
        cursor.execute('INSERT INTO role (name) VALUES (?)', ('Administrator',))
        cursor.execute('INSERT INTO role (name) VALUES (?)', ('Benutzer',))
        print("Daten in Tabelle 'role' eingefügt.")

        #Insert Shelf
        cursor.execute('INSERT INTO shelf (shelfname, place, countCompartment) VALUES (?, ?, ?)',
                       ('Regal A', 'Ort A', 3))
        print("Daten in Tabelle 'shelf' eingefügt.")

        #Insert Article
        cursor.execute('''
            INSERT INTO article (articlename, count, compartment, shelf, unit, categoryid, company, commission, minRequirement)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            ('Artikel A', 100, 1, 1, 'Meter', 1, 1, 'Kommission A', 10))
        print("Daten in Tabelle 'article' eingefügt.")

        #Insert Compartment
        for inserts in range(5):
            compartment_name = f'Fach {inserts}'    
         
            cursor.execute('INSERT INTO compartment (compartmentname, articleId, shelfId, number) VALUES (?, ?, ?, ?)',
                       (compartment_name, None, 1, 0))        
        print("Daten in Tabelle 'compartment' eingefügt.")

        #Insert LedController
        cursor.execute('INSERT INTO ledController (ipAdresse, shelfid, numberCompartment, status) VALUES (?, ?, ?, ?)',
                       ('192.168.1.1', 1, 5, 'active'))
        print("Daten in Tabelle 'ledController' eingefügt.")

        #Insert Category
        cursor.execute('INSERT INTO category (categoryname) VALUES (?)', ('Kategorie A',))
        print("Daten in Tabelle 'category' eingefügt.")

        #Insert Controllerfunctions
        cursor.execute('INSERT INTO ControllerFunctions (controllerId, functionName, compartmentid) VALUES (?, ?, ?)',
                       (1, 'Function A', 1))
        print("Daten in Tabelle 'ControllerFunctions' eingefügt.")

        #Insert Company
        cursor.execute('INSERT INTO company (companyName, street, plz) VALUES (?, ?, ?)',
                       ('Firma A', 'Straße A', '12345'))
        print("Daten in Tabelle 'company' eingefügt.")

        # Saving changes
        conn.commit()

    except sqlite3.Error as e:
        print(f"Fehler beim Erstellen der Tabellen oder beim Einfügen von Daten: {e}")
    finally:
       
        conn.close()
        print("Datenbankverbindung geschlossen.")

def createSystemDb(sysDB_file, system):

    conn = sqlite3.connect(sysDB_file)
    cursor = conn.cursor()

    try:
        # Create table system
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS system (
                systemID INTEGER PRIMARY KEY,
                backUpPath TEXT NOT NULL,
                dataBasepath TEXT NOT NULL
            );
        ''')
        
        print("Table system was created.")

        if system == 'Linux':
            cursor.execute('INSERT INTO system (backUpPath, dataBasepath) VALUES (?, ?)', ('/home/ledshelf/database/backup', '/home/ledshelf/database/ledshelf.db'))
        elif system == 'Windows':
            cursor.execute('INSERT INTO system (backUpPath, dataBasepath) VALUES (?, ?)', ('./Database/BackUp', './Database/Ledshelf.db'))
    
       # Create table trello
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS trello (
                trelloID INTEGER PRIMARY KEY,              
                customerBoard TEXT NOT NULL,
                customerRequestList TEXT NOT NULL
            );
        ''')
        cursor.execute('INSERT INTO trello (customerBoard, customerRequestList ) VALUES (?, ?)', ('66b8ed3e4477bbb0ce31abf1','66b8ed6239d0edab8f6118c3'))    
        conn.commit()       

    except sqlite3.Error as e:
        print(f"Fehler beim Erstellen der Tabelle oder beim Einfügen von Daten: {e}")

    finally:
        conn.close()

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    db_file =""
    sysDB_file = ""
    # Check Operating system
    system = platform.system()
    print("System: " + system)

    if system == 'Linux':
        # Production path /home/ledshelf/       
        database_dir = '/home/ledshelf/database'
        if not os.path.exists(database_dir):
            os.makedirs(database_dir)

        db_file = os.path.join(database_dir, 'ledshelf.db')
        sysDb_file = os.path.join(database_dir, 'system.db')

        #create_database_and_insert_data(db_file)
        #create_sysDatabase_and_insert_data(sysDb_file, system)

    elif system == 'Windows':
        database_dir = os.path.join(os.path.dirname(current_dir), 'Database')     
        if not os.path.exists(database_dir):
            os.makedirs(database_dir)       
        
        db_file = os.path.join(database_dir, 'Ledshelf.db')
        sysDb_file = os.path.join(database_dir, 'System.db')

    createSystemDb(sysDb_file, system)
    createLedshelfDb(db_file)
