import speech_recognition as sr
sr.__version__
rec = sr.Recognizer()

DCvoice = sr.AudioFile('voice.wav')
