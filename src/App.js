import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { useState } from "react";
import axios from "axios";

function App() {
  const apikey = "f56f24967aaf51182d1d4df628297c6d";
  const [inputCity, setInputCity] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const getWeatherDetails = (cityName) => {
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apikey}`;
    axios.get(apiURL)
      .then((res) => {
        console.log("response", res.data);
        setData(processWeatherData(res.data.list));
        setError(""); 
      })
      .catch((err) => {
        console.log("err", err);
        if (err.response && err.response.status === 404) {
          setError("City not found. Please enter a valid city name.");
        } else {
          setError(" Please try again later.");
        }
      });
  };

  const processWeatherData = (data) => {
    const dailyData = {};
    data.forEach(entry => {
      const date = new Date(entry.dt_txt).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(entry);
    });

    return Object.keys(dailyData).map(date => {
      const dayData = dailyData[date];
      const tempSum = dayData.reduce((sum, entry) => sum + entry.main.temp, 0);
      const tempAvg = tempSum / dayData.length;
      const { weather } = dayData[0];
      return {
        date,
        temp: (tempAvg - 273.15).toFixed(2),
        weather: weather[0]
      };
    });
  };

  const handleChangeInput = (e) => {
    setInputCity(e.target.value);
  };

  const handleSearch = () => {
    if (inputCity.trim()) {
      getWeatherDetails(inputCity);
    } else {
      setError("Please enter a city name.");
    }
  };

  return (
    <div className="col-md-12">
      <div className="weatherBg">
        <h1>Weather App</h1>
        <div className="d-grid gap-2 col-8 col-sm-4 mt-2">
          <input type="text" className="form-control" placeholder="Enter city name" onChange={handleChangeInput} />
          <button className="btn btn-primary" type="button" onClick={handleSearch}>Search</button>
        </div>
        {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
      </div>
      <div className="col-md-12 text-center mt-5">
        <div className="weatherRow">
          {data.map((day, index) => (
            <div key={index} className="shadow rounded weatherResultBox mb-2">
              <h5 className="weatherCity">{day.date}</h5>
              <h6 className="weatherTemp">{day.temp}°C</h6>
              <img className="weatherIcon" src={`http://openweathermap.org/img/wn/${day.weather.icon}.png`} alt={day.weather.description} />
              <p>{day.weather.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
