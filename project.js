
function get_desired_demographic_data(data,sample){
      // get the metadata field
  const data_metadata = data['metadata'];
  desired_data =  {};
  data_metadata.forEach(item => {
      if(item.id == sample){
          desired_data = item;
      }
    });
  return desired_data;
}
  
// Set up the dimensions
  const width = 600;
  const height = 400;
  const margin = { top: 50, right: 20, bottom: 50, left: 250 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

//For the bar chart configuration
const svg = d3.select('#bar').append('svg')
.attr("width",width+margin.left+margin.right)
.attr("height", height+margin.top+margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + ","+margin.right+")");

//function to create bar chart 
function create_barchart(requred_data_for_bar_sorted){
    // Set up scales
    const xScale = d3.scaleLinear()
    .domain([0, d3.max(requred_data_for_bar_sorted, d => d.sample_value)])
    .nice()
    .range([0, chartWidth]);

    const yScale = d3.scaleBand()
    .range([height,0])
    .padding(0.2)
    .domain(requred_data_for_bar_sorted.map(function(d){return d.otu_id_str}))
    ;

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    svg.append('g')
    .attr("class","x axis")
    .attr("transform","translate(0,"+height + ")")
    .call(xAxis)
    .append('text')
  .attr('x', chartWidth / 2)
  .attr('y', 40)
  .attr('fill', '#000')
  .style('font-size', '14px')
  .text('Number of Bacteria');


    svg.append('g')
    .call(yAxis)

    svg.selectAll('#bar')
    .data(requred_data_for_bar_sorted)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('y', d => yScale(d.otu_id_str))
    .attr('width', d => xScale(d.sample_value))
    .attr('height', yScale.bandwidth())
    .attr('fill', 'steelblue');




    // Add a title to the chart
    svg.append('text')
        .attr('x', 200 )
        .attr('y', margin.top/400)
        .attr('text-anchor', 'middle')
        .attr('font-size', '20px')
        
        .text('Top 10 Bacteria Cultures Found');
}


//For the bubble chart configuration
const margin_bubble = { top: 20, right: 20, bottom: 400, left: 150 };
const svg_bubble = d3.select('#bubble').append('svg')
.attr("width",width+margin_bubble.left+margin_bubble.right)
.attr("height", height+margin_bubble.top+margin_bubble.bottom)
.append("g")
.attr("transform", "translate(" + margin_bubble.left + ","+margin_bubble.top+")")


function create_bubblechart(requred_data_for_bar_sorted){
  
 // Set up scales
 const xScale = d3.scaleLinear()
 .domain([0, d3.max(requred_data_for_bar_sorted, d => d.otu_id)])
 .range([margin.left, width - margin.right]);

const yScale = d3.scaleLinear()
 .domain([0, d3.max(requred_data_for_bar_sorted, d => d.sample_value)])
 .range([height - margin.bottom, margin.top]);

const sizeScale = d3.scaleSqrt()
 .domain([0, d3.max(requred_data_for_bar_sorted, d => d.sample_value)])
 .range([5, 50]);

// Create a color scale with a gradient effect
const colorScale = d3.scaleSequential(d3.interpolateBlues)
 .domain([0, d3.max(requred_data_for_bar_sorted, d => d.otu_id)]);



// Create bubbles
const bubbles = svg_bubble.selectAll(".bubble")
 .data(requred_data_for_bar_sorted)
 .enter().append("circle")
 .attr("class", "bubble")
 .attr("cx", d => xScale(d.otu_id))
 .attr("cy", d => yScale(d.sample_value))
 .attr("r", d => sizeScale(d.sample_value))
 .attr("fill", d => colorScale(d.otu_id))
 .attr("stroke", "#fff")
 .attr("stroke-width", 1)
 .on("mouseover", function(event, d) {
     tooltip.transition().duration(200).style("opacity", .9);
     tooltip.html(`OTU ID: ${d.otu_id}<br>Sample Value: ${d.sample_value}<br>Label: ${d.otu_label}`)
         .style("left", (event.pageX + 5) + "px")
         .style("top", (event.pageY - 28) + "px");
 })
 .on("mouseout", function() {
     tooltip.transition().duration(500).style("opacity", 0);
 });
  
 // Add title
   svg.append("text")
   .attr("x", -12)
   .attr("y", margin.top+height+20 )
   .attr("class", "chart-title")
   .text("Bubble Chart");
// Add X and Y axes
svg_bubble.append("g")
 .attr("transform", `translate(0,${height - margin.bottom})`)
 .call(d3.axisBottom(xScale)
                .tickValues(d3.range(0, d3.max(requred_data_for_bar_sorted, d => d.otu_id) + 1, 500))
                .tickSize(-height + margin.top + margin.bottom))
 .append("text")
 .attr("x", width - margin.right-150)
 .attr("y", 25)
 .attr("fill", "#000")
 .attr("text-anchor", "end")
 .text("OTU ID");

 svg_bubble.append("g")
 .attr("transform", `translate(${margin.left},0)`)
 .call(d3.axisLeft(yScale).ticks(10).tickSize(-width + margin.left + margin.right))
 .append("text")
 .attr("x", -20)
 .attr("y", 200)
 .attr("fill", "#000")
 .attr("text-anchor", "end")
 .text("Number of Bacteria");
}



function build_sampl_bar_chart(data,id){
//remove if before bar,buuble chart is present
  svg_bubble.selectAll('*').remove();
  svg.selectAll('*').remove();
  data_samples = data['samples'];
  desired_data =  {};
  data_samples.forEach(item => {
      if(item.id == id){
          desired_data = item;
      }
    });

  let otu_ids = desired_data['otu_ids'].slice(0,10)
  let otu_labels = desired_data['otu_labels']
  let sample_values = desired_data['sample_values'].slice(0,10)   
  var requred_data_for_bar = []
  class Otu_values {
    constructor(otu_id, sample_value) {
      this.otu_id = otu_id;
      this.sample_value = sample_value;
      this.otu_id_str = "OTU " + otu_id;
    }
  }
  for(let i = 0;i<10;i++){
    requred_data_for_bar.push(new Otu_values(otu_ids[i],sample_values[i]));
  }
 
  
  const requred_data_for_bar_sorted = requred_data_for_bar.slice().sort((a, b) => a.sample_value - b.sample_value);
  console.log(requred_data_for_bar_sorted)

  //creating the bar chart
  create_barchart(requred_data_for_bar_sorted)
  //create bubble chart
  create_bubblechart(requred_data_for_bar_sorted)
}


// Build the metadata panel
function buildMetadata(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
  
      // get the metadata field
  const data_metadata = data['metadata'];
  //console.log(data_metadata)
  

      // Filter the metadata for the object with the desired sample number
  var desired_data = get_desired_demographic_data(data, sample)

  console.log(desired_data)
  
      // Use d3 to select the panel with id of `#sample-metadata`
  const panel = d3.select('#sample-metadata');
  
      // Use `.html("") to clear any existing metadata
  panel.html('');
  
      // Inside a loop, you will need to use d3 to append new
  
      // tags for each key-value in the filtered metadata.


  
     // Check if metadata is not empty
     if (Object.keys(desired_data).length > 0) {
      // Iterate over metadata and append it to the panel
      Object.entries(desired_data).forEach(([key, value]) => {
        panel.append('p') // Append a new paragraph for each key-value pair
          .text(`${key}: ${value}`);
      });
    } else {
      // If no metadata available, display a message
      panel.append('p').text('No metadata available');
    }

    build_sampl_bar_chart(data,desired_data.id)
    });
  }


  
  // Function to run on page load
  function init() {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
  
      // Get the names field
  const data_names = data['names'];
  //console.log(data_name)
  
  
      // Use d3 to select the dropdown with id of `#selDataset`
  const panel = d3.select('#selDataset');
  panel.html('');
 
      // Use the list of sample names to populate the select options
      // Hint: Inside a loop, you will need to use d3 to append a new
      // option for each sample name.
  data_names.forEach(sample => {
      panel.append('option')
        .attr('value', sample)
        .text(sample);
    });

    const panel_demographic = d3.select('#sample-metadata');
  
        // Use `.html("") to clear any existing metadata
    panel_demographic.html('');
    
      // Get the first sample from the list
  
  desired_data = get_desired_demographic_data(data,data_names[0]);

  console.log(desired_data)
     // Check if metadata is not empty
     if (Object.keys(desired_data).length > 0) {
      // Iterate over metadata and append it to the panel
      Object.entries(desired_data).forEach(([key, value]) => {
          panel_demographic.append('p') // Append a new paragraph for each key-value pair
          .text(`${key}: ${value}`);
      });
    } else {
      // If no metadata available, display a message
      panel_demographic.append('p').text('No metadata available');
    }
  
      // Build charts and metadata panel with the first sample
  build_sampl_bar_chart(data,data_names[0])
    });
  }
  
  // Function for event listener
  function optionChanged(newSample) {
    // Build charts and metadata panel each time a new sample is selected
 
  buildMetadata(newSample);
  
  }
  
  // Initialise the dashboard
  init();
  