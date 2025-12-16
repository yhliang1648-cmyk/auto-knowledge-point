# 透镜成像模拟器 🔬

一个交互式的光学物理模拟工具,用于演示和学习**凸透镜**和**凹透镜**的成像规律。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.7+-green.svg)

## ✨ 功能特点

- 🎯 **实时交互调节**: 通过滑块动态调整物距、焦距、物体高度
- 🔄 **透镜切换**: 一键切换凸透镜和凹透镜模式
- 📐 **光路追踪**: 精确绘制三条特殊光线的路径
  - 平行于主光轴的光线
  - 经过光心的光线
  - 经过焦点(或延长线)的光线
- 📊 **成像参数显示**: 实时计算并显示像距、放大率等参数
- 🎨 **直观可视化**: 清晰区分实像、虚像,标注物体、像、焦点

## 🖼️ 界面预览

程序界面包含:
- 主绘图区域: 显示透镜、光路、物体和像
- 交互滑块: 调节物距(1-50cm)、焦距(2-30cm)、物高(0.5-8cm)
- 单选按钮: 切换凸透镜/凹透镜
- 信息面板: 显示成像类型和参数

## 📋 物理原理

### 透镜成像公式
```
1/f = 1/u + 1/v
```
- `f`: 焦距 (凸透镜为正,凹透镜为负)
- `u`: 物距 (物体到透镜的距离)
- `v`: 像距 (像到透镜的距离)

### 放大率
```
m = v/u = h'/h
```
- `m > 0`: 正立像 | `m < 0`: 倒立像
- `|m| > 1`: 放大 | `|m| < 1`: 缩小

### 凸透镜成像规律

| 物距范围 | 像的性质 | 像距 | 应用 |
|---------|---------|------|------|
| u > 2f | 倒立、缩小、实像 | f < v < 2f | 照相机 |
| u = 2f | 倒立、等大、实像 | v = 2f | 测焦距 |
| f < u < 2f | 倒立、放大、实像 | v > 2f | 投影仪 |
| u = f | 不成像 | v = ∞ | - |
| u < f | 正立、放大、虚像 | \|v\| > u | 放大镜 |

### 凹透镜成像规律
- 无论物距多大,总是成**正立、缩小的虚像**
- 像与物在透镜同侧
- 常用于近视眼镜

## 🚀 快速开始

### 环境要求

- Python 3.7 或更高版本
- pip (Python包管理器)

### 安装步骤

1. **克隆或下载本项目**
```bash
git clone https://github.com/yourusername/lens-simulator.git
cd lens-simulator
```

2. **安装依赖**
```bash
pip install -r requirements.txt
```

3. **运行程序**
```bash
python lens_simulator.py
```

或者直接运行:
```bash
python lens_simulator/src/visualizer.py
```

## 🎮 使用说明

### 基本操作

1. **启动程序**: 运行 `python lens_simulator.py`
2. **调整参数**:
   - 拖动 **物距滑块** 改变物体位置 (1-50 cm)
   - 拖动 **焦距滑块** 改变透镜焦距 (2-30 cm)
   - 拖动 **物高滑块** 改变物体高度 (0.5-8 cm)
3. **切换透镜**: 点击右下角的单选按钮切换凸透镜/凹透镜
4. **观察变化**: 实时查看光路图和成像参数的变化

### 观察要点

#### 凸透镜观察
1. 将物距设为 **30cm**, 焦距设为 **10cm** (u > 2f)
   - 观察: 倒立、缩小的实像,像距在 f 和 2f 之间
2. 将物距设为 **15cm**, 焦距设为 **10cm** (f < u < 2f)
   - 观察: 倒立、放大的实像,像距大于 2f
3. 将物距设为 **5cm**, 焦距设为 **10cm** (u < f)
   - 观察: 正立、放大的虚像(虚线表示)

#### 凹透镜观察
1. 切换到凹透镜模式
2. 改变物距,观察虚像始终是正立、缩小的
3. 注意虚焦点的位置(空心圆点)

### 光路分析

程序绘制三条特殊光线:
- **蓝色线**: 平行于主光轴的光线
- **紫色线**: 经过光心的光线
- **品红色线**: 经过焦点的光线
- **虚线**: 表示虚像的反向延长线

## 📁 项目结构

```
lens-simulator/
├── lens_simulator.py          # 主程序入口
├── requirements.txt            # Python依赖
├── README.md                   # 本文件
├── LICENSE                     # 开源协议
├── lens_simulator/
│   ├── src/
│   │   ├── lens_physics.py   # 透镜物理计算模块
│   │   └── visualizer.py     # 可视化模块
│   ├── examples/              # 示例代码
│   └── docs/                  # 文档
```

## 🧪 示例代码

### 使用物理计算模块

```python
from lens_simulator.src.lens_physics import LensPhysics

# 创建凸透镜对象 (焦距10cm)
lens = LensPhysics(focal_length=10, lens_type='convex')

# 计算成像 (物距20cm)
result = lens.calculate_image(object_distance=20)

print(f"像距: {result['image_distance']:.2f} cm")
print(f"放大率: {result['magnification']:.2f}")
print(f"成像类型: {result['image_type']}")
print(f"成像描述: {result['description']}")
```

### 自定义可视化

```python
from lens_simulator.src.visualizer import LensVisualizer
import matplotlib.pyplot as plt

# 创建可视化对象
viz = LensVisualizer()

# 自定义初始参数
viz.object_distance = 25.0
viz.focal_length = 15.0
viz.object_height = 5.0

# 显示
viz.show()
```

## 🔧 高级配置

### 修改参数范围

编辑 `lens_simulator/src/visualizer.py` 中的滑块参数:

```python
# 修改物距范围 (默认 1-50cm)
self.slider_distance = Slider(
    ax_distance, '物距 (cm)',
    1.0, 100.0,  # 改为 1-100cm
    valinit=self.object_distance, valstep=0.5
)
```

### 更改颜色主题

修改 `visualizer.py` 中的颜色定义:

```python
# 物体颜色
self.ax.arrow(..., fc='green', ec='green')  # 改为其他颜色

# 实像颜色
color = 'red'  # 改为其他颜色

# 虚像颜色
color = 'orange'  # 改为其他颜色
```

## 🐛 故障排除

### 问题1: 中文显示乱码

**解决方法**:
```python
# 在 visualizer.py 中修改字体设置
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS']  # macOS
# 或
plt.rcParams['font.sans-serif'] = ['Microsoft YaHei']  # Windows
```

### 问题2: matplotlib 导入错误

**解决方法**:
```bash
pip install --upgrade matplotlib
```

### 问题3: 图形窗口无响应

**解决方法**: 尝试更换 matplotlib 后端
```python
import matplotlib
matplotlib.use('TkAgg')  # 或 'Qt5Agg'
```

## 🎓 教育应用

本工具适用于:
- 中学物理光学教学
- 大学普通物理实验预习
- 光学原理自学
- 在线教育演示

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出改进建议!

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📝 未来计划

- [ ] 添加球面镜成像模拟
- [ ] 支持组合透镜系统
- [ ] 添加光的色散效果
- [ ] 导出动画功能
- [ ] Web 版本 (基于 Plotly/D3.js)
- [ ] 多语言支持 (English, 中文)

## 📄 开源协议

本项目采用 MIT 协议开源 - 详见 [LICENSE](LICENSE) 文件

## 👏 致谢

- 物理公式参考: 《普通物理学》
- 可视化框架: [Matplotlib](https://matplotlib.org/)
- 灵感来源: 光学教学实验

## 📧 联系方式

- 项目主页: https://github.com/yourusername/lens-simulator
- 问题反馈: https://github.com/yourusername/lens-simulator/issues
- 邮箱: your.email@example.com

---

**⭐ 如果这个项目对你有帮助,请给个 Star!**

Made with ❤️ for Physics Education
