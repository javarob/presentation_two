function buildMetadata(year) {

    // Use `d3.json` to Fetch the Metadata for a Sample
    d3.json(`/stockdata`).then((data) => {

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

    d3.json(`/stockdata`).then((data) => {
        // Build a Bubble Chart using the sample data
        var trace1 = {
            x: data.otu_ids,
            y: data.sample_values,
            mode: 'markers',
            text: data.otu_labels,
            marker: {
                color: data.otu_ids,
                size: data.sample_values,
                colorscale: "Blues"
            }
        };
        // Make into list
        var trace1 = [trace1];
        var layout = {
            title: "OTU ID",
            showlegend: false,
            height: 600,
            width: 1500
        };
        Plotly.newPlot("bubble", trace1, layout);

        // Build Pie Chart
        // Use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).
        var trace2 = [{
            values: data.sample_values.slice(0, 10),
            labels: data.otu_ids.slice(0, 10),
            hovertext: data.otu_labels.slice(0, 10),
            type: "pie",
            marker: {
                colorscale: "Blues"
            }
        }];
        var layout2 = {
            showlegend: true,
            height: 400,
            width: 500
        };
        Plotly.newPlot("pie", trace2, layout2);

    })
}


function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    //Use the list of sample names to populate the select options
    d3.json("/api/years").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample.year)
                .property("value", sample.year);
        });
        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });

}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
// Collapse



