import os
import re

bundle_root = os.path.join(os.getcwd(), "build", "static")


def rename_files(extension):
    bundle_files = os.listdir(os.path.join(bundle_root, extension))
    pattern = re.compile(fr"main(\.[\d\w]*)\.{extension}")
    hash = re.match(pattern, bundle_files[0]).group(1)
    for file in bundle_files:
        file_path = os.path.join(bundle_root, extension, file)
        new_file_path = re.sub(hash, "", file_path)
        with open(file_path, "r") as f:
            content = f.read()
            new_content = re.sub(hash, "", content)
        os.remove(file_path)
        with open(new_file_path, "w") as f:
            f.write(new_content)
    return hash


html_file = os.path.join(os.getcwd(), "build", "index.html")
js_hash = rename_files("js")
css_hash = rename_files("css")

with open(html_file) as f:
    content = f.read()
    new_content = re.sub(js_hash, "", content)
    new_content = re.sub(css_hash, "", new_content)

with open(html_file, "w") as f:
    f.write(new_content)