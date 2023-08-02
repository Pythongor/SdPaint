import os
import re


def rename_files(extension):
    bundle_files = os.listdir(os.path.join(bundle_root, extension))
    pattern = re.compile(fr"main(\.[\d\w]*)\.{extension}")
    hash = re.match(pattern, bundle_files[0]).group(1)
    for file in bundle_files:
        file_path = os.path.join(bundle_root, extension, file)
        new_file_path = re.sub(hash, "", file_path)
        print(file_path)
        with open(file_path, "r", encoding="utf8") as f:
            content = f.read()
            new_content = re.sub(hash, "", content)
        os.remove(file_path)
        with open(new_file_path, "w", encoding="utf8") as f:
            f.write(new_content)
    return hash


def rewrite_file(file_path):
    with open(file_path, encoding="utf8") as f:
        content = f.read()
        new_content = re.sub(js_hash, "", content)
        new_content = re.sub(css_hash, "", new_content)

    with open(file_path, "w", encoding="utf8") as f:
        f.write(new_content)


bundle_root = os.path.join(os.getcwd(), "build", "static")

js_hash = rename_files("js")
css_hash = rename_files("css")
html_file = os.path.join(os.getcwd(), "build", "index.html")
manifest_file = os.path.join(os.getcwd(), "build", "asset-manifest.json")

rewrite_file(html_file)
rewrite_file(manifest_file)
