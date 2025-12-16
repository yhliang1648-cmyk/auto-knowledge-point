#!/usr/bin/env python3
"""
透镜成像模拟器 - 主程序入口

这是一个交互式的光学模拟程序,可以动态展示凸透镜和凹透镜的成像过程
"""

import sys
import os

# 将src目录添加到路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lens_simulator', 'src'))

from visualizer import main

if __name__ == '__main__':
    print("=" * 60)
    print("透镜成像模拟器".center(50))
    print("=" * 60)
    print("\n使用说明:")
    print("  1. 拖动滑块调整物距、焦距、物高")
    print("  2. 点击单选按钮切换凸透镜/凹透镜")
    print("  3. 观察光路图和成像特点")
    print("\n提示:")
    print("  - 凸透镜: 物距 > 2f 时,成倒立缩小的实像")
    print("  - 凸透镜: f < 物距 < 2f 时,成倒立放大的实像")
    print("  - 凸透镜: 物距 < f 时,成正立放大的虚像")
    print("  - 凹透镜: 始终成正立缩小的虚像")
    print("\n启动程序...\n")

    main()
