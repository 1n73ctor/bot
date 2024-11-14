from binance.client import Client

client = Client()
exchange_info = client.futures_exchange_info()
usdt = set()

for s in exchange_info['symbols']:
    if s["symbol"].endswith('USDT'):
        usdt.add(s["symbol"].lower())  # Convert symbols to lowercase as shown in your desired format

# Format the output as a string
output = "{" + ",".join(f"'{symbol}'" for symbol in sorted(usdt)) + "}"

# Print the output
print(output)

# Print the total count of symbols
print(len(usdt))
