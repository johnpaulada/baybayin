import { Camera } from "expo-camera"
import * as Permissions from "expo-permissions"
import React, { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Text, View } from "react-native"
import CameraView from "../components/CameraView"
import CircleButton from "../components/CircleButton"

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
        <CameraView>
          <CircleButton onPress={snap}>
            {saving ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Text>{""}</Text>
            )}
          </CircleButton>
        </CameraView>
      </Camera>
    </View>
  )
}

HomeScreen.navigationOptions = () => ({
  title: "Snap some Baybayin text!"
})

export default HomeScreen
