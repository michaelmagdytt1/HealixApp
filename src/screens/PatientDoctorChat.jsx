import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Colors from "../constants/colors";

export default function PatientDoctorChat({ route, navigation }) {
  // 🚀 استلام بيانات الدكتور اللي اخترناه من شاشة MyDoctors
  const { doctorId, doctorName } = route.params || {};

  const [patientId, setPatientId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef();

  useEffect(() => {
    setupChat();
  }, []);

  const setupChat = async () => {
    const pId = await AsyncStorage.getItem("patientId");
    setPatientId(pId);

    if (pId && doctorId) {
      fetchMessages(pId, doctorId);
      // 🚀 بيعمل ريفرش للرسايل كل 3 ثواني عشان لو الدكتور رد عليك
      const interval = setInterval(() => fetchMessages(pId, doctorId), 3000);
      return () => clearInterval(interval);
    }
  };

  const fetchMessages = async (pId, dId) => {
    try {
      const res = await axios.get(
        `https://healixbackend-production.up.railway.app/api/chat/messages/${pId}/${dId}`,
      );
      setMessages(res.data);
    } catch (error) {
      console.log("Chat fetch error", error.message);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !patientId || !doctorId) return;

    const textToSend = inputText;
    setInputText(""); // تفريغ المربع فوراً لسرعة الاستجابة

    try {
      await axios.post(
        "https://healixbackend-production.up.railway.app/api/chat/send",
        {
          senderId: patientId,
          receiverId: doctorId,
          text: textToSend,
        },
      );
      fetchMessages(patientId, doctorId); // نجيب الرسايل تاني بعد الإرسال
    } catch (error) {
      console.log("Send error", error.message);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender === patientId;
    const timeString = new Date(item.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myBubble : styles.theirBubble,
        ]}
      >
        <Text
          style={[styles.messageText, isMe ? styles.myText : styles.theirText]}
        >
          {item.text}
        </Text>
        <Text
          style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}
        >
          {timeString}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Dr. {doctorName || "Doctor"}</Text>
          <Text style={styles.headerStatus}>Connected</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Chat Area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatArea}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#94A3B8"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons
            name="send"
            size={20}
            color="#fff"
            style={{ marginLeft: 3 }}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    backgroundColor: Colors.primaryTeal,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: { padding: 5 },
  headerInfo: { alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  headerStatus: { color: "#E0F2F1", fontSize: 12 },
  chatArea: {
    padding: 15,
    paddingBottom: 20,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primaryTeal,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  messageText: { fontSize: 15, lineHeight: 22 },
  myText: { color: "#fff" },
  theirText: { color: "#1E293B" },
  timeText: { fontSize: 10, marginTop: 5, alignSelf: "flex-end" },
  myTime: { color: "#E0F2F1" },
  theirTime: { color: "#94A3B8" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    marginRight: 10,
    color: "#1E293B",
  },
  sendBtn: {
    width: 45,
    height: 45,
    backgroundColor: Colors.primaryTeal,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },
});
