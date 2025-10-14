document.getElementById("convert-btn").addEventListener("click", function() {
  const temp = parseFloat(document.getElementById("temp").value);
  const fromUnit = document.getElementById("fromUnit").value;
  const toUnit = document.getElementById("toUnit").value;
  const result = document.getElementById("result");

  if (isNaN(temp)) {
    result.innerHTML = `<p>Please enter a valid temperature 🔢</p>`;
    return;
  }

  // Convert input to Celsius first
  let celsius;
  if (fromUnit === "celsius") celsius = temp;
  else if (fromUnit === "fahrenheit") celsius = (temp - 32) * 5 / 9;
  else if (fromUnit === "kelvin") celsius = temp - 273.15;

  // Convert from Celsius to desired unit
  let finalValue;
  if (toUnit === "celsius") finalValue = celsius;
  else if (toUnit === "fahrenheit") finalValue = (celsius * 9 / 5) + 32;
  else if (toUnit === "kelvin") finalValue = celsius + 273.15;

  if (fromUnit === toUnit) {
    result.innerHTML = `<p>It's the same unit — no conversion needed! 🤓</p>`;
  } else {
    result.innerHTML = `
      <p>Converting from <strong>${capitalize(fromUnit)}</strong> ➡️ <strong>${capitalize(toUnit)}</strong></p>
      <h2>${finalValue.toFixed(2)} ${unitSymbol(toUnit)}</h2>
    `;
  }
});

// Utility: Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Utility: Unit symbols
function unitSymbol(unit) {
  if (unit === "celsius") return "°C";
  if (unit === "fahrenheit") return "°F";
  if (unit === "kelvin") return "K";
}
