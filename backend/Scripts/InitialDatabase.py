import os
import sqlite3
import platform

def create_database_and_insert_data(db_file):

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

        password = "admin"
        saltRounds = 12

        # Insert User
        cursor.execute('INSERT INTO user (username, password, role) VALUES (?, ?, ?)', ('admin', '$2b$12$vVr6P4EVInVpFjC45/kGNeEV2jGF9wsoUoST7rCBGT3vkmx3TB7Ou', 1))
        print("Daten in Tabelle 'user' eingefügt.")

        #Insert Role
        cursor.execute('INSERT INTO role (name) VALUES (?)', ('Administrator',))
        cursor.execute('INSERT INTO role (name) VALUES (?)', ('Benutzer',))
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

        # Saving changes
        conn.commit()

    except sqlite3.Error as e:
        print(f"Fehler beim Erstellen der Tabellen oder beim Einfügen von Daten: {e}")
    finally:
       
        conn.close()
        print("Datenbankverbindung geschlossen.")

def create_sysDatabase_and_insert_data(sysDB_file, system):

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
            cursor.execute('INSERT INTO system (backUpPath, dataBasepath) VALUES (?, ?)', ('./home/ledshelf/database/backup', './home/ledshelf/database/system.db'))
        elif system == 'Windows':
            cursor.execute('INSERT INTO system (backUpPath, dataBasepath) VALUES (?, ?)', ('./Database/BackUp', './Database/System.db'))
    
        conn.commit()       

    except sqlite3.Error as e:
        print(f"Fehler beim Erstellen der Tabelle oder beim Einfügen von Daten: {e}")

    finally:
        conn.close()

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Check Operating system
    system = platform.system()

    if system == 'Linux':
        # Production path /home/ledshelf/       
        database_dir = '/home/ledshelf'
        if not os.path.exists(database_dir):
            os.makedirs(database_dir)
            db_file = os.path.join(database_dir, 'ledshelf.db')
            sysDb_file = os.path.join(database_dir, 'system.db')

    elif system == 'Windows':
        database_dir = os.path.join(os.path.dirname(current_dir), 'Database')     
        if not os.path.exists(database_dir):
            os.makedirs(database_dir)
            print(f"Database directory was created: {database_dir}")       
        
        db_file = os.path.join(database_dir, 'Ledshelf.db')
        sysDb_file = os.path.join(database_dir, 'System.db')
    
    if not os.path.exists(db_file):
        create_database_and_insert_data(db_file)
    
    create_sysDatabase_and_insert_data(sysDb_file, system)
