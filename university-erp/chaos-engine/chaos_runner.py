import asyncio
import aiohttp
import redis.asyncio as redis
import os
import json
import time
import random

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
GATEWAY_URL = os.getenv("GATEWAY_URL", "http://backend-router:8000")
BUSINESS_URL = os.getenv("BUSINESS_URL", "http://backend-business:8080")

class ChaosEngine:
    def __init__(self):
        self.mode = "OFF"  # OFF, TEST, PROD
        self.redis_client = redis.from_url(REDIS_URL)
        self.session = None

    async def listen_commands(self):
        pubsub = self.redis_client.pubsub()
        await pubsub.subscribe("chaos:commands")
        print("Chaos Engine listening for commands on 'chaos:commands'...")
        
        async for message in pubsub.listen():
            if message['type'] == 'message':
                data = json.loads(message['data'])
                new_mode = data.get("mode", self.mode)
                if new_mode != self.mode:
                    print(f"Switching mode from {self.mode} to {new_mode}")
                    self.mode = new_mode

    async def generate_attack(self, target_url, attack_type="fz"):
        if not self.session:
            return
            
        start_time = time.time()
        try:
            # Simulate different attack patterns
            headers = {"X-Chaos-Attack": attack_type, "User-Agent": f"ChaosBot/1.0-{random.randint(1,1000)}"}
            
            # Mix of valid and invalid endpoints
            endpoint = "/api/auth/health" if random.random() > 0.5 else "/api/business/health"
            
            async with self.session.get(f"{target_url}{endpoint}", headers=headers, timeout=2.0) as response:
                status = response.status
                await response.text()  # drain
        except Exception as e:
            status = 0 # connection error / timeout
            
        latency = (time.time() - start_time) * 1000
        
        # Broadcast telemetry
        test_prod = "PROD" if self.mode == "PROD" else "TEST"
        telemetry = {
            "source": "chaos-engine",
            "target": target_url,
            "attack_type": attack_type,
            "status": status,
            "latency_ms": latency,
            "env": test_prod,
            "timestamp": time.time()
        }
        await self.redis_client.publish("chaos:telemetry", json.dumps(telemetry))


    async def run_chaos_loop(self):
        self.session = aiohttp.ClientSession()
        
        while True:
            if self.mode == "OFF":
                await asyncio.sleep(2)
                continue
                
            # If TEST, send moderate traffic. If PROD, send aggressive traffic
            concurrency = 5 if self.mode == "TEST" else 50
            
            tasks = []
            for _ in range(concurrency):
                # 80% Gateway attack, 20% Direct Business Backend attack (to test internal resilience)
                target = GATEWAY_URL if random.random() < 0.8 else BUSINESS_URL
                attack_type = random.choice(["DDoS", "Fuzzing", "Scraping"])
                tasks.append(self.generate_attack(target, attack_type))
                
            await asyncio.gather(*tasks)
            
            # Pause between waves
            sleep_time = 0.5 if self.mode == "TEST" else 0.1
            await asyncio.sleep(sleep_time)

    async def main(self):
        await asyncio.gather(
            self.listen_commands(),
            self.run_chaos_loop()
        )

if __name__ == "__main__":
    engine = ChaosEngine()
    asyncio.run(engine.main())
