"""
Test client for ProxyShield-11 API.

Usage:
    python -m tests.test_client
    python -m tests.test_client --url http://localhost:8000
"""

import argparse
import json
import sys
from datetime import datetime, timezone

import requests


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

DEFAULT_BASE_URL = "http://localhost:8000"
DEFAULT_TIMEOUT = 10  # seconds


# ---------------------------------------------------------------------------
# Sample Test Data
# ---------------------------------------------------------------------------

SAMPLE_EVENTS = [
    {
        "name": "Low Risk - Normal User",
        "payload": {
            "shield_id": "sid_1001",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "ip_address": "192.168.1.100",
            "ip_country": "India",
            "device_type": "desktop",
            "browser": "Chrome",
            "os": "Windows",
            "login_hour": 14,
            "request_frequency": 5,
            "is_proxy": False,
        },
    },
    {
        "name": "Medium Risk - High Frequency",
        "payload": {
            "shield_id": "sid_2002",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "ip_address": "10.0.0.50",
            "ip_country": "USA",
            "device_type": "mobile",
            "browser": "Safari",
            "os": "iOS",
            "login_hour": 10,
            "request_frequency": 75,
            "is_proxy": False,
        },
    },
    {
        "name": "High Risk - Proxy + Unusual Hour",
        "payload": {
            "shield_id": "sid_9876",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "ip_address": "49.205.xxx.xxx",
            "ip_country": "India",
            "device_type": "mobile",
            "browser": "Chrome",
            "os": "Android",
            "login_hour": 3,
            "request_frequency": 12,
            "is_proxy": True,
        },
    },
    {
        "name": "Critical Risk - All Flags",
        "payload": {
            "shield_id": "sid_9876",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "ip_address": "203.0.113.50",
            "ip_country": "India",
            "device_type": "tablet",
            "browser": "Firefox",
            "os": "Android",
            "login_hour": 3,
            "request_frequency": 100,
            "is_proxy": True,
        },
    },
]


# ---------------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------------

def pretty_print(data: dict, title: str = "") -> None:
    """Pretty print JSON data with optional title."""
    if title:
        print(f"\n{'=' * 60}")
        print(f"  {title}")
        print(f"{'=' * 60}")
    print(json.dumps(data, indent=2, default=str))


def test_health(base_url: str, timeout: int) -> bool:
    """Test health endpoint."""
    print("\n[TEST] Health Check")
    print("-" * 40)
    
    try:
        response = requests.get(
            f"{base_url}/health",
            timeout=timeout,
        )
        response.raise_for_status()
        pretty_print(response.json())
        print(f"Status: {response.status_code} OK")
        return True
        
    except requests.exceptions.Timeout:
        print(f"ERROR: Request timed out after {timeout}s")
        return False
        
    except requests.exceptions.ConnectionError:
        print(f"ERROR: Cannot connect to {base_url}")
        print("Is the server running?")
        return False
        
    except requests.exceptions.HTTPError as e:
        print(f"ERROR: HTTP {e.response.status_code}")
        print(e.response.text)
        return False


def test_score(base_url: str, timeout: int, event: dict) -> dict | None:
    """Test score endpoint with sample event."""
    print(f"\n[TEST] {event['name']}")
    print("-" * 40)
    
    print("Request:")
    pretty_print(event["payload"])
    
    try:
        response = requests.post(
            f"{base_url}/score",
            json=event["payload"],
            headers={"Content-Type": "application/json"},
            timeout=timeout,
        )
        response.raise_for_status()
        
        result = response.json()
        print("\nResponse:")
        pretty_print(result)
        
        # Print summary
        print(f"\n  Risk Score: {result.get('risk_score', 'N/A')}")
        print(f"  Risk Level: {result.get('risk_level', 'N/A')}")
        print(f"  Action: {result.get('action', 'N/A')}")
        print(f"  Flags: {result.get('flags', [])}")
        print(f"  Latency: {result.get('latency_ms', 'N/A')}ms")
        print(f"  Status: {response.status_code} OK")
        
        return result
        
    except requests.exceptions.Timeout:
        print(f"ERROR: Request timed out after {timeout}s")
        return None
        
    except requests.exceptions.ConnectionError:
        print(f"ERROR: Cannot connect to {base_url}")
        return None
        
    except requests.exceptions.HTTPError as e:
        print(f"ERROR: HTTP {e.response.status_code}")
        try:
            pretty_print(e.response.json())
        except Exception:
            print(e.response.text)
        return None


# ---------------------------------------------------------------------------
# Main Entry Point
# ---------------------------------------------------------------------------

def main():
    """Run all tests."""
    parser = argparse.ArgumentParser(description="ProxyShield-11 Test Client")
    parser.add_argument(
        "--url",
        default=DEFAULT_BASE_URL,
        help=f"Base URL (default: {DEFAULT_BASE_URL})",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=DEFAULT_TIMEOUT,
        help=f"Request timeout in seconds (default: {DEFAULT_TIMEOUT})",
    )
    args = parser.parse_args()
    
    print("=" * 60)
    print("  ProxyShield-11 Test Client")
    print(f"  Target: {args.url}")
    print("=" * 60)
    
    # Test health endpoint
    if not test_health(args.url, args.timeout):
        print("\nHealth check failed. Aborting tests.")
        sys.exit(1)
    
    # Test score endpoint with all samples
    results = []
    for event in SAMPLE_EVENTS:
        result = test_score(args.url, args.timeout, event)
        results.append(result)
    
    # Summary
    print("\n" + "=" * 60)
    print("  TEST SUMMARY")
    print("=" * 60)
    passed = sum(1 for r in results if r is not None)
    print(f"  Passed: {passed}/{len(results)}")
    print("=" * 60)
    
    sys.exit(0 if passed == len(results) else 1)


if __name__ == "__main__":
    main()
