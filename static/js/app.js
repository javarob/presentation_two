function buildMetadata(sample) {

  // Use `d3.json` to Fetch the Metadata for a Sample
  d3.json(`/metadata/${sample}`).then((data) => {

    // Select the Panel with id of `#sample-metadata`
    var sampleMD = d3.select("#sample-metadata");

    // Clear any Existing Metadata
    sampleMD.html("");

    // Use `Object.entries` to Add Each Key & Value Pair to Panel
    Object.entries(data).forEach(([key, value]) => {
      sampleMD.append("p").text(`${key}: ${value}`);
    })
  })
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {

    // Build a Bubble Chart using the sample data
    // var trace1 = {
    //   x: data.otu_ids,
    //   y: data.sample_values,
    //   mode: 'markers',
    //   text: data.otu_labels,
    //   marker: {
    //     color: data.otu_ids,
    //     size: data.sample_values,
    //     colorscale: "Blues"
    //   }
    // };
    // // Make into list
    // var trace1 = [trace1];
    // var layout = {
    //   title: "OTU ID",
    //   showlegend: false,
    //   height: 600,
    //   width: 1500
    // };
    // Plotly.newPlot("bubble", trace1, layout);

    // Build Pie Chart
    // var trace2 = [{
    //   values: data.sample_values,
    //   labels: data.otu_ids,
    //   hovertext: data.otu_labels,
    //   type: "pie",
    //   marker: {
    //     colorscale: "Blues"
    //   }
    // }];
    // var layout2 = {
    //   showlegend: true,
    //   height: 400,
    //   width: 500
    // };
    // Plotly.newPlot("pie", trace2, layout2);

    // Build Bar Chart
    var trace2 = [{
      x: data.otu_ids,
      y: data.sample_values,
      type: 'bar',
      text: data.otu_labels,
      marker: {
        color: 'rgb(142,124,195)'
      }
    }];

    var layout2 = {
      title: 'Percent Change',
      font: {
        family: 'Raleway, sans-serif'
      },
      showlegend: true,
      xaxis: {
        tickangle: -45
      },
      yaxis: {
        zeroline: false,
        gridwidth: 2
      },
      bargap: 0.05
    };

    Plotly.newPlot("bar", trace2, layout2);

  })
}

function buildLines() {

  // Use `d3.json` to fetch the data for the plot
  d3.json(`/combined_data`).then((data2) => {

    // Build Multi-series Line Chart
    var trace3 = {
      x: data2.year,
      y: data2.snp500_dollars,
      mode: 'lines',
      name: 'S&P 500 Index'
    };

    var trace4 = {
      x: data2.year,
      y: data2.dow_dollars,
      mode: 'lines',
      name: 'Dow Jones Industrials Index'
    };

    var trace5 = {
      x: data2.year,
      y: data2.tbm_dollars,
      mode: 'lines',
      name: 'TBM Portfolio'
    };

    var line_data = [trace3, trace4, trace5];

    var layout3 = {
      title: "Combined Financial Results"
    };

    Plotly.newPlot("line", line_data, layout3);

  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildLines();
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
