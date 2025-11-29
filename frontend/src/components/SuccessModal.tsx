import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  buttonText?: string;
  onClose: () => void;
}

export default function SuccessModal({
  visible,
  title,
  message,
  icon = 'checkmark-circle',
  buttonText = 'OK',
  onClose,
}: SuccessModalProps) {
  const [scaleAnim] = React.useState(new Animated.Value(0));
  const [checkmarkAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      // Animar o modal
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Animar o checkmark com delay
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(checkmarkAnim, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(checkmarkAnim, {
            toValue: 1,
            tension: 50,
            friction: 5,
            useNativeDriver: true,
          }),
        ]).start();
      }, 200);
    } else {
      scaleAnim.setValue(0);
      checkmarkAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icon animado */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: checkmarkAnim }],
              },
            ]}
          >
            <Ionicons name={icon} size={50} color="#10b981" />
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');
const modalWidth = Platform.OS === 'web' ? Math.min(400, width - 48) : width - 48;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: modalWidth,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
    }),
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#10b98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
