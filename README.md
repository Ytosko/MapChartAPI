# MapChart API

A Node.js API that generates high-quality, 16:9 GeoChart images using Google Charts and Puppeteer.

## Features

- **Generates 1920x1080 (16:9) images** of the world map.
- **Custom Color Scheme**:
  - **No Data / Default**: `#D0D0D0` (Light Gray)
  - **Data Gradient**: `#BBC3CF` (Light Blue-Grey) to `#215BAE` (Deep Blue)
- **Docker Support**: Ready for deployment with Docker and Coolify.

## Prerequisites

- Node.js (v18+)
- OR Docker & Docker Compose

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd MapChartAPI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node index.js
   ```
   The server runs on port **3000**.

## Usage

### Endpoint
`POST /geochart`

### Request Body
Send a JSON object where keys are country names and values are numeric data.

**Example Payload:**
```json
{
  "India": 200,
  "USA": 100,
  "Nigeria": 50,
  "Germany": 75,
  "Brazil": 80
}
```

### Example Request (curl)

**Windows (PowerShell):**
*Note: Use `curl.exe` to avoid PowerShell's alias issues.*
```powershell
curl.exe -X POST -H "Content-Type: application/json" -d '{"India": 200, "USA": 100}' http://localhost:3000/geochart -o map.png
```

**Linux/Mac:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"India": 200, "USA": 100}' http://localhost:3000/geochart -o map.png
```

## Docker Deployment

This project includes a `Dockerfile` and `docker-compose.yml` for easy deployment.

### Run with Docker Compose
```bash
docker-compose up -d --build
```

The API will be available at `http://localhost:3000/geochart`.

### Deploying to Coolify
1. Connect your repository to Coolify.
2. Select **Docker Compose** as the build pack.
3. Deploy!
