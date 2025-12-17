const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/geochart', async (req, res) => {
  try {
    const inputData = req.body;
    // Example input: {"India": 200, "USA": 100}

    // Transform data for Google Charts
    // Header row + data rows
    const chartData = [['Country', 'Value']];
    for (const [country, value] of Object.entries(inputData)) {
      chartData.push([country, value]);
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    });

    const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
            <script type="text/javascript">
              google.charts.load('current', {
                'packages':['geochart']
              });
              google.charts.setOnLoadCallback(drawRegionsMap);

              function drawRegionsMap() {
                var data = google.visualization.arrayToDataTable(${JSON.stringify(chartData)});

                var options = {
                  colorAxis: {colors: ['#BBC3CF', '#215BAE']}, // Light blue-grey to Strong Blue
                  backgroundColor: '#ffffff',
                  datalessRegionColor: '#D0D0D0',
                  defaultColor: '#D0D0D0', 
                  legend: 'none',
                  // Ensure we show the world or specific region? Default is world.
                };

                var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

                google.visualization.events.addListener(chart, 'ready', function () {
                    window.chartReady = true;
                });

                chart.draw(data, options);
              }
            </script>
            <style>
                body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
                #regions_div { width: 100%; height: 100%; }
            </style>
          </head>
          <body>
            <div id="regions_div"></div>
          </body>
        </html>
        `;


    await page.setContent(htmlContent);

    // Wait for chart ready signal
    await page.waitForFunction('window.chartReady === true', { timeout: 10000 });

    const screenshot = await page.screenshot({ fullPage: true });

    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(screenshot);

  } catch (error) {
    console.error('Error generating chart:', error);
    res.status(500).send({ error: 'Failed to generate chart', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`GeoChart API listening at http://localhost:${port}`);
});
