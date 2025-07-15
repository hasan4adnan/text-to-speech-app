import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
// Remove direct imports for PNGs, use require inline instead

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputHeight, setInputHeight] = useState(120);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      setProgress(0);
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            clearInterval(progressRef.current!);
            setIsPlaying(false);
            return 1;
          }
          return prev + 0.02;
        });
      }, 30);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPlaying]);

  const handleDownload = () => {
    console.log('Download logic here!');
  };

  const handleLanguageSelect = (language: 'english' | 'turkish') => {
    setSelectedLanguage(language);
  };

  const handleConvert = () => {
    if (!textInput.trim() || loading) return;
    
    setLoading(true);
    setAudioAvailable(false);
    
    // Simulate conversion process
    setTimeout(() => {
      setLoading(false);
      setAudioAvailable(true);
    }, 2000);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const renderWaveform = () => {
    // Fill area, animate progress
    const barCount = 48;
    const bars = [];
    for (let i = 0; i < barCount; i++) {
      // Animate color if within progress
      const isActive = progress > i / barCount;
      bars.push(
        <View
          key={i}
          style={{
            width: 3,
            height: Math.random() * 18 + 10,
            backgroundColor: isActive ? '#4B5CF0' : '#D1D5F7',
            borderRadius: 1,
            marginHorizontal: 1,
            opacity: isActive ? 1 : 0.5,
            // Removed transitionProperty and transitionDuration (not supported in RN)
          }}
        />
      );
    }
    return bars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Multi-Language TTS</Text>
          <View style={styles.headerLine} />
        </View>

        {/* Text Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Enter your text</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { height: Math.max(120, inputHeight) }]}
              placeholder="Type or paste your text here..."
              placeholderTextColor="#888"
              multiline
              value={textInput}
              onChangeText={setTextInput}
              onContentSizeChange={(e) =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Language Selector */}
        <View style={styles.languageSection}>
          <Text style={styles.label}>Select Language</Text>
          <View style={styles.pickerRow}>
            <TouchableOpacity
              style={[
                styles.pickerButton,
                selectedLanguage === 'english' && styles.selectedButton
              ]}
              onPress={() => handleLanguageSelect('english')}
            >
              <Image source={require('../img/united-states.png')} style={styles.flagIcon} resizeMode="contain" />
              <Text style={styles.pickerText}>English</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.pickerButton,
                selectedLanguage === 'turkish' && styles.selectedButton
              ]}
              onPress={() => handleLanguageSelect('turkish')}
            >
              <Image source={require('../img/turkey.png')} style={styles.flagIcon} resizeMode="contain" />
              <Text style={styles.pickerText}>Turkish</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Convert Button */}
        <TouchableOpacity
          style={[
            styles.convertButton,
            (!textInput.trim() || loading) && styles.disabledButton
          ]}
          onPress={handleConvert}
          disabled={!textInput.trim() || loading}
        >
          <Image source={require('../img/exchange.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>
            {loading ? 'Converting...' : 'Convert to Speech'}
          </Text>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0900C3" style={{ marginBottom: 4 }} />
          </View>
        )}

        {/* Audio Player */}
        {audioAvailable && !loading && (
          <View style={styles.audioBox}>
            <TouchableOpacity style={styles.playButton} onPress={handlePlay} disabled={isPlaying}>
              <Image source={require('../img/play.png')} style={styles.playIconImg} resizeMode="contain" />
            </TouchableOpacity>
            <View style={styles.waveformContainer}>
              <View style={styles.waveform}>{renderWaveform()}</View>
            </View>
            <Text style={styles.duration}>01:10</Text>
          </View>
        )}

        {/* Download Button */}
        {audioAvailable && !loading && (
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <Image source={require('../img/download.png')} style={styles.buttonIcon} resizeMode="contain" />
            <Text style={styles.buttonText}>Download Audio</Text>
          </TouchableOpacity>
        )}

        {/* Empty State */}
        {!audioAvailable && !loading && textInput.trim() && (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Text style={styles.emptyStateIconText}>🔊</Text>
            </View>
            <Text style={styles.emptyStateText}>
              Click "Convert to Speech" to generate audio
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF1E6',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
  },
  headerContainer: {
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  header: {
    color: '#0A1931',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'left',
  },
  headerLine: {
    width: 40,
    height: 3,
    backgroundColor: '#0900C3',
    borderRadius: 2,
    marginBottom: 4,
  },
  inputSection: {
    marginBottom: 14,
  },
  label: {
    color: '#0A1931',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  input: {
    fontSize: 14,
    color: '#0A1931',
    textAlignVertical: 'top',
    fontFamily: 'System',
    padding: 0,
    margin: 0,
    minHeight: 60,
  },
  languageSection: {
    marginBottom: 18,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0A1931',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    marginHorizontal: 0,
  },
  selectedButton: {
    backgroundColor: '#0900C3',
    transform: [{ scale: 1.02 }],
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  flagEmoji: {
    fontSize: 16,
    marginRight: 6,
    color: '#FAF1E6',
  },
  pickerText: {
    color: '#FAF1E6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  convertButton: {
    flexDirection: 'row',
    backgroundColor: '#0900C3',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  convertIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#FAF1E6',
  },
  buttonText: {
    color: '#FAF1E6',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 14,
    justifyContent: 'center',
    height: 32,
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0900C3',
    marginHorizontal: 1,
  },
  audioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    minHeight: 44,
  },
  playButton: {
    width: 32,
    height: 32,
    backgroundColor: '#0900C3',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  playIcon: {
    fontSize: 16,
    color: '#FAF1E6',
    marginLeft: 2,
  },
  waveformContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    width: '100%',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 0,
    width: '100%',
  },
  waveBar: {
    width: 1.5,
    backgroundColor: '#0900C3',
    borderRadius: 1,
    opacity: 0.6,
    marginHorizontal: 0.5,
  },
  duration: {
    color: '#0A1931',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 10,
    minWidth: 38,
    textAlign: 'right',
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#0900C3',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 6,
  },
  downloadIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#FAF1E6',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  emptyStateIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#0900C3',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyStateIconText: {
    fontSize: 18,
    color: '#FAF1E6',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  flagIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#FAF1E6',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#FAF1E6',
  },
  playIconImg: {
    width: 18,
    height: 18,
    tintColor: '#FAF1E6',
    marginLeft: 2,
  },
});

export default HomeScreen;