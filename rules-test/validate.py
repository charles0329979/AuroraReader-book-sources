"""Structural release gate; device acceptance is still required for changed rules."""
import json
from pathlib import Path
from urllib.parse import urlsplit
catalog = json.loads(Path(__file__).with_name("catalog.json").read_text(encoding="utf-8"))
assert catalog["schemaVersion"] == 1
assert isinstance(catalog["revision"], int) and catalog["revision"] > 0
rules = catalog["sources"]
assert isinstance(rules, list) and rules
identities = set()
for rule in rules:
    assert rule["bookSourceName"].strip()
    identity = rule.get("bookSourceKey") or rule["bookSourceUrl"]
    assert identity not in identities, identity
    identities.add(identity)
    for field in ("bookSourceUrl", "searchUrl"):
        url = urlsplit(rule[field])
        assert url.hostname and not url.username and not url.password
        assert url.scheme in {"https", "http"}, identity  # App enforces reviewed legacy transport exceptions.
    assert isinstance(rule["ruleSearch"], dict)
    assert isinstance(rule["ruleContent"], dict)
print(f"Validated {len(rules)} rule records; revision {catalog['revision']}")
