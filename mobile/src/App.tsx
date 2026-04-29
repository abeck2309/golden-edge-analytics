import { StatusBar } from "expo-status-bar";
import { useMemo, useRef, useState } from "react";
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";

import { LoadingOverlay } from "./components/LoadingOverlay";
import { NativeHeader } from "./components/NativeHeader";
import { WebErrorState } from "./components/WebErrorState";
import { GOLDEN_EDGE_HOME_URL, isGoldenEdgeUrl } from "./config/sites";
import { usePushNotifications } from "./hooks/usePushNotifications";
import { NotificationsScreen } from "./screens/NotificationsScreen";

type ActiveScreen = "hub" | "notifications";

const quickLinks = [
  { label: "Hub", url: GOLDEN_EDGE_HOME_URL },
  { label: "VGK", url: new URL("/vgk-updates", GOLDEN_EDGE_HOME_URL).toString() },
  { label: "Quizzes", url: "https://goldenedgeanalytics-quizzes.vercel.app/" }
];

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const notifications = usePushNotifications();
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("hub");
  const [currentUrl, setCurrentUrl] = useState(GOLDEN_EDGE_HOME_URL);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const activeTitle = useMemo(() => {
    if (activeScreen === "notifications") {
      return "Notifications";
    }

    return "Golden Edge";
  }, [activeScreen]);

  function loadUrl(url: string) {
    setLoadError(false);
    setActiveScreen("hub");
    setCurrentUrl(url);
  }

  function handleNavigationStateChange(navState: WebViewNavigation) {
    setCanGoBack(navState.canGoBack);
    setCurrentUrl(navState.url);
  }

  function retryWebView() {
    setLoadError(false);
    webViewRef.current?.reload();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <NativeHeader
        canGoBack={activeScreen === "hub" && canGoBack}
        onBack={() => webViewRef.current?.goBack()}
        onOpenNotifications={() => setActiveScreen("notifications")}
        onOpenHub={() => setActiveScreen("hub")}
        title={activeTitle}
      />

      {activeScreen === "notifications" ? (
        <NotificationsScreen notifications={notifications} />
      ) : (
        <View style={styles.webShell}>
          <View style={styles.quickNav}>
            {quickLinks.map((link) => (
              <TouchableOpacity
                key={link.label}
                accessibilityRole="button"
                onPress={() => loadUrl(link.url)}
                style={[
                  styles.quickNavButton,
                  currentUrl.startsWith(link.url.replace(/\/$/, "")) && styles.quickNavButtonActive
                ]}
              >
                <Text style={styles.quickNavText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {loadError ? (
            <WebErrorState onRetry={retryWebView} />
          ) : null}

          <WebView
            ref={webViewRef}
            source={{ uri: currentUrl }}
            style={[styles.webView, loadError && styles.hiddenWebView]}
            allowsBackForwardNavigationGestures
            applicationNameForUserAgent="GoldenEdgeAnalyticsApp"
            javaScriptEnabled
            onError={() => setLoadError(true)}
            onHttpError={(event) => {
              if (event.nativeEvent.statusCode >= 500) {
                setLoadError(true);
              }
            }}
            onLoadEnd={() => setIsLoading(false)}
            onLoadStart={() => {
              setIsLoading(true);
              setLoadError(false);
            }}
            onNavigationStateChange={handleNavigationStateChange}
            onShouldStartLoadWithRequest={(request) => {
              if (isGoldenEdgeUrl(request.url)) {
                return true;
              }

              Linking.openURL(request.url);
              return false;
            }}
            pullToRefreshEnabled
          />

          {isLoading ? <LoadingOverlay /> : null}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#070707"
  },
  webShell: {
    flex: 1,
    backgroundColor: "#070707"
  },
  quickNav: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.12)"
  },
  quickNavButton: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  quickNavButtonActive: {
    borderColor: "#B4975A",
    backgroundColor: "rgba(180,151,90,0.16)"
  },
  quickNavText: {
    color: "#F4E7C5",
    fontSize: 12,
    fontWeight: "700"
  },
  webView: {
    flex: 1,
    backgroundColor: "#070707"
  },
  hiddenWebView: {
    opacity: 0
  }
});
