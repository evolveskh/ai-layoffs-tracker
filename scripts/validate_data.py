#!/usr/bin/env python3
"""Validate data consistency before committing updates.

Run this after editing events.json and companies.json.
Exits with code 1 if any check fails.
"""
import json
import sys
import os

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

errors = []

def load(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path) as f:
        return json.load(f)

def check(condition, msg):
    if not condition:
        errors.append(msg)
        print(f"  ✗ {msg}")
    return condition

def validate_events(events):
    ids = set()
    for i, e in enumerate(events):
        prefix = f"event[{i}] ({e.get('id', '?')})"
        check("id" in e, f"{prefix}: missing 'id'")
        if "id" in e:
            check(e["id"] not in ids, f"{prefix}: duplicate id '{e['id']}'")
            ids.add(e["id"])
            check(e["id"].startswith("evt-"), f"{prefix}: id should start with 'evt-'")
        check("company_id" in e and e["company_id"], f"{prefix}: missing or empty 'company_id'")
        check("type" in e and e["type"] in ("layoff", "investment"), f"{prefix}: invalid type '{e.get('type')}'")
        check("date" in e, f"{prefix}: missing 'date'")
        if "date" in e:
            parts = e["date"].split("-")
            check(len(parts) == 3 and len(parts[0]) == 4, f"{prefix}: invalid date format '{e['date']}' (expected YYYY-MM-DD)")
        check("description" in e and e["description"], f"{prefix}: missing or empty 'description'")
        check("source_url" in e and e["source_url"], f"{prefix}: missing 'source_url'")
        check("source_name" in e and e["source_name"], f"{prefix}: missing 'source_name'")
        check("verified" in e, f"{prefix}: missing 'verified'")
        if e.get("type") == "layoff":
            check(e.get("number") is None or isinstance(e["number"], (int, float)),
                  f"{prefix}: 'number' should be int or null for layoff type")
            check(e["number"] is not None, f"{prefix}: layoff event has no 'number' (amount of people)")
        if e.get("type") == "investment":
            check(e.get("amount") is None or isinstance(e["amount"], (int, float)),
                  f"{prefix}: 'amount' should be int or null for investment type")
    return ids

def validate_companies(companies, valid_event_ids, valid_company_ids):
    for i, c in enumerate(companies):
        prefix = f"company[{i}] ({c.get('id', '?')})"
        check("id" in c and c["id"], f"{prefix}: missing 'id'")
        check("name" in c and c["name"], f"{prefix}: missing 'name'")
        check("total_employees" in c, f"{prefix}: missing 'total_employees'")
        check("last_updated" in c, f"{prefix}: missing 'last_updated'")
        check("total_layoffs" in c, f"{prefix}: missing 'total_layoffs'")
        check("total_investment" in c, f"{prefix}: missing 'total_investment'")

    # Check no companies were removed
    check(len(companies) == len(valid_company_ids),
          f"Company count changed: was {len(valid_company_ids)}, now {len(companies)}")

def validate_recalculation(events, companies):
    """Verify computed fields in companies match raw event data."""
    for c in companies:
        cid = c["id"]
        company_events = [e for e in events if e["company_id"] == cid]
        expected_layoffs = sum(
            e.get("number") or 0 for e in company_events if e.get("type") == "layoff"
        )
        expected_investment = sum(
            e.get("amount") or 0 for e in company_events if e.get("type") == "investment"
        )

        # Allow small floating point fudge
        if abs(c["total_layoffs"] - expected_layoffs) > 1:
            check(False, f"{cid}: total_layoffs mismatch — events sum to {expected_layoffs}, company says {c['total_layoffs']}")
        if abs(c["total_investment"] - expected_investment) > 1:
            check(False, f"{cid}: total_investment mismatch — events sum to {expected_investment}, company says {c['total_investment']}")

def validate_git_keeps_existing(original_events, original_companies, new_events, new_companies):
    """Ensure no existing events or companies were removed."""
    orig_ids = {e["id"] for e in original_events if "id" in e}
    new_ids = {e["id"] for e in new_events if "id" in e}

    removed = orig_ids - new_ids
    if removed:
        check(False, f"Events removed from data/events.json: {sorted(removed)}")

    orig_cids = {c["id"] for c in original_companies if "id" in c}
    new_cids = {c["id"] for c in new_companies if "id" in c}

    removed_c = orig_cids - new_cids
    if removed_c:
        check(False, f"Companies removed from data/companies.json: {sorted(removed_c)}")

def main():
    print("🔍 Validating data consistency...\n")

    # Validate events
    events = load("events.json")
    print(f"Events: {len(events)}")
    event_ids = validate_events(events)

    # Validate companies
    companies = load("companies.json")
    company_ids = {c["id"] for c in companies if "id" in c}
    print(f"Companies: {len(companies)}")
    validate_companies(companies, event_ids, company_ids)

    # Validate computed fields
    print("\n📐 Validating calculations...")
    validate_recalculation(events, companies)

    # Git-based check: if old versions exist, ensure nothing was removed
    old_events_path = os.path.join(DATA_DIR, ".events.json.bak")
    old_companies_path = os.path.join(DATA_DIR, ".companies.json.bak")
    if os.path.exists(old_events_path) and os.path.exists(old_companies_path):
        print("\n🔄 Checking against previous version...")
        old_events = json.load(open(old_events_path))
        old_companies = json.load(open(old_companies_path))
        validate_git_keeps_existing(old_events, old_companies, events, companies)

    if errors:
        print(f"\n❌ {len(errors)} validation error(s) found — DO NOT COMMIT!")
        sys.exit(1)
    else:
        print(f"\n✅ All checks passed — data is consistent.")
        sys.exit(0)

if __name__ == "__main__":
    main()
