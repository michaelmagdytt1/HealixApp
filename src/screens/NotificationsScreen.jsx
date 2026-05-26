import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Colors from "../constants/colors";

export default function NotificationsScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "مرحباً بك في مساحتك الصحية الآمنة 🩺✨\nأنا المساعد الذكي لـ Healix. كيف يمكنني مساعدتك اليوم؟",
      sender: "ai",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef();

  // 👈 التعديل تم هنا: حولنا الدالة لـ async عشان تكلم السيرفر
  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newUserMsg = {
      id: Date.now().toString(),
      text: userText,
      sender: "user",
    };

    // إظهار رسالة المستخدم فوراً
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText("");

    try {
      // ⚠️ تأكد من تغيير الـ IP إلى الـ IPv4 الخاص بجهازك الحالي
      const response = await fetch("http://192.168.1.2:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      if (response.ok) {
        // إظهار الرد الحقيقي القادم من الذكاء الاصطناعي
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          sender: "ai",
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        throw new Error(data.error || "Server error");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      // رسالة خطأ تظهر لو السيرفر مقفول أو الـ IP غلط
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        text: "عذراً، لا يمكنني الاتصال بالخادم الآن. تأكد من تشغيل السيرفر وتطابق الـ IP. 🔌",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === "user";
    return (
      <View
        style={[
          styles.messageWrapper,
          isUser ? styles.messageWrapperUser : styles.messageWrapperAi,
        ]}
      >
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="medical" size={16} color="#00E5FF" />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.aiText,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B101E" />

      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Ionicons
            name="sparkles"
            size={20}
            color="#00E5FF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.headerTitle}>Healix AI</Text>
        </View>
        <Text style={styles.headerSubtitle}>مساعدك الطبي الشخصي</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 25}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="تحدث مع المساعد الذكي..."
              placeholderTextColor="#8892B0"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={18}
                color="#fff"
                style={{ marginLeft: 2, marginTop: 2 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B101E",
  },
  header: {
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
    elevation: 5,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F9FAFB",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "600",
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-end",
  },
  messageWrapperUser: {
    justifyContent: "flex-end",
  },
  messageWrapperAi: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#374151",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 14,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: Colors.primaryTeal || "#0EA5E9",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#1F2937",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#374151",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
  },
  userText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  aiText: {
    color: "#E5E7EB",
  },
  inputWrapper: {
    paddingHorizontal: 15,
    paddingBottom: Platform.OS === "ios" ? 25 : 15,
    backgroundColor: "transparent",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  textInput: {
    flex: 1,
    color: "#F9FAFB",
    fontSize: 16,
    maxHeight: 100,
    textAlign: "right",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 42,
    height: 42,
    backgroundColor: "#00E5FF",
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
