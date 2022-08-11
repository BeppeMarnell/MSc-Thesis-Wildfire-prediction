# MSc Thesis on Wildfire risk assessment using remote sensing data

Hi to whoever ends up here on this webpage. Here there is the material I used for my master thesis. You're free to use the code ad check what I have done. 
> What have I done in a few words? I have built a machine learning model capable of assessing the risk of a wildfire over the entire globe using remote sensing data.

> The model presented here was able to predict wildfires in the US with an 80% score and a lower score in the rest of the world.

## Abstract

Assessing the risk of wildfires over the entire globe can be crucial in avoiding harm to wildlife, economy, properties and humans. This is known to be a challenging task. Here, a machine learning model is trained on a dataset composed of remote sensing data variables such as topography, vegetation and weather. The model is able to assess the risk of fire with a spatial resolution of 1000m/pixel. It achieves optimal results compared to other state-of-the-art architectures. Most of the variables in the dataset are found to be critical for the task, while few were disregarded. Particular focus has been given to collecting data across a variety of landscapes. Specifically, samples from Africa, Australia, Asia, Europe, South America and the US are included. This research shows the potential for deploying global wildfire risk assessment applications.

## Dataset
Using Google Earth Engine (GEE), each image is extracted from different areas around the globe, from the years 2018, 2019 and 2020. In particular, focus has been given to fire seasons in Africa, Asia, Australia, Europe, South America and USA. The following picture illustrates the extraction points:

![Extraction point](https://github.com/BeppeMarnell/MSc-Thesis-Wildfire-prediction/blob/main/images/extractions2.png)

Each image extracteed has 20 features, an example is shown beelow:

![Features example](https://github.com/BeppeMarnell/MSc-Thesis-Wildfire-prediction/blob/main/images/dataset_features.png)

## Methods
The CNN architecture consists in multiple blocks of convolutional, batch normalisation, and activation layers as illustrated in the following Figure. Each convolutional layer retains the original size of the image while increasing the number of filters. These are 40, 60, 30 and 1 respectively for the first, second, third and fourth block. The inner blocks uses a tanh activation function while the other blocks rely on the ReLU activation function. The last layer converts the outputs of the precedent ones to a single filter through a sigmoid activation function. The model has 587,177 parameters in total.

![CNN model](https://github.com/BeppeMarnell/MSc-Thesis-Wildfire-prediction/blob/main/images/model_cnn.png))


## Results
The following picture shows 5 examples of wildfire prediction from the CNN.
![Prediction result](https://github.com/BeppeMarnell/MSc-Thesis/blob/main/images/results.png)
