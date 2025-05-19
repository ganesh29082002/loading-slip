// WelcomeComponent.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

export default function Demo() {
  const [message, setMessage] = useState('Welcome to My App!');

  const handlePress = () => {
    setMessage('You clicked the button!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{message}</Text>

      <Image
        source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        style={styles.logo}
      />

      <Button title="Click Me" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
});
