'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AudioFeatures {
  pitch: number;
  spectralFlatness: number;
}

const AudioRecorderPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioDescription, setAudioDescription] = useState<string>('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.AudioContext)();
      analyserNodeRef.current = audioContextRef.current.createAnalyser();
    }
  };

  const startRecording = async () => {
    try {
      initializeAudioContext();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        try {
          await processAudio(audioBlob);
        } catch (err) {
          setError('Error processing audio data');
          console.error('Process audio error:', err);
        }
      };

      recorder.start(100); // Collect data in 100ms chunks
      setMediaRecorder(recorder);
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Error accessing microphone. Please ensure microphone permissions are granted.');
      console.error('Microphone access error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    if (!audioContextRef.current) {
      throw new Error('AudioContext not initialized');
    }

    try {
      const audioBuffer = await getAudioBufferFromBlob(audioBlob);
      const features = await extractAudioFeatures(audioBuffer);
      const confidence = calculateConfidence(features);
      setConfidenceScore(confidence);

      // Generate audio description based on confidence
      setAudioDescription(generateAudioDescription(confidence));
    } catch (err) {
      throw new Error('Error processing audio: ' + err);
    }
  };

  const getAudioBufferFromBlob = async (audioBlob: Blob): Promise<AudioBuffer> => {
    if (!audioContextRef.current) {
      throw new Error('AudioContext not initialized');
    }

    const arrayBuffer = await audioBlob.arrayBuffer();
    return await audioContextRef.current.decodeAudioData(arrayBuffer);
  };

  const extractAudioFeatures = async (audioBuffer: AudioBuffer): Promise<AudioFeatures> => {
    const channelData = audioBuffer.getChannelData(0);
    const frameSize = 2048;
    let pitch = 0;
    let spectralFlatness = 0;

    // Process audio in frames
    for (let i = 0; i < channelData.length; i += frameSize) {
      const frame = channelData.slice(i, i + frameSize);
      
      // Simple pitch detection using zero-crossing rate
      let zeroCrossings = 0;
      for (let j = 1; j < frame.length; j++) {
        if ((frame[j - 1] >= 0 && frame[j] < 0) || 
            (frame[j - 1] < 0 && frame[j] >= 0)) {
          zeroCrossings++;
        }
      }
      pitch += (zeroCrossings * audioBuffer.sampleRate) / (2 * frameSize);

      // Calculate spectral flatness using geometric mean / arithmetic mean
      const absFrame = frame.map(Math.abs);
      const geometricMean = Math.exp(absFrame.reduce((sum, val) => sum + Math.log(val + 1e-6), 0) / frame.length);
      const arithmeticMean = absFrame.reduce((sum, val) => sum + val, 0) / frame.length;
      spectralFlatness += geometricMean / arithmeticMean;
    }

    const frameCount = Math.ceil(channelData.length / frameSize);
    return {
      pitch: pitch / frameCount,
      spectralFlatness: spectralFlatness / frameCount
    };
  };

  const calculateConfidence = (features: AudioFeatures): number => {
    // Normalize pitch (assuming typical human speech range 85-255 Hz)
    const normalizedPitch = Math.min(Math.max(features.pitch, 85), 255);
    const pitchConfidence = (normalizedPitch - 85) / (255 - 85);

    // Normalize spectral flatness (typically between 0-1)
    const flatnessConfidence = 1 - Math.min(features.spectralFlatness, 1);

    // Weight the features (can be adjusted based on importance)
    const weightedConfidence = (pitchConfidence * 0.6) + (flatnessConfidence * 0.4);
    return Math.min(Math.max(weightedConfidence, 0), 1);
  };

  const generateAudioDescription = (confidence: number): string => {
    if (confidence > 0.8) {
      return 'Excellent audio quality with clear speech patterns';
    } else if (confidence > 0.6) {
      return 'Good audio quality, minor background noise';
    } else if (confidence > 0.4) {
      return 'Moderate audio quality, some interference detected';
    } else {
      return 'Poor audio quality, significant noise or interference';
    }
  };

  useEffect(() => {
    initializeAudioContext();

    return () => {
      // Cleanup on component unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 bg-purple-700 text-white">
      <CardHeader>
        <CardTitle>Audio Recorder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </div>

          {audioURL && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Playback:</p>
              <audio 
                controls 
                src={audioURL}
                className="w-full"
              />
            </div>
          )}

          {audioDescription && (
            <div className="mt-4">
              <p className="text-sm text-gray-300">{audioDescription}</p>
            </div>
          )}

          {confidenceScore !== 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium">
                Confidence Score: {(confidenceScore * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioRecorderPage;
