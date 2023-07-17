import React, { useState, useRef } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { generateAIResponse } from "../openai";

export default function Page() {
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState("");
  const scrollViewRef = useRef(null);

  const handleUserInput = (text) => {
    setUserInput(text);
  };

  const handleSendMessage = async () => {
    const userMessage = { role: "user", content: userInput };
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);
    setUserInput("");

    const therapistResponse = await generateAIResponse(updatedConversation);
    const therapistMessage = { role: "assistant", content: therapistResponse };
    const updatedResponse = [...updatedConversation, therapistMessage];
    setConversation(updatedResponse);

    // Scroll to the bottom of the conversation
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const handleRefresh = () => {
    setConversation([]);
    setUserInput("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "height" : ""}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
    >
      <View style={styles.main}>
        <Text style={styles.title}>Companion AI</Text>
        <Text style={styles.subtitle}>
          Eliminate the stigma against therapy
        </Text>

        <ScrollView
          style={styles.conversationContainer}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {conversation.map((message, index) => (
            <View key={index} style={styles.messageContainer}>
              <Text
                style={
                  message.role === "user"
                    ? styles.userMessage
                    : styles.therapistMessage
                }
              >
                {message.content}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Share your feelings here..."
            placeholderTextColor="#A9A9A9"
            onChangeText={handleUserInput}
            value={userInput}
          />
        </View>

        <TouchableOpacity onPress={handleSendMessage} style={styles.button}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>

        {conversation.length > 0 && (
          <View style={styles.refreshButtonContainer}>
            <TouchableOpacity
              onPress={handleRefresh}
              style={styles.refreshButton}
            >
              <Ionicons name="refresh" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    paddingTop: 40,
    paddingBottom: 12,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 46,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 28,
    color: "#38434D",
  },
  conversationContainer: {
    flex: 1,
    marginTop: 20,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  userMessage: {
    padding: 8,
    backgroundColor: "#E2F0FF",
    borderRadius: 8,
    marginRight: "auto",
  },
  therapistMessage: {
    padding: 8,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    marginLeft: "auto",
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 8,
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  button: {
    borderRadius: 50,
    backgroundColor: "#14d0b0",
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  refreshButtonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  refreshButton: {
    padding: 4,
    backgroundColor: "#a3a5a3",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
  },
});
