# app.py
import streamlit as st
import joblib
import pandas as pd

# Load saved artifacts
model = joblib.load('model.joblib')
scaler = joblib.load('scaler.joblib')
encoder = joblib.load('encoder.joblib')

# App interface
st.title("NBRRI PAVEMENT LAB")
st.title("Asphalt Stiffness Prediction")

# Create form to group inputs
with st.form("prediction_form"):
    # Input widgets
    freq = st.number_input("Frequency (Hz)", min_value=0.0, value=8.0)
    time = st.number_input("Time (ms)", min_value=0.0, value=100.0)
    temp = st.number_input("Temperature (°C)", min_value=0.0, value=25.0)
    layer = st.selectbox("Layer", options=['Top', 'center', 'bottom'])
    
    # Submit button inside the form
    submitted = st.form_submit_button("Predict Stiffness")

# Create container for results at the BOTTOM
result_container = st.container()

# Only show results after prediction
if submitted:
    with result_container:
        # Create input DataFrame
        input_data = pd.DataFrame([[freq, time, temp, layer]], 
                                 columns=['Frequency (Hz)', 'Time (ms)', 'Temperature (°C)', 'Layer'])
        
        # Preprocess
        layer_encoded = encoder.transform(input_data[['Layer']])
        layer_df = pd.DataFrame(layer_encoded, columns=encoder.get_feature_names_out(['Layer']))
        processed = pd.concat([input_data.drop('Layer', axis=1), layer_df], axis=1)
        scaled = scaler.transform(processed)
        
        # Predict
        prediction = model.predict(scaled)[0]
        st.success(f"Predicted Stiffness: {prediction:.2f} MPa")
       