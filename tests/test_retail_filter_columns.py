import requests

BASE_URL = "http://10.145.4.32:30020/couturedbutils/retail"

# find all columns
url = f"{BASE_URL}/forecast-metadata"
response = requests.get(url=url)
response_json = response.json()
all_column_values = response_json.get("essential_columns", [])

print(all_column_values, '\n')

# check if columns are loading with each column API call
for column in all_column_values:
    url = f"{BASE_URL}/get-filters?filter_name={column}"
    response = requests.get(url=url)
    response_json = response.json()
    
    if "detail" in response_json:
        print(f"Error found in: {column} - {response_json}")

    