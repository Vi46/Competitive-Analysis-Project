//script.j
// Load the JSON data using Fetch API
function loadJsonData() {
  return fetch('/static/output_combined.json')
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error('Error loading JSON data:', error));

}

// Search through brand names and display results
function search() {
  let inputValue = document.getElementById('searchInput').value.toLowerCase();

  // Load JSON data
  loadJsonData().then(data => {
    console.log('Data ------>', data);
    // Filter data based on brand name containing the inputValue
    let results = data.filter(entry => entry.brand_name.toLowerCase().includes(inputValue));

    // Display the results
    displayResults(results);
  });

}

// Display search results
function displayResults(results) {
  let resultContainer = document.getElementById('searchResult');
  let genericResultContainer = document.getElementById('genericResult');
 
  
  
  if (results.length === 0) {
    resultContainer.innerHTML = 'No matching results.';
    genericResultContainer.innerHTML = ''; // Clear the generic result container
    
  } else {
    // Clear previous content
    resultContainer.innerHTML = '<strong>Matching Results:</strong><br>';
    genericResultContainer.innerHTML = '<strong>Generic Results:</strong><br>';
    
    // Map the generic names for further use
    
    results.forEach(entry => {
      // Display each result in the result container
      resultContainer.innerHTML += `<div id="searchResultContainer">Generic Name: ${entry.generic_name}, Brand Name: ${entry.brand_name}<br></div>`;
      
      // Display the generic name alone in the generic result container
      genericResultContainer.innerHTML += `<div id="searchResultContainer">Generic Name: ${entry.generic_name}<br></div>`;  
    });
    
    let gRc = results.map(entry => entry.generic_name);
    console.log('GRC-------->', gRc[0]);
     // Further processing with the mapped generic names
    
    loadJsonData().then(jsonData => {
      // Filter the jsonData using the generic name and getting the brand name
      let brandValues = jsonData.filter(entry =>entry.generic_name.toLowerCase().includes(gRc[0].toLowerCase()));
      console.log('brandValues--------->', brandValues);
      displayBrandsForGenericNames(brandValues);
    });
    
    
  }
}

function displayBrandsForGenericNames(brandValues) {
  let brandResultContainer = document.getElementById('brandResult');
  let passingValues = []; // Define passingValues array

  if (brandValues.length === 0) {
    brandResultContainer.innerHTML = ''; // Clear the brand result container
  } else {
    // Clear previous content
    brandResultContainer.innerHTML = '<strong>Other Brands with Similar Generic Names:</strong><br>';

    // Iterate over each entry in brandValues and display the brand names
    brandValues.forEach(entry => {
      passingValues.push(entry.brand_name); // Add brand_name to passingValues array
      brandResultContainer.innerHTML += `<div id="searchResultContainer">Brand Name: ${entry.brand_name}<br></div>`;
    });

    sendData(passingValues) // Pass passingValues to the function
  }
}

function sendData(passingValues) { 
  var value = passingValues; 
  $.ajax({ 
      url: '/process', 
      type: 'POST', 
      contentType: 'application/json', 
      data: JSON.stringify({ 'value': value }), 
      success: function(response) { 
          document.getElementById('output').innerHTML = response.result; 
      }, 
      error: function(error) { 
          console.log(error); 
      } 
  }); 
}


