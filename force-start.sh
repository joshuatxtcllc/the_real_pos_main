#!/bin/bash
echo "FORCE KILLING ALL PROCESSES"
pkill -9 -f node
pkill -9 -f tsx
pkill -9 -f vite
pkill -9 -f build
sleep 2
echo "STARTING NUCLEAR SERVER"
node emergency-nuclear.mjs &
echo "SERVER STARTED - PID: $!"
sleep 3
echo "CHECKING PORT 5000"
curl -s http://localhost:5000/ | head -20