## ADDED Requirements

### Requirement: Android 下载入口同时支持二维码与直链
系统 SHALL 在页面中提供 Android App 下载入口，并同时展示二维码与可点击下载链接；下载目标 MUST 指向 `https://mmirror.qiexuxing.top/download/mind-mirror-1.0.0.apk`。

#### Scenario: 下载入口完整展示
- **WHEN** 用户访问包含下载入口的页面
- **THEN** 页面 SHALL 展示 Android 下载说明、二维码与下载按钮（或等价可点击入口）
- **AND** 二维码与按钮的下载目标 MUST 一致为同一个 APK 地址

### Requirement: 移动端点击后可直接发起 APK 下载
当用户使用移动端浏览器访问时，系统 SHALL 提供可直接点击的下载动作；点击后 MUST 导航到 APK 直链以触发浏览器下载流程。

#### Scenario: Android 手机点击下载按钮
- **WHEN** 用户在 Android 手机浏览器点击“下载 Android 版”按钮
- **THEN** 浏览器 SHALL 访问 `https://mmirror.qiexuxing.top/download/mind-mirror-1.0.0.apk`
- **AND** 用户可继续按浏览器或系统提示完成安装包下载

### Requirement: Web 端扫码下载体验可用
当用户在桌面 Web 端访问时，系统 SHALL 提供清晰可扫描的二维码用于手机扫码下载，并保留可点击直链作为备用路径。

#### Scenario: 桌面端展示二维码与备用按钮
- **WHEN** 用户在桌面浏览器打开页面
- **THEN** 页面 SHALL 显示可识别二维码
- **AND** 页面 SHALL 同时提供可点击 APK 下载入口
