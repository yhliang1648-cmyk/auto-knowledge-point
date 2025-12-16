"""
透镜成像可视化模块
使用matplotlib绘制光路图
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.widgets import Slider, RadioButtons
import numpy as np
from lens_physics import LensPhysics


class LensVisualizer:
    """透镜成像可视化类"""

    def __init__(self):
        """初始化可视化界面"""
        # 初始参数
        self.focal_length = 10.0  # 焦距 (cm)
        self.object_distance = 20.0  # 物距 (cm)
        self.object_height = 3.0  # 物高 (cm)
        self.lens_type = 'convex'  # 透镜类型

        # 创建物理计算对象
        self.physics = LensPhysics(self.focal_length, self.lens_type)

        # 创建图形和坐标轴
        self.fig = plt.figure(figsize=(14, 9))
        self.fig.suptitle('透镜成像模拟器', fontsize=16, fontweight='bold')

        # 主绘图区域
        self.ax = plt.axes([0.1, 0.3, 0.8, 0.6])
        self.ax.set_aspect('equal')
        self.ax.grid(True, alpha=0.3)
        self.ax.set_xlabel('位置 (cm)', fontsize=11)
        self.ax.set_ylabel('高度 (cm)', fontsize=11)

        # 创建滑块
        self._create_sliders()

        # 创建单选按钮
        self._create_radio_buttons()

        # 绘制初始状态
        self.update(None)

    def _create_sliders(self):
        """创建交互式滑块"""
        # 物距滑块
        ax_distance = plt.axes([0.15, 0.20, 0.65, 0.03])
        self.slider_distance = Slider(
            ax_distance, '物距 (cm)',
            1.0, 50.0, valinit=self.object_distance, valstep=0.5
        )
        self.slider_distance.on_changed(self.update)

        # 焦距滑块
        ax_focal = plt.axes([0.15, 0.15, 0.65, 0.03])
        self.slider_focal = Slider(
            ax_focal, '焦距 (cm)',
            2.0, 30.0, valinit=self.focal_length, valstep=0.5
        )
        self.slider_focal.on_changed(self.update)

        # 物高滑块
        ax_height = plt.axes([0.15, 0.10, 0.65, 0.03])
        self.slider_height = Slider(
            ax_height, '物高 (cm)',
            0.5, 8.0, valinit=self.object_height, valstep=0.1
        )
        self.slider_height.on_changed(self.update)

    def _create_radio_buttons(self):
        """创建透镜类型选择按钮"""
        ax_radio = plt.axes([0.85, 0.10, 0.12, 0.15])
        self.radio = RadioButtons(
            ax_radio,
            ('凸透镜', '凹透镜'),
            active=0 if self.lens_type == 'convex' else 1
        )
        self.radio.on_clicked(self.change_lens_type)

    def change_lens_type(self, label):
        """改变透镜类型"""
        if label == '凸透镜':
            self.lens_type = 'convex'
        else:
            self.lens_type = 'concave'
        self.physics = LensPhysics(self.focal_length, self.lens_type)
        self.update(None)

    def update(self, val):
        """更新图形"""
        # 获取当前参数
        self.object_distance = self.slider_distance.val
        self.focal_length = self.slider_focal.val
        self.object_height = self.slider_height.val

        # 更新物理计算对象
        self.physics = LensPhysics(self.focal_length, self.lens_type)

        # 清空坐标轴
        self.ax.clear()

        # 设置坐标轴范围
        x_range = max(self.object_distance * 1.5, abs(self.focal_length) * 3, 40)
        self.ax.set_xlim(-x_range, x_range)
        self.ax.set_ylim(-self.object_height * 3, self.object_height * 3)

        # 绘制主光轴
        self.ax.axhline(y=0, color='gray', linestyle='-', linewidth=1, alpha=0.5)
        self.ax.axvline(x=0, color='black', linestyle='-', linewidth=2, label='透镜')

        # 绘制透镜
        self._draw_lens()

        # 绘制焦点
        self._draw_focal_points()

        # 绘制物体
        self._draw_object()

        # 计算并绘制像
        result = self.physics.calculate_image(self.object_distance)

        if result['image_type'] != 'none':
            self._draw_image(result)
            self._draw_rays(result)

        # 显示成像信息
        self._display_info(result)

        # 设置标签和网格
        self.ax.set_xlabel('位置 (cm)', fontsize=11)
        self.ax.set_ylabel('高度 (cm)', fontsize=11)
        self.ax.grid(True, alpha=0.3)
        self.ax.legend(loc='upper right', fontsize=9)

        plt.draw()

    def _draw_lens(self):
        """绘制透镜"""
        lens_height = self.object_height * 3

        if self.lens_type == 'convex':
            # 凸透镜 (双凸形状)
            left_arc = patches.Arc((0, 0), width=1, height=lens_height,
                                   angle=0, theta1=90, theta2=270,
                                   linewidth=3, color='blue')
            right_arc = patches.Arc((0, 0), width=1, height=lens_height,
                                    angle=0, theta1=270, theta2=90,
                                    linewidth=3, color='blue')
            self.ax.add_patch(left_arc)
            self.ax.add_patch(right_arc)
        else:
            # 凹透镜 (双凹形状)
            left_arc = patches.Arc((0, 0), width=1, height=lens_height,
                                   angle=0, theta1=270, theta2=90,
                                   linewidth=3, color='blue')
            right_arc = patches.Arc((0, 0), width=1, height=lens_height,
                                    angle=0, theta1=90, theta2=270,
                                    linewidth=3, color='blue')
            self.ax.add_patch(left_arc)
            self.ax.add_patch(right_arc)

    def _draw_focal_points(self):
        """绘制焦点"""
        f = self.physics.focal_length

        if self.lens_type == 'convex':
            # 凸透镜焦点
            self.ax.plot(f, 0, 'ro', markersize=8, label=f'焦点 F (±{f:.1f}cm)')
            self.ax.plot(-f, 0, 'ro', markersize=8)
            self.ax.text(f, -0.5, 'F', ha='center', fontsize=10, color='red')
            self.ax.text(-f, -0.5, 'F', ha='center', fontsize=10, color='red')
        else:
            # 凹透镜焦点 (虚焦点)
            self.ax.plot(f, 0, 'ro', markersize=8, fillstyle='none', label=f'虚焦点 F ({f:.1f}cm)')
            self.ax.plot(-f, 0, 'ro', markersize=8, fillstyle='none')
            self.ax.text(f, -0.5, 'F', ha='center', fontsize=10, color='red')
            self.ax.text(-f, -0.5, 'F', ha='center', fontsize=10, color='red')

    def _draw_object(self):
        """绘制物体"""
        obj_x = -self.object_distance
        obj_h = self.object_height

        # 绘制物体 (箭头)
        self.ax.arrow(obj_x, 0, 0, obj_h * 0.9,
                      head_width=0.5, head_length=0.3,
                      fc='green', ec='green', linewidth=2.5, label='物体')
        self.ax.plot([obj_x, obj_x], [0, obj_h], 'g-', linewidth=2.5)
        self.ax.text(obj_x, obj_h + 0.5, '物', ha='center', fontsize=11,
                     color='green', fontweight='bold')

    def _draw_image(self, result):
        """绘制像"""
        img_x = result['image_distance']
        img_h = self.object_height * result['magnification']

        if result['image_type'] == 'real':
            # 实像 (实线箭头)
            color = 'red'
            style = '-'
            label = '实像'
        else:
            # 虚像 (虚线箭头)
            color = 'orange'
            style = '--'
            label = '虚像'

        # 绘制像
        if img_h > 0:
            self.ax.arrow(img_x, 0, 0, img_h * 0.9,
                          head_width=0.5, head_length=0.3,
                          fc=color, ec=color, linewidth=2.5,
                          linestyle=style, label=label)
        else:
            self.ax.arrow(img_x, 0, 0, img_h * 0.9,
                          head_width=0.5, head_length=-0.3,
                          fc=color, ec=color, linewidth=2.5,
                          linestyle=style, label=label)

        self.ax.plot([img_x, img_x], [0, img_h], color=color,
                     linestyle=style, linewidth=2.5)
        self.ax.text(img_x, img_h + 0.5 if img_h > 0 else img_h - 0.5,
                     '像', ha='center', fontsize=11, color=color, fontweight='bold')

    def _draw_rays(self, result):
        """绘制光线"""
        rays = self.physics.get_ray_paths(self.object_distance, self.object_height)

        if rays is None:
            return

        # 光线1: 平行于主光轴
        ray1 = rays['ray1']
        self.ax.plot(ray1['x'], ray1['y'], 'b-', linewidth=1.5, alpha=0.7)
        if 'virtual_x' in ray1:
            self.ax.plot(ray1['virtual_x'], ray1['virtual_y'],
                        'b--', linewidth=1.5, alpha=0.5)

        # 光线2: 经过光心
        ray2 = rays['ray2']
        self.ax.plot(ray2['x'], ray2['y'], 'purple', linewidth=1.5, alpha=0.7)

        # 光线3: 经过焦点
        ray3 = rays['ray3']
        if 'guide_x' in ray3:
            self.ax.plot(ray3['guide_x'], ray3['guide_y'],
                        'm--', linewidth=1, alpha=0.3)
        self.ax.plot(ray3['x'], ray3['y'], 'm-', linewidth=1.5, alpha=0.7)
        if 'virtual_x' in ray3:
            self.ax.plot(ray3['virtual_x'], ray3['virtual_y'],
                        'm--', linewidth=1.5, alpha=0.5)

    def _display_info(self, result):
        """显示成像信息"""
        info_text = f"【成像参数】\n"
        info_text += f"物距 u = {self.object_distance:.1f} cm\n"
        info_text += f"焦距 f = {abs(self.focal_length):.1f} cm\n"

        if result['image_type'] != 'none':
            info_text += f"像距 v = {result['image_distance']:.1f} cm\n"
            info_text += f"放大率 |m| = {abs(result['magnification']):.2f}\n"
            info_text += f"\n{result['description']}"
        else:
            info_text += f"\n{result['description']}"

        # 在左上角显示信息
        self.ax.text(0.02, 0.98, info_text,
                    transform=self.ax.transAxes,
                    fontsize=10,
                    verticalalignment='top',
                    bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))

    def show(self):
        """显示图形"""
        plt.show()


def main():
    """主函数"""
    # 设置中文字体
    plt.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
    plt.rcParams['axes.unicode_minus'] = False

    # 创建并显示可视化界面
    visualizer = LensVisualizer()
    visualizer.show()


if __name__ == '__main__':
    main()
