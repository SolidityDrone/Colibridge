from flask import Flask, request, jsonify
import subprocess
import json
from flask_cors import CORS

PUBLISHER_PATH= "./risc0/zkvm/colibri/target/release/publisher"

def parse_output(output_string):
    output = {
        "seal_hex": None,
        "image_id": None,
        "post_state_digest": None,
        "journal": None
    }

    # Split the output string by newline and iterate through each line
    for line in output_string.split('\n'):
        # Split each line by ':'
        parts = line.split(':')
        if len(parts) == 2:
            key = parts[0].strip()
            value = parts[1].strip()
            # Assign value to corresponding key in the output dictionary
            if key == "seal_hex":
                output["seal_hex"] = value.strip('"')
            elif key == "Image ID":
                output["image_id"] = value.strip()
            elif key == "Post State Digest":
                output["post_state_digest"] = value.strip()
            elif key == "Journal":
                output["journal"] = value.strip('"')

    return output

app = Flask(name)
CORS(app)  # Enable CORS for all routes

@app.route('/publish', methods=['POST'])
def publish():
    # Check if all required parameters are present in the request
    required_params = ['rpc_url', 'to_chainid', 'from_chainid', 'contract_address', 'account_address', 'amount', 'bonsai_key']
    missing_params = [param for param in required_params if param not in request.json]
    if missing_params:
        return jsonify({'error': f'Missing parameters: {", ".join(missing_params)}'}), 400

    # Retrieve inputs from the request
    rpc_url = request.json['rpc_url']
    to_chainid = request.json['to_chainid']
    from_chainid = request.json['from_chainid']
    contract_address = request.json['contract_address']
    account_address = request.json['account_address']
    amount = request.json['amount']
    bonsai_key = request.json['bonsai_key']

    # Form the command with the provided inputs
    command = [
        PUBLISHER_PATH,
        "--rpc-url", rpc_url,
        "--from-chainid", from_chainid,
        "--to-chainid", to_chainid,
        "--contract-address", contract_address,
        "--account-address", account_address,
        "--amount", amount,
        "--bonsai-key", bonsai_key
    ]

    try:
        # Execute the command
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        
        # Parse the output
        parsed_output = parse_output(result.stdout)
        
        # Return the parsed output as JSON
        return jsonify(parsed_output), 200
      
    except subprocess.CalledProcessError as e:
        return jsonify({'error': "An error occurred while processing the request"}), 500

if name == 'main':
    app.run(host='0.0.0.0',debug=True, port=5004, ssl_context=('cert/cert.pem', 'cert/ck.pem'))