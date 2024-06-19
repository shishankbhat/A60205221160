const express = require("express");
const app = express();

const axios = require('axios')
const port = 9876;

const windowSize = 20;

let numbers = [];

const apiUrl = 'http://localhost:9876/numbers' ; 

let fetchNumber = async (type) =>{
    try {
        
      const response = await axios.get(`${apiUrl}/${type}`, { timeout: 500 });
      console.log(response)
      return response.data.number;
    } catch (error) {
      console.log(`Error fetching ${type} number:`, error.message);
      return null;
    }
  }
  
  let calculateAverage = (arr) => {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    let avg = sum / arr.length;
    return avg;
  }


  app.get('/numbers/:type', async (req, res) => {
    const type = req.params.type.toLowerCase();
    const startTime = new Date().getTime();
  
    let number = "";
    switch (type) {
      case 'p':
        number = await fetchNumber('prime');
        break;
      case 'f':
        number = await fetchNumber('fibonacci');
        break;
      case 'e':
        number = await fetchNumber('even');
        break;
      case 'r':
        number = await fetchNumber('random');
        break;
      default:
        return res.status(400).json({ error: 'Something went wrong' });
    }

  const timeTaken = new Date().getTime() - startTime;
  if (number === null || timeTaken > 500) {
    return res.status(500).json({ error: 'Error fetching number or timeout' });
  }

  if (!numbers.includes(number)) {
    numbers.push(number);

    if (numbers.length > windowSize) {
      numbers.shift(); 
    }
  }

  const average = calculateAverage(numbers);

  const response = {
    "numbers": [...numbers], 
    "windowPrevState": [...numbers.slice(0, -1)],
    "windowCurrState": [...numbers],
    "avg": average.toFixed(2)
  };

  res.send(response);
});


app.listen(port,(req,res) =>{
    console.log("Server is listening");
})
