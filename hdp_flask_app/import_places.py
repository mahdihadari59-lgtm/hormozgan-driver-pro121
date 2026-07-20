import json
import sqlite3

JSON_FILE = "data/import/bnd.js.txt"
DB_FILE = "hdp_pro.db"

with open(JSON_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

conn = sqlite3.connect(DB_FILE)
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS places(
    id TEXT PRIMARY KEY,
    cat TEXT,
    name TEXT,
    lat REAL,
    lon REAL,
    city TEXT DEFAULT 'بندرعباس',
    source TEXT DEFAULT 'OSM'
)
""")

count = 0

for item in data.get("results", []):
    cur.execute("""
        INSERT OR REPLACE INTO places
        (id,cat,name,lat,lon)
        VALUES(?,?,?,?,?)
    """, (
        str(item.get("id")),
        item.get("cat"),
        item.get("name"),
        item.get("lat"),
        item.get("lon")
    ))
    count += 1

conn.commit()
conn.close()

print(f"Imported {count} places.")
