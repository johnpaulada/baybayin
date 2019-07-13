import { Camera } from "expo-camera"
import * as Permissions from "expo-permissions"
import React, { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"

const HomeScreen = ({ navigation }) => {
  const cameraRef = useRef(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Permissions.askAsync(Permissions.CAMERA)
  }, [])

  const snap = async () => {
    setSaving(true)
    const { base64 } = await cameraRef.current.takePictureAsync({
      base64: true
    })
    setSaving(false)
    navigation.navigate("Results", { base64 })
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "column-reverse"
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              flex: 0.1
            }}
            onPress={snap}
          >
            {saving ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
                Picture!
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  )
}

export default HomeScreen
