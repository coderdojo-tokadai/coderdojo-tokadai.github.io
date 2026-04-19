#!/usr/bin/env python3
"""
Validates that all data-i18n keys used in HTML files exist in all 4 language
sections of i18n.js, and reports HTML default text vs i18n.js ja mismatches.
"""
import sys
import os
import re
import json
from html.parser import HTMLParser

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML_FILES = ["index.html", "mentor.html", "venue.html", "news.html", "contact.html"]
LANGS = ["ja", "en", "pt", "vi"]


class I18nParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.keys = {}  # key -> (default_text, tag, html_source)
        self._stack = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        key = attrs_dict.get("data-i18n") or attrs_dict.get("data-i18n-html")
        is_html = "data-i18n-html" in attrs_dict
        self._stack.append((tag, key, is_html, []))

    def handle_endtag(self, tag):
        if not self._stack:
            return
        # pop matching open tag
        for i in range(len(self._stack) - 1, -1, -1):
            if self._stack[i][0] == tag:
                open_tag, key, is_html, parts = self._stack.pop(i)
                text = "".join(parts).strip()
                if key and key not in self.keys:
                    self.keys[key] = (text, is_html)
                # propagate text up to parent (as raw HTML if needed)
                if self._stack:
                    parent = self._stack[-1]
                    # append reconstructed tag to parent's parts
                    inner = "".join(parts)
                    self._stack[-1][3].append(f"<{open_tag}>{inner}</{open_tag}>")
                break

    def handle_data(self, data):
        if self._stack:
            self._stack[-1][3].append(data)

    def handle_entityref(self, name):
        if self._stack:
            self._stack[-1][3].append(f"&{name};")

    def handle_charref(self, name):
        if self._stack:
            self._stack[-1][3].append(f"&#{name};")


def extract_html_keys(filepath):
    with open(filepath, encoding="utf-8") as f:
        src = f.read()
    parser = I18nParser()
    parser.feed(src)
    return parser.keys  # {key: (default_text, is_html)}


def parse_i18n_js(filepath):
    with open(filepath, encoding="utf-8") as f:
        src = f.read()
    sections = {}
    for lang in LANGS:
        # Find "  ja: {" style section inside const T = { ... }
        pattern = rf"^\s+{lang}\s*:\s*\{{(.*?)\n\s+\}}[,\n]"
        m = re.search(pattern, src, re.DOTALL | re.MULTILINE)
        if not m:
            continue
        block = m.group(1)
        keys = {}
        # Single-quoted key + backtick value
        for km in re.finditer(r"'([^']+)'\s*:\s*`(.*?)`", block, re.DOTALL):
            keys[km.group(1)] = km.group(2).strip()
        # Single-quoted key + single-quoted value
        for km in re.finditer(r"'([^']+)'\s*:\s*'((?:[^'\\]|\\.)*)'", block):
            if km.group(1) not in keys:
                keys[km.group(1)] = km.group(2).strip()
        # Single-quoted key + double-quoted value (e.g. value contains apostrophe)
        for km in re.finditer(r"'([^']+)'\s*:\s*\"((?:[^\"\\]|\\.)*)\"", block):
            if km.group(1) not in keys:
                keys[km.group(1)] = km.group(2).strip()
        # Double-quoted key + double-quoted value
        for km in re.finditer(r'"([^"]+)"\s*:\s*"((?:[^"\\]|\\.)*)"', block):
            if km.group(1) not in keys:
                keys[km.group(1)] = km.group(2).strip()
        sections[lang] = keys
    return sections


def normalize(s):
    return re.sub(r"\s+", " ", s).strip()


def main():
    i18n_path = os.path.join(BASE, "i18n.js")
    if not os.path.exists(i18n_path):
        print("ERROR: i18n.js not found")
        sys.exit(1)

    sections = parse_i18n_js(i18n_path)
    missing_langs = [l for l in LANGS if l not in sections]
    if missing_langs:
        print(f"ERROR: Could not parse language sections: {missing_langs}")
        sys.exit(1)

    all_html_keys = {}  # key -> (default_text, is_html, source_file)
    for fname in HTML_FILES:
        fpath = os.path.join(BASE, fname)
        if not os.path.exists(fpath):
            continue
        keys = extract_html_keys(fpath)
        for k, (text, is_html) in keys.items():
            if k not in all_html_keys:
                all_html_keys[k] = (text, is_html, fname)

    issues = []

    # Check each HTML key exists in all language sections
    for key in sorted(all_html_keys):
        for lang in LANGS:
            if key not in sections[lang]:
                issues.append(f"MISSING  [{lang}] '{key}'  (used in {all_html_keys[key][2]})")

    # Check HTML ja default text vs i18n.js ja value (text-only keys)
    for key, (html_text, is_html, fname) in sorted(all_html_keys.items()):
        if is_html:
            continue  # skip data-i18n-html, markup differences are expected
        if key not in sections["ja"]:
            continue  # already reported above
        ja_val = normalize(sections["ja"][key])
        html_norm = normalize(html_text)
        # Strip simple inline tags from HTML default for comparison
        html_stripped = normalize(re.sub(r"<[^>]+>", "", html_text))
        if html_stripped and ja_val and html_stripped != ja_val:
            issues.append(
                f"MISMATCH '{key}'\n"
                f"  HTML default : {html_stripped[:120]}\n"
                f"  i18n.js [ja] : {ja_val[:120]}"
            )

    if issues:
        print("=== i18n check: issues found ===")
        for issue in issues:
            print(issue)
        print(f"\nTotal: {len(issues)} issue(s)")
    else:
        print("i18n check: OK — all keys present and ja defaults match")

    return 0 if not issues else 1


if __name__ == "__main__":
    sys.exit(main())
