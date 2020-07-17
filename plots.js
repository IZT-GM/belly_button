function init() {
    buildMetadata(940);
    buildCharts(940);
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  

  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text(`ID: ${result.id}`);
      PANEL.append("h6").text(`Ethnicity: ${result.ethnicity}`);
      PANEL.append("h6").text(`Gender: ${result.gender}`);
      PANEL.append("h6").text(`Age: ${result.age}`);
      PANEL.append("h6").text(`Location: ${result.location}`);
      PANEL.append("h6").text(`BBtype: ${result.bbtype}`);
      PANEL.append("h6").text(`Wfreq: ${result.wfreq}`);
    });
  }

  function buildCharts(sample) {
    // Create bar chart
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var xAxis = result.sample_values.slice(0,10).reverse();
      var yAxis = result.otu_ids.map(otu_label => `OTU_${otu_label}`).slice(0,10).reverse();
      var labels = result.otu_labels.slice(0,10).reverse();
      var PANEL = d3.select('#bar');
      // chart
      var barChart = [{
        x: xAxis,
        y: yAxis,
        type: 'bar',
        orientation: 'h',
        text: labels}];
      var barChartLayout = {};

      Plotly.newPlot('bar',barChart,barChartLayout);
    });
    
    
    // Create Washing Frequency chart
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var washResult = resultArray[0].wfreq;
      var PANEL = d3.select('#gauge');
      // chart
      var washFreq = [{
        domain: {x:[0,1], y:[0,1]},
        value: washResult,
        title: {text: 'Belly Button Washing Frequency<br>Scrubs per week', font: {sie: 18}},
        type: 'indicator',
        mode: 'number+gauge',
        gauge: {
          threshold: {line: {color: "#444", width: 10}},
          axis: {range:[0,9],
                tickmode: "array",
                tickvals:[1,2,3,4,5,6,7,8,9],
                ticktext:["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9"],
                ticks:""},
          bar: {color: 'black'},
          steps: [
            {range: [0,1], color: 'rgb(204, 255, 255)'},
            {range: [1,2], color: 'rgb(102, 255, 255)'},
            {range: [2,3], color: 'rgb(0, 255, 255)'},
            {range: [3,4], color: 'rgb(51, 204, 204)'},
            {range: [4,5], color: 'rgb(0, 153, 153)'},
            {range: [5,6], color: 'rgb(0, 204, 153)'},
            {range: [6,7], color: 'rgb(0, 204, 102)'},
            {range: [7,8], color: 'rgb(0, 204, 0)'},
            {range: [8,9], color: 'rgb(0, 102, 0)'}
          ]}
      }]
      var washLayout = {
        width:600, 
        height:500, 
        margin:{t:0,b:0}
      };
      Plotly.newPlot('gauge',washFreq,washLayout);
    });

    // Create bubble chart
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var values = resultArray[0].sample_values;
      var ids = resultArray[0].otu_ids;
      var labels = resultArray[0].otu_labels;
      var PANEL = d3.select('#bubble');
      // chart
      var bubbleChart = [{
        x: values,
        y: ids,
        mode: 'markers',
        text: labels,
        marker: {size: values, color: ids}}];
      var bubbleLayout = {
        title: 'OTU distribution',
        xaxis: {text: {text: 'OTU ID'}},
        showlegend: false,
        height: 600,
        width: 1000};
    
      Plotly.newPlot('bubble',bubbleChart,bubbleLayout);

    });

  };

  init();
