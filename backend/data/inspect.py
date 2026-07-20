import json

path = "/data/data/com.termux/files/home/hormozgan-driver-pro121/hdp_flask_app/data/hormozgan_knowledge.json"

with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

print("TYPE:", type(data))
print("COUNT:", len(data))

for i, (k, v) in enumerate(data.items()):

    print("\nKEY:", k)
    print("VALUE TYPE:", type(v))

    if isinstance(v, str):
        print("TEXT:", v[:1000])

    elif isinstance(v, dict):
        print("DICT KEYS:", list(v.keys())[:20])

    elif isinstance(v, list):
        print("LIST LEN:", len(v))
        print("FIRST ITEM:", v[0] if len(v) else None)

    print("=" * 60)

    if i >= 10:
        break
