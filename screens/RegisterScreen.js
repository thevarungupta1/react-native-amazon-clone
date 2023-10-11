import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    Alert
  } from "react-native";
  import React from "react";
  import { MaterialIcons } from "@expo/vector-icons";
  import { AntDesign } from "@expo/vector-icons";
  import { Ionicons } from "@expo/vector-icons";
  import { useState } from "react";
  import { useNavigation } from "@react-navigation/native";
  import axios from "axios";
  
  const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
  
    const handleRegister = () => {
      const user = {
        name: name,
        email: email,
        password: password,
      };
  
      //console.log(user);
      axios.post('http://10.0.2.2:3000/register', user)
      .then((response) => {
        console.log(response.data)
        Alert.alert(
          "Registration sucessful",
          "You have been registered successfully"
        )
      }).catch((error) => {
        Alert.alert(
          error.message
        )
        console.log(error.message)
      })
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Image
            style={styles.logo}
            source={{
              uri: "https://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png",
            }}
          />
        </View>
  
        <KeyboardAvoidingView>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontWeight: "bold" }}>Register to your Account</Text>
          </View>

          <View style={{ marginTop: 40 }}>
            <View style={styles.textInputContainer}>
              <Ionicons
                style={styles.icon}
                name="ios-person"
                size={24}
                color="black"
              />
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="enter your name"
              />
            </View>
          </View>
  
          <View style={{ marginTop: 20 }}>
            <View style={styles.textInputContainer}>
              <MaterialIcons
                style={styles.icon}
                name="email"
                size={24}
                color="black"
              />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="enter your email"
              />
            </View>
          </View>
  
          <View style={{ marginTop: 10 }}>
            <View style={styles.textInputContainer}>
              <AntDesign
                style={styles.icon}
                name="lock1"
                size={24}
                color="black"
              />
              <TextInput
                style={styles.textInput}
                placeholder="enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>
  
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Keep me logged In</Text>
            <Text style={{ color: "#007FFF", fontWeight: "500" }}>
              Forgot Password
            </Text>
          </View>
  
          <View style={{ marginTop: 50 }} />
  
          <Pressable style={styles.button}
          onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
  
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ marginTop: 15 }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "grey",
                fontSize: 16,
              }}
            >
              Already have an account? Sign In
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default RegisterScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      alignItems: "center",
    },
    logo: {
      width: 150,
      height: 100,
    },
    textInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "#D0D0D0",
      paddingVertical: 5,
      borderRadius: 5,
      marginTop: 30,
    },
    icon: {
      marginLeft: 8,
    },
    textInput: {
      color: "gray",
      marginVertical: 10,
      width: 300,
    },
    button: {
      width: 200,
      backgroundColor: "#FEBE10",
      borderRadius: 6,
      marginLeft: "auto",
      marginRight: "auto",
      padding: 15,
    },
    buttonText: {
      textAlign: "center",
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
  