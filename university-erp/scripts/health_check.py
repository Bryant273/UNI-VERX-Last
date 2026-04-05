import requests
import sys

SERVICES = {
    "Java Business": "http://localhost:8080/actuator/health",
    "Python Blue AI": "http://localhost:8002/health",
    "Go Gateway": "http://localhost:8000/health",
    "Angular Frontend": "http://localhost:4200"
}

def test_services():
    print("Starting Global System Health Check...")
    all_ok = True
    for name, url in SERVICES.items():
        try:
            response = requests.get(url, timeout=5)
            if response.status_code < 400:
                print(f"OK {name}: UP ({response.status_code})")
            else:
                print(f"ERR {name}: DOWN ({response.status_code})")
                all_ok = False
        except Exception as e:
            print(f"ERR {name}: UNREACHABLE ({str(e)})")
            all_ok = False
    
    if all_ok:
        print("\nALL SYSTEMS OPERATIONAL - Parity Verified.")
    else:
        print("\nSOME SYSTEMS ARE DOWN. Check logs for details.")
        sys.exit(1)

if __name__ == "__main__":
    test_services()
