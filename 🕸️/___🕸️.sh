#!/bin/bash

# Get the current system time in milliseconds
system_time=$(date +%s%3N)
NOTIFICATION_TEXT="🕸️${system_time}"
MAX_WAIT_TIME=10
notification_found=false

# Step 1: Run the initial curl command
echo "Sending initial curl request..."
curl "http://localhost:8181/DC/🤖/🕸️&t=${system_time}"

# Step 2: Wait for a specific notification to appear
echo "Waiting for notification with text: '${NOTIFICATION_TEXT}' for a maximum of ${MAX_WAIT_TIME} seconds..."
start_time=$(date +%s)
while [[ $(( $(date +%s) - start_time )) -lt $MAX_WAIT_TIME ]]; do
    if termux-notification-list | grep -q "${NOTIFICATION_TEXT}"; then
        echo "Notification found! Exiting successfully."
        notification_found=true
        break
    fi
    sleep 1
done

# Step 3: Handle the outcome
if [[ "$notification_found" == "true" ]]; then
    exit 0
else
    echo "Notification not found within ${MAX_WAIT_TIME} seconds. Initiating restart process."
    
    # Run the exit curl command
    response=$(curl "http://localhost:8181/exit")
    
    # Check the response and pkill if necessary
    if [[ "$response" != "👌" ]]; then
        echo "Exit curl did not return '👌'. Killing node process."
        pkill node
    fi
    
    # Wait 1 second
    sleep 1
    
    # Restart the node process
    echo "Restarting the node service..."
    node "/storage/emulated/0/🍏/🖥️/DC/🕸️/index.js" &
fi
