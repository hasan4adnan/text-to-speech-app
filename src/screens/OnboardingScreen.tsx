import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation();

  const slides = [
    {
      title: "Find Your Study Match",
      subtitle: "Easily connect with students taking the same courses as you.",
      characterImage: require('../img/bau5.png'),
    },
    {
      title: "Share Notes & Knowledge",
      subtitle: "Upload, view and exchange course materials with your matches.",
      characterImage: require('../img/bau6.png'),
    },
    {
      title: "Start Studying Smarter",
      subtitle: "Collaborate with peers and boost your academic performance.",
      characterImage: require('../img/bau7.png'),
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const renderDots = () => {
    return slides.map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          currentSlide === index ? styles.activeDot : styles.inactiveDot
        ]}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        key={currentSlide}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(400)}
        style={styles.slideContainer}
      >
        <View style={styles.characterContainer}>
          <Image
            source={slides[currentSlide].characterImage}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.title}>{slides[currentSlide].title}</Text>
            <Text style={styles.subtitle}>{slides[currentSlide].subtitle}</Text>
          </View>

          <View>
            <View style={styles.dotsContainer}>{renderDots()}</View>
            {currentSlide === slides.length - 1 ? (
              <View style={styles.buttonRow}>
                
                <TouchableOpacity
                  style={styles.splitButtonRight}
                  onPress={() => navigation.navigate('HomeScreen')}
                >
                  <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.button} onPress={nextSlide}>
                <Text style={styles.buttonText}>
                  Next
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF1E6',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  characterContainer: {
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterImage: {
    width: width * 0.9,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FAF1E6',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 32,
    paddingTop: 32,
    justifyContent: 'space-between',
  },
  title: {
    color: '#0A1931',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
  },
  subtitle: {
    color: '#0A1931',
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 32,
    textAlign: 'left',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 32,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#0900C3',
    width: 24,
    height: 12,
    borderRadius: 6,
  },
  inactiveDot: {
    backgroundColor: '#D1D1D1',
    opacity: 0.6,
  },
  button: {
    backgroundColor: '#0900C3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FAF1E6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  splitButtonLeft: {
  flex: 1,
  backgroundColor: '#0900C3',
  paddingVertical: 16,
  borderRadius: 18, // buraya dikkat!
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
},

  splitButtonRight: {
  flex: 1,
  backgroundColor: '#0900C3',
  paddingVertical: 16,
  borderRadius: 18, // burası da aynı!
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
},
});

export default OnboardingScreen;
