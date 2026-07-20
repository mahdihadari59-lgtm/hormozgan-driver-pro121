from pathlib import Path
import re

SOURCE = Path("../old_js")
TARGET = Path("../hdp_core_python/services")

TARGET.mkdir(parents=True, exist_ok=True)


def convert_js_to_py(js_file):

    text = js_file.read_text(
        encoding="utf-8",
        errors="ignore"
    )

    py = "# Auto converted from JS\n\n"

    # const -> variable
    text = re.sub(
        r'const\s+(\w+)\s*=',
        r'\1 =',
        text
    )

    # console.log
    text = text.replace(
        "console.log",
        "print"
    )

    py += text

    output = TARGET / (
        js_file.stem + ".py"
    )

    output.write_text(
        py,
        encoding="utf-8"
    )

    print("✅", output)


for js in SOURCE.glob("*.js"):
    convert_js_to_py(js)

print("🎯 تبدیل تمام شد")
