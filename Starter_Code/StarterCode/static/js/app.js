// url 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// get JSON data
d3.json(url).then(function(data) {
    console.log(data);
});

// Start up the dashboard
function init() {

    // D3 to get dropdown menu
    let dropdown = d3.select("#selDataset");

    // D3 to get sample 
    d3.json(url).then((data) => {

        // variable for names
        let names = data.names;

        // adding samples to dropdown menu
        names.forEach((id) => {

            // Value of id for each loop
            console.log(id);
            dropdown.append("option")
            .text(id)
            .property("value", id);
        });

        // get first sample
        let sample1 = names[0];

        console.log(sample1);

        // Initial plots
        buildMetadata(sample1);
        buildBarChart(sample1);
        buildBubbleChart(sample1);
    });
};

// function that populates metadata info
function buildMetadata(sample) {

    // D3 to get all of the data
    d3.json(url).then((data) => {

        // Retrieve metadata
        let metadata = data.metadata;

        // Filter value of sample
        let value = metadata.filter(result => result.id == sample);

        // log after being filtered
        console.log(value)

        // Grab first index from the array
        let valueData = value[0];

        d3.select("#sample-metadata").html("");

        // adding key and value pairs to the panel
        Object.entries(valueData).forEach(([key, value]) => {
            console.log(key, value);

            d3.select("#sample-metadata").append("h5").text('{key}: {value}');
        });
    });
};

// function that builds the bar chart
function buildBarChart(sample) {

    // D3 to retieve data
    d3.json(url).then((data) => {

        let sampleInfo = data.samples;

        // filter on value of sample
        let valueData = value[0];

        // get the sample_values, otu_ids, otu_labels
        let sample_values = valueData.sample_values;
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;

        console.log(sample_values, otu_ids, otu_labels);

        // top 10 items in descending order
        let xticks = sample_values.slice(0,10).reverse();
        let yticks = otu_ids.slice(0,10).map(id => 'OTU ${id}').reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // trace for bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // layout
        let layout = {
            title: "top 10 OTUs"
        };

        // plotly barchart
        Plotly.newPlot("bar", [trace], layout);

    });
};

// function for bubble chart
function buildBubbleChart(sample) {

    // D3 to retreive data
    d3.json(url).then((data) => {

        let sampleInfo = data.samples;

        // filter value of sample
        let value = sampleInfo.filter(result => result.id == sample);

        let valueData = value[0];

        // get the sample_values, otu_ids, otu_labels
        let sample_values = valueData.sample_values;
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;

        console.log(sample_values, otu_ids, otu_labels);

        // trace for bubble chart
        let trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids  
            }
        };

        // layout
        let layout = {
            title: "Bacteria per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };
        
        // plotly to plot bubble chart
        Plotly.newPlot("bubble", [trace2], layout)
    });
};

// function for future updates/changes
function optionChanged(value) {

    console.log(value);

    // call functions
    buildBarChart(value);
    buildMetadata(value);
    buildBubbleChart(value);
};

// initialize function
init();