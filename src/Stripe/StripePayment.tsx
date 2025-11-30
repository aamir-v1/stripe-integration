import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';

// Platform-specific API URL
// For Android emulator: use 10.0.2.2
// For iOS simulator: use localhost
// For physical devices: replace with your computer's local IP (e.g., '192.168.1.100')
const getApiBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000/api';
    } else {
      // iOS simulator or physical device
      // For physical device, replace 'localhost' with your computer's IP
      // Find it with: ifconfig | grep "inet " | grep -v 127.0.0.1
      return 'http://localhost:3000/api';
    }
  }
  // Production URL
  return 'https://your-production-api.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const StripePayment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');

  const createCustomer = async () => {
    console.log('Creating customer...', `${API_BASE_URL}/customers`);
    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerEmail,
          name: customerName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create customer');
      }

      const customer = await response.json();
      return customer.id;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  };

  const createPaymentIntent = async (customerId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: 'usd',
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment intent');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    // Validation
    if (!customerEmail || !customerName || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create customer
      console.log('Creating customer...');
      const customerId = await createCustomer();
      console.log('Customer created:', customerId);

      // Step 2: Create payment intent
      console.log('Creating payment intent...');
      const { clientSecret, paymentIntentId } = await createPaymentIntent(
        customerId,
      );
      console.log('Payment intent created:', paymentIntentId);

      // Step 3: Initialize payment sheet
      console.log('Initializing payment sheet...');
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Aamir Stripe App',
        paymentIntentClientSecret: clientSecret,
        customFlow: false,
        defaultBillingDetails: {
          name: customerName,
          email: customerEmail,
        },
      });

      if (initError) {
        console.error('Payment sheet initialization error:', initError);
        Alert.alert('Error', initError.message);
        setLoading(false);
        return;
      }

      // Step 4: Present payment sheet
      console.log('Presenting payment sheet...');
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code !== 'Canceled') {
          console.error('Payment sheet error:', presentError);
          Alert.alert('Error', presentError.message);
        } else {
          console.log('Payment canceled by user');
        }
      } else {
        // Payment succeeded
        Alert.alert('Success', 'Payment completed successfully!');
        // Reset form
        setCustomerEmail('');
        setCustomerName('');
        setAmount('');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Stripe Payment</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Customer Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter customer name"
          value={customerName}
          onChangeText={setCustomerName}
          editable={!loading}
        />

        <Text style={styles.label}>Customer Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter customer email"
          value={customerEmail}
          onChangeText={setCustomerEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <Text style={styles.label}>Amount (USD)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Pay Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#635BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StripePayment;
