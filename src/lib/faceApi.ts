import * as faceapi from 'face-api.js';

export async function loadModels() {
  const MODEL_URL = '/models';  // Reference the public/models directory

  try {
    // Load the models from the public directory
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

    console.log('Models loaded successfully');
  } catch (error) {
    console.error('Error loading models:', error);
  }
}
