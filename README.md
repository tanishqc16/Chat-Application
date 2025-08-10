Scalable Real-Time Chat Application
Overview
This project is a real-time chat application built with a React frontend and a Node.js + Socket.IO backend. The system supports multiple chat rooms where users can join and exchange messages instantly.

Initially, the application could handle around 800–900 concurrent users. By integrating Node.js clustering and a Redis-based Socket.IO adapter, we scaled the system to handle 70,000–80,000 concurrent users in stress testing scenarios. This was achieved without changing the core chat functionality, purely through backend scalability improvements.

Scaling Approach
Clustering
Node.js runs on a single thread by default, meaning one process can only utilize a single CPU core. To take full advantage of multi-core systems, we used the Node.js cluster module to spawn multiple worker processes, one for each CPU core. This allowed the backend to handle far more concurrent WebSocket connections by distributing load across multiple workers.

Redis Adapter
Clustering alone does not allow WebSocket events to be shared between workers. To solve this, we integrated the @socket.io/redis-adapter package. Redis acts as a message broker between different worker processes, ensuring that a message sent from a client connected to one worker is broadcasted to all clients connected to other workers.

This setup allowed horizontal scaling of WebSocket connections, enabling real-time communication at very high concurrency.

Stress Testing
We used Artillery, a modern load-testing toolkit, to simulate thousands of virtual users joining rooms and sending messages simultaneously.

The process involved:

Defining test scenarios to simulate chat activity.

Running the tests against the clustered and Redis-backed server.

Measuring maximum concurrent users and server response times.

Results:

Before scaling: 800–900 concurrent users

After clustering + Redis: 70,000–80,000 concurrent users

Installation and Setup
Prerequisites
Node.js (v18 or later recommended)

npm (comes with Node.js)

Redis server installed and running locally

Backend Installation
Navigate to the server folder:

bash
Copy
Edit
cd server
Install dependencies:

nginx
Copy
Edit
npm install
Frontend Installation
Navigate to the client folder:

bash
Copy
Edit
cd client
Install dependencies:

nginx
Copy
Edit
npm install
Starting the Application
Start the Redis server:

pgsql
Copy
Edit
redis-server
Start the backend server (with clustering entry file if applicable):

nginx
Copy
Edit
node cluster.js
Start the frontend:

sql
Copy
Edit
npm start
Project Structure
server/ – Node.js + Socket.IO backend with clustering and Redis integration

client/ – React frontend for chat interface

cluster.js – Entry point for running the backend with clustering enabled

index.js – Main server logic for handling socket connections

Notes
Ensure Redis is running before starting the backend server.

Ports used by the application should be free before running.
