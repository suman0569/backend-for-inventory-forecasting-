import sys
import json
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA

def arima_forecast(data):
    # Load the data
    data = pd.Series(data)
    
    # Fit ARIMA model (adjust the order (p,d,q) as needed)
    model = ARIMA(data, order=(5, 1, 0))
    model_fit = model.fit()
    
    # Make a prediction
    forecast = model_fit.forecast(steps=5)  # Forecast next 5 periods
    
    # Return the forecast
    return forecast.tolist()

if __name__ == "__main__":
    # Read input data from the Node.js server
    input_data = json.loads(sys.argv[1])
    forecast = arima_forecast(input_data)
    
    # Output forecast results
    print(json.dumps(forecast))
