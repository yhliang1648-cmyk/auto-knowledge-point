# 智能刷題助手 - 移動端App設計方案

## 📱 App概述

**平台**：iOS + Android（React Native跨平台）
**最低版本**：iOS 13.0+ / Android 8.0+
**開發工具**：React Native 0.72 + Expo 49
**設計語言**：Material Design 3 + iOS Human Interface Guidelines

---

## 🎨 UI/UX設計

### 設計原則
1. **簡潔優先**：一個頁面一個核心任務
2. **視覺清晰**：大字體、高對比度、清晰圖標
3. **快速反饋**：所有操作3秒內響應
4. **離線可用**：核心功能離線也能使用
5. **數據可視**：圖表化呈現學習進度

### 色彩系統
```javascript
const colorScheme = {
    primary: '#667eea',      // 主色（紫色）
    secondary: '#764ba2',    // 次色（深紫）
    success: '#28a745',      // 成功（綠色）
    error: '#e74c3c',        // 錯誤（紅色）
    warning: '#f39c12',      // 警告（橙色）
    background: '#f5f7fa',   // 背景
    surface: '#ffffff',      // 卡片背景
    text: '#333333',         // 主文字
    textSecondary: '#666666' // 次要文字
};
```

---

## 📂 頁面結構與設計

### 1. 啟動頁（Splash Screen）
**設計要素**：
- App Logo（中央）
- 品牌名稱：智能刷題助手
- 載入動畫（旋轉圓環）
- 底部版本號

**技術實現**：
```typescript
// SplashScreen.tsx
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

useEffect(() => {
    async function prepare() {
        await checkAuth();
        await loadCachedData();
        await SplashScreen.hideAsync();
    }
    prepare();
}, []);
```

---

### 2. 登錄/註冊頁
**設計**：
- 簡約表單（手機號 + 驗證碼）
- 第三方登錄（微信/Google/Apple）
- 隱私政策同意勾選

**頁面流程**：
```
[輸入手機號] → [獲取驗證碼] → [輸入驗證碼] → [完成註冊] → [首頁]
```

**技術實現**：
```typescript
const LoginScreen = () => {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');

    const sendVerificationCode = async () => {
        const response = await api.sendSMS({ phone });
        if (response.success) {
            Alert.alert('驗證碼已發送', '請查收短信');
        }
    };

    const login = async () => {
        const response = await api.verifyCode({ phone, code });
        if (response.success) {
            await AsyncStorage.setItem('auth_token', response.token);
            navigation.replace('Home');
        }
    };

    return (
        <SafeAreaView>
            <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="手機號碼"
                keyboardType="phone-pad"
            />
            <Button title="獲取驗證碼" onPress={sendVerificationCode} />
            <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="驗證碼"
                keyboardType="number-pad"
            />
            <Button title="登錄" onPress={login} />
        </SafeAreaView>
    );
};
```

---

### 3. 首頁（Home Screen）

**佈局**：
```
┌─────────────────────┐
│  👤 [頭像]  Hi, 小明 │  → 頂部個人信息
│  📊 本週進步 +15%   │
├─────────────────────┤
│  📸 快速拍照批改     │  → 主要操作（大按鈕）
│  [相機圖標]         │
├─────────────────────┤
│  📅 今日任務 (3/5)  │  → 任務列表
│  □ 練習二次方程     │
│  ✓ 複習牛頓定律     │
│  □ 錯題本（5道新增）│
├─────────────────────┤
│  📊 學習統計         │  → 數據卡片
│  ┌─────┬─────┬─────┐│
│  │本週  │正確率│錯題  ││
│  │15題 │82%  │3道  ││
│  └─────┴─────┴─────┘│
└─────────────────────┘
```

**技術實現**：
```typescript
const HomeScreen = () => {
    const [stats, setStats] = useState(null);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        loadTodayTasks();
        loadWeeklyStats();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {/* 頂部個人信息 */}
            <View style={styles.header}>
                <Avatar source={{ uri: user.avatar }} />
                <Text style={styles.greeting}>Hi, {user.name}</Text>
                <Text style={styles.progress}>本週進步 +{stats?.improvement}%</Text>
            </View>

            {/* 快速拍照按鈕 */}
            <TouchableOpacity
                style={styles.cameraBigButton}
                onPress={() => navigation.navigate('Camera')}
            >
                <Icon name="camera" size={48} color="#fff" />
                <Text style={styles.cameraButtonText}>拍照批改</Text>
            </TouchableOpacity>

            {/* 今日任務 */}
            <View style={styles.taskSection}>
                <Text style={styles.sectionTitle}>📅 今日任務</Text>
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </View>

            {/* 學習統計 */}
            <View style={styles.statsSection}>
                <StatsCard stats={stats} />
            </View>
        </ScrollView>
    );
};
```

---

### 4. 拍照批改頁（Camera Screen）

**設計**：
- 全屏相機預覽
- 自動對焦指示器
- 閃光燈開關
- 多張連拍模式
- 邊緣檢測框（綠色虛線）
- 底部拍照按鈕（大圓形）

**交互流程**：
```
[打開相機] → [自動對焦] → [顯示邊緣框] → [拍照] → [預覽確認] → [上傳OCR]
```

**UI元素**：
```typescript
const CameraScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [flashMode, setFlashMode] = useState(FlashMode.off);
    const [capturedImages, setCapturedImages] = useState([]);
    const cameraRef = useRef(null);

    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                style={styles.camera}
                type={type}
                flashMode={flashMode}
            >
                {/* 邊緣檢測框 */}
                <EdgeDetectionOverlay />

                {/* 頂部工具欄 */}
                <View style={styles.topBar}>
                    <IconButton
                        icon={flashMode === FlashMode.off ? "flash-off" : "flash"}
                        onPress={() => setFlashMode(prev =>
                            prev === FlashMode.off ? FlashMode.on : FlashMode.off
                        )}
                    />
                    <IconButton
                        icon="flip-camera"
                        onPress={() => setType(prev =>
                            prev === CameraType.back ? CameraType.front : CameraType.back
                        )}
                    />
                </View>

                {/* 底部拍照按鈕 */}
                <View style={styles.bottomBar}>
                    {/* 已拍照片數量 */}
                    <Text style={styles.imageCount}>{capturedImages.length}</Text>

                    {/* 拍照按鈕 */}
                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takePicture}
                    >
                        <View style={styles.captureButtonInner} />
                    </TouchableOpacity>

                    {/* 完成按鈕 */}
                    <Button
                        title="完成"
                        onPress={finishCapture}
                        disabled={capturedImages.length === 0}
                    />
                </View>
            </Camera>
        </View>
    );
};
```

---

### 5. 批改結果頁（Grading Result Screen）

**設計**：
```
┌─────────────────────┐
│  ✅ 批改完成！       │  → 頭部狀態
│  總分：85/100       │
├─────────────────────┤
│  [原卷圖片]         │  → 左右滑動對比
│  [批改圖片]         │
├─────────────────────┤
│  📋 逐題批註         │  → 展開列表
│  ┌─────────────────┐│
│  │ Q1: 正確 ✅ 10/10││
│  │ 思路清晰，步驟完整 ││
│  ├─────────────────┤│
│  │ Q2: 部分正確 ⚠️  ││
│  │ 7/10             ││
│  │ 公式使用正確，但計算││
│  │ 錯誤在第3步       ││
│  ├─────────────────┤│
│  │ Q3: 錯誤 ❌ 0/10 ││
│  │ 未理解二次方程的  ││
│  │ 判別式應用        ││
│  │ [查看講解] [練習] ││
│  └─────────────────┘│
├─────────────────────┤
│  💡 薄弱知識點       │  → 分析卡片
│  • 二次方程判別式    │
│  • 因式分解         │
│  [查看詳細分析]     │
└─────────────────────┘
```

**技術實現**：
```typescript
const GradingResultScreen = ({ route }) => {
    const { gradingResult } = route.params;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    return (
        <ScrollView style={styles.container}>
            {/* 頭部成績 */}
            <View style={styles.scoreHeader}>
                <Icon name="check-circle" size={48} color="#28a745" />
                <Text style={styles.scoreText}>
                    {gradingResult.total_score}/{gradingResult.max_score}
                </Text>
            </View>

            {/* 圖片對比 */}
            <ViewPager
                style={styles.imagePager}
                initialPage={0}
                onPageSelected={(e) => setCurrentImageIndex(e.nativeEvent.position)}
            >
                <View key="original">
                    <Image source={{ uri: gradingResult.original_image }} />
                    <Text style={styles.imageLabel}>原卷</Text>
                </View>
                <View key="graded">
                    <Image source={{ uri: gradingResult.graded_image }} />
                    <Text style={styles.imageLabel}>批改結果</Text>
                </View>
            </ViewPager>

            {/* 逐題批註 */}
            <View style={styles.questionsSection}>
                <Text style={styles.sectionTitle}>📋 逐題批註</Text>
                {gradingResult.questions.map((q, index) => (
                    <QuestionCard
                        key={index}
                        question={q}
                        onExplainPress={() => showExplanation(q)}
                        onPracticePress={() => startPractice(q.knowledge_point)}
                    />
                ))}
            </View>

            {/* 薄弱知識點 */}
            <View style={styles.weakPointsSection}>
                <Text style={styles.sectionTitle}>💡 薄弱知識點</Text>
                <WeakPointsCard weakPoints={gradingResult.weak_points} />
                <Button
                    title="查看詳細分析"
                    onPress={() => navigation.navigate('Analysis')}
                />
            </View>
        </ScrollView>
    );
};
```

---

### 6. 錯題本頁（Wrong Questions Screen）

**設計**：
- Tab切換（全部/數學/物理/化學）
- 卡片式佈局（可左滑刪除）
- 篩選按鈕（時間/知識點/難度）
- 統計圖表（頂部）

**技術實現**：
```typescript
const WrongQuestionsScreen = () => {
    const [questions, setQuestions] = useState([]);
    const [filter, setFilter] = useState('all');

    const renderItem = ({ item }) => (
        <Swipeable
            renderRightActions={() => (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteQuestion(item.id)}
                >
                    <Icon name="delete" size={24} color="#fff" />
                </TouchableOpacity>
            )}
        >
            <QuestionCard question={item} />
        </Swipeable>
    );

    return (
        <View style={styles.container}>
            {/* 統計圖表 */}
            <ErrorRateChart data={getChartData(questions)} />

            {/* 篩選按鈕 */}
            <View style={styles.filterBar}>
                <FilterButton label="全部" active={filter === 'all'} onPress={() => setFilter('all')} />
                <FilterButton label="數學" active={filter === 'math'} onPress={() => setFilter('math')} />
                <FilterButton label="物理" active={filter === 'physics'} onPress={() => setFilter('physics')} />
            </View>

            {/* 錯題列表 */}
            <FlatList
                data={questions.filter(q => filter === 'all' || q.subject === filter)}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};
```

---

### 7. 練習中心頁（Practice Screen）

**設計**：
- 題目展示（支持LaTeX公式）
- 手寫答題板（Canvas）
- 提交按鈕
- 即時批改彈窗
- 詳解動畫（受力圖/運動模擬）

**技術實現**：
```typescript
import { WebView } from 'react-native-webview';
import MathJax from 'react-native-mathjax';

const PracticeScreen = ({ route }) => {
    const { question } = route.params;
    const [answer, setAnswer] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const submitAnswer = async () => {
        const result = await api.gradeAnswer({
            question_id: question.id,
            answer: answer
        });

        setIsSubmitted(true);
        showGradingResult(result);
    };

    return (
        <ScrollView style={styles.container}>
            {/* 題目 */}
            <View style={styles.questionSection}>
                <MathJax
                    html={`<div>${question.question_text}</div>`}
                    mathJaxOptions={{
                        messageStyle: 'none',
                        extensions: ['tex2jax.js'],
                        tex2jax: {
                            inlineMath: [['$', '$'], ['\\(', '\\)']],
                            displayMath: [['$$', '$$'], ['\\[', '\\]']]
                        }
                    }}
                />
            </View>

            {/* 手寫答題板 */}
            <View style={styles.answerSection}>
                <Text style={styles.sectionTitle}>✍️ 你的答案</Text>
                <SketchCanvas
                    style={styles.canvas}
                    strokeColor="#000"
                    strokeWidth={2}
                    onStrokeEnd={(path) => {
                        // OCR識別手寫內容
                        recognizeHandwriting(path);
                    }}
                />
                {/* 或使用文字輸入 */}
                <TextInput
                    style={styles.textInput}
                    value={answer}
                    onChangeText={setAnswer}
                    placeholder="輸入答案..."
                    multiline
                />
            </View>

            {/* 提交按鈕 */}
            <Button
                title={isSubmitted ? "查看詳解" : "提交答案"}
                onPress={isSubmitted ? showExplanation : submitAnswer}
            />

            {/* 詳解（批改後顯示） */}
            {isSubmitted && (
                <View style={styles.explanationSection}>
                    <ExplanationWithAnimation question={question} />
                </View>
            )}
        </ScrollView>
    );
};
```

---

### 8. 我的頁面（Profile Screen）

**設計**：
```
┌─────────────────────┐
│  👤 [大頭像]         │
│  小明 | DSE 2024    │
│  [編輯資料]         │
├─────────────────────┤
│  📊 學習數據         │
│  ┌─────┬─────┬─────┐│
│  │累計  │正確率│連續  ││
│  │98題 │85%  │7天  ││
│  └─────┴─────┴─────┘│
├─────────────────────┤
│  📈 成績曲線         │
│  [折線圖]           │
├─────────────────────┤
│  ⚙️ 設置             │
│  □ 推送通知         │
│  □ 每日提醒         │
│  □ 數據同步         │
│  [退出登錄]         │
└─────────────────────┘
```

**技術實現**：
```typescript
const ProfileScreen = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadUserProfile();
        loadStatistics();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {/* 個人信息 */}
            <View style={styles.profileHeader}>
                <Avatar size={80} source={{ uri: user?.avatar }} />
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.examInfo}>DSE {user?.exam_year}</Text>
                <Button title="編輯資料" onPress={editProfile} />
            </View>

            {/* 學習數據 */}
            <View style={styles.statsGrid}>
                <StatCard label="累計題目" value={stats?.total_questions} />
                <StatCard label="正確率" value={`${stats?.accuracy}%`} />
                <StatCard label="連續打卡" value={`${stats?.streak_days}天`} />
            </View>

            {/* 成績曲線 */}
            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>📈 成績曲線</Text>
                <LineChart
                    data={{
                        labels: stats?.labels || [],
                        datasets: [{ data: stats?.scores || [] }]
                    }}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    chartConfig={chartConfig}
                />
            </View>

            {/* 設置 */}
            <View style={styles.settingsSection}>
                <SettingsItem
                    icon="notifications"
                    label="推送通知"
                    value={settings.notifications}
                    onToggle={toggleNotifications}
                />
                <SettingsItem
                    icon="alarm"
                    label="每日提醒"
                    value={settings.dailyReminder}
                    onToggle={toggleDailyReminder}
                />
                <Button
                    title="退出登錄"
                    onPress={logout}
                    color="#e74c3c"
                />
            </View>
        </ScrollView>
    );
};
```

---

## 🔧 技術實現要點

### 1. 離線存儲
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import Realm from 'realm';

// 緩存題目
const cacheQuestions = async (questions) => {
    await AsyncStorage.setItem('cached_questions', JSON.stringify(questions));
};

// 離線模式檢測
const isOnline = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected;
};
```

### 2. 推送通知
```typescript
import * as Notifications from 'expo-notifications';

// 請求權限
const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
};

// 每日提醒
const scheduleDailyReminder = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "該做題啦！",
            body: "今天還有3道題目等你挑戰"
        },
        trigger: {
            hour: 20,
            minute: 0,
            repeats: true
        }
    });
};
```

### 3. 性能優化
```typescript
// 使用React.memo避免不必要重渲染
const QuestionCard = React.memo(({ question }) => {
    return <View>...</View>;
});

// 使用FlatList虛擬化長列表
<FlatList
    data={questions}
    renderItem={renderItem}
    initialNumToRender={10}
    maxToRenderPerBatch={10}
    windowSize={5}
/>

// 圖片懶加載
import FastImage from 'react-native-fast-image';

<FastImage
    source={{ uri: imageUrl, priority: FastImage.priority.normal }}
    resizeMode={FastImage.resizeMode.contain}
/>
```

---

## 📦 打包與發布

### iOS打包
```bash
# 使用EAS Build
eas build --platform ios

# 或使用Xcode
cd ios
pod install
open ExamHelper.xcworkspace
```

### Android打包
```bash
# 使用EAS Build
eas build --platform android

# 或使用Gradle
cd android
./gradlew assembleRelease
```

### App Store提交清單
- [ ] App圖標（1024x1024）
- [ ] 截圖（6.5吋、5.5吋）
- [ ] 隱私政策URL
- [ ] 應用描述（繁體中文）
- [ ] 關鍵詞優化（ASO）
- [ ] 測試賬號

---

**文檔版本**：v1.0
**設計工具**：Figma
**預計開發週期**：3-4個月
