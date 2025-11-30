import { View, Text, StatusBar } from 'react-native';
import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import StripePayment from './src/Stripe/StripePayment';

const App = () => {
  return (
    <StripeProvider publishableKey="pk_test_51SZ3GpD6R7GH4ft9BFt6AvJB4c7JNkqwvveRumNpjysQ2sm94fghxeE7GEd6STDEShZZzLlrQlchlGbXPXgz2HCV00dcYvf8L8">
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <StripePayment />
      </View>
    </StripeProvider>
  );
};

export default App;
