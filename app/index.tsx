import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { AppContext, ContextData } from "@/context/AppContext";
import { ApiService } from "@/services/apiService";

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

let logo = require("../assets/images/logo.png");

const signInSchema = yup.object({
  email: yup.string().email("Please enter a valid email").required(),
  password: yup.string().min(6).required(),
});

GoogleSignin.configure();

export default function Login() {
  const router = useRouter();
  const { setAppState, user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const { errors, isValid, setFieldValue, handleSubmit, touched } = useFormik({
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      setLoading(true);

      const { res, e } = await ApiService.signInWithEmail(values);

      if (res) {
        if (setAppState) {
          setAppState({ user: { email: values.email, token: res.data.token } });
          router.navigate("/Home");
        }
      } else {
        console.log(e);
        Alert.alert(e?.message || "Could not sign in");
      }

      setLoading(false);
    },
    initialValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (user?.email) {
      router.navigate("/Home");
    }
  }, []);

  const handleSignInProcess = async () => {
    setLoadingGoogle(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        let appDetails: ContextData = {
          user: { ...response.data.user, token: "" },
        };
        console.log(response.data);
        const { res, e } = await ApiService.signInWithEmail({
          email: "user@tryperdiem.com",
          password: "password",
        });

        if (res.data && appDetails.user) {
          appDetails.user.token = res.data.token;
        }

        // console.log(res, e);

        setAppState?.(appDetails);
        router.navigate("/Home");
      } else {
        Alert.alert("Sign in cancelled");
      }
    } catch (error) {
      console.log(error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Sign in already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Sign in services not available");
            break;
          default:
            console.log(error);
            Alert.alert("Something went wrong, please try again");
        }
      } else {
        Alert.alert("Something went wrong, please try again.");
      }
    }

    setLoadingGoogle(true);
  };

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.wrapper}>
        <Image source={logo} style={styles.image} width={60} height={40} />
        <CustomInput
          error={touched.email ? errors?.email : undefined}
          textInputProps={{
            placeholder: "abc@example.com",
            keyboardType: "email-address",
            onChangeText(text) {
              setFieldValue("email", text.toLowerCase());
            },
            autoCapitalize: "none",
          }}
          label="Email"
        />
        <CustomInput
          error={touched.password ? errors?.password : undefined}
          textInputProps={{
            placeholder: "*******",
            secureTextEntry: true,
            onChangeText(text) {
              setFieldValue("password", text);
            },
          }}
          label="Password"
        />

        <CustomButton
          loading={loading}
          disabled={loading || !isValid}
          text="Sign In"
          onPress={() => {
            handleSubmit();
          }}
          style={styles.signIn}
        />

        <View style={styles.divider} />

        <CustomButton
          loading={loadingGoogle}
          text="Sign In with Google"
          onPress={handleSignInProcess}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 6,
    borderRadius: 4,
    fontSize: 16,
    marginTop: 6,
  },
  wrapper: {
    paddingHorizontal: 12,
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBFFFE",
  },
  text: {
    fontSize: 50,
    marginTop: 20,
    textAlign: "center",
  },

  divider: {
    marginVertical: 40,
    height: 1,
    backgroundColor: "black",
    width: "100%",
    borderRadius: 2,
  },
  image: {
    borderRadius: 200,
  },

  signIn: {
    marginTop: 20,
  },

  background: {
    backgroundColor: "#FBFFFE",
  },
});
