"""
演示场景
展示透镜在实际应用中的典型案例
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from lens_physics import LensPhysics


def print_separator(title):
    """打印分隔符"""
    print("\n" + "=" * 70)
    print(f"  {title}".center(70))
    print("=" * 70)


def demo_camera():
    """照相机原理演示"""
    print_separator("📷 场景1: 照相机成像原理")

    print("\n照相机使用凸透镜,物体在 2f 之外,成倒立、缩小的实像")
    print("镜头焦距通常较短(几厘米),拍摄远处物体\n")

    lens = LensPhysics(focal_length=5, lens_type='convex')

    # 模拟拍摄不同距离的物体
    scenarios = [
        ("拍摄远处风景", 500),
        ("拍摄中距离人物", 200),
        ("拍摄近处物体", 30)
    ]

    for desc, distance in scenarios:
        result = lens.calculate_image(distance)
        print(f"【{desc}】")
        print(f"  物距: {distance} cm")
        print(f"  像距: {result['image_distance']:.2f} cm (胶片/传感器位置)")
        print(f"  缩小倍数: {1/abs(result['magnification']):.1f}x")
        print()


def demo_projector():
    """投影仪原理演示"""
    print_separator("📽️ 场景2: 投影仪成像原理")

    print("\n投影仪使用凸透镜,幻灯片在 f 和 2f 之间,成倒立、放大的实像")
    print("需要将幻灯片倒着放,在屏幕上成正常的像\n")

    lens = LensPhysics(focal_length=20, lens_type='convex')

    # 幻灯片尺寸 3cm,放在 30cm 处
    u = 30
    h = 3

    result = lens.calculate_image(u)
    v = result['image_distance']
    m = abs(result['magnification'])

    print(f"【投影仪设置】")
    print(f"  透镜焦距: 20 cm")
    print(f"  幻灯片尺寸: {h} cm")
    print(f"  幻灯片位置: {u} cm (在 f 和 2f 之间)")
    print(f"\n【投影结果】")
    print(f"  屏幕距离: {v:.1f} cm")
    print(f"  屏幕上像的尺寸: {h * m:.1f} cm")
    print(f"  放大倍数: {m:.1f}x")
    print(f"  成像特点: 倒立、放大的实像")


def demo_magnifier():
    """放大镜原理演示"""
    print_separator("🔍 场景3: 放大镜使用原理")

    print("\n放大镜使用凸透镜,物体在焦点以内,成正立、放大的虚像")
    print("适合观察小字、昆虫等细节\n")

    lens = LensPhysics(focal_length=8, lens_type='convex')

    # 观察不同距离的效果
    scenarios = [
        ("近距离观察", 2, "最大放大,但可能模糊"),
        ("适中距离", 4, "较大放大,清晰"),
        ("稍远距离", 6, "适度放大,最清晰"),
    ]

    for desc, distance, comment in scenarios:
        result = lens.calculate_image(distance)
        print(f"【{desc}】")
        print(f"  物距: {distance} cm")
        print(f"  虚像位置: {abs(result['image_distance']):.1f} cm (人眼同侧)")
        print(f"  放大倍数: {abs(result['magnification']):.1f}x")
        print(f"  效果: {comment}")
        print()


def demo_eyeglasses():
    """眼镜原理演示"""
    print_separator("👓 场景4: 近视眼镜原理")

    print("\n近视眼镜使用凹透镜,将远处物体成像在更近的位置")
    print("使近视眼能够看清远处的物体\n")

    # 不同度数的眼镜
    degrees = [
        (100, "轻度近视"),
        (300, "中度近视"),
        (600, "高度近视")
    ]

    for degree, desc in degrees:
        # 眼镜度数 = 100/焦距(米)
        focal_length_m = 1.0 / (degree / 100)
        focal_length_cm = focal_length_m * 100

        lens = LensPhysics(focal_length=focal_length_cm, lens_type='concave')

        # 观察远处物体 (500cm)
        u = 500
        result = lens.calculate_image(u)
        v = abs(result['image_distance'])

        print(f"【{desc}: {degree}度】")
        print(f"  镜片焦距: {focal_length_cm:.1f} cm")
        print(f"  远处物体: {u} cm")
        print(f"  虚像位置: {v:.1f} cm (更近,近视眼能看清)")
        print(f"  缩小倍数: {1/abs(result['magnification']):.1f}x")
        print()


def demo_telescope():
    """望远镜原理演示(简化)"""
    print_separator("🔭 场景5: 望远镜原理 (简化模型)")

    print("\n望远镜使用两个凸透镜组合:")
    print("物镜(焦距长) + 目镜(焦距短)")
    print("这里演示物镜部分的成像\n")

    # 物镜
    objective = LensPhysics(focal_length=50, lens_type='convex')

    # 观察远处物体
    u = 5000  # 50米外
    h = 100   # 1米高的物体

    result = objective.calculate_image(u)
    v = result['image_distance']
    h_image = h * abs(result['magnification'])

    print(f"【物镜成像】")
    print(f"  物镜焦距: 50 cm")
    print(f"  观察距离: {u/100} m")
    print(f"  物体高度: {h} cm")
    print(f"\n【物镜形成的实像】")
    print(f"  像距: {v:.2f} cm (约等于焦距)")
    print(f"  像高: {h_image:.2f} cm")
    print(f"  缩小倍数: {1/abs(result['magnification']):.0f}x")
    print(f"\n  说明: 这个实像会被目镜(放大镜)再次放大")


def demo_solar_concentrator():
    """太阳能聚光器演示"""
    print_separator("☀️ 场景6: 太阳能聚光器")

    print("\n太阳光(平行光)通过凸透镜会聚于焦点")
    print("焦点处光能集中,温度极高,可点燃物体\n")

    lens = LensPhysics(focal_length=15, lens_type='convex')

    # 太阳光来自无穷远,u → ∞
    u = 10000  # 模拟无穷远

    result = lens.calculate_image(u)
    v = result['image_distance']

    print(f"【聚光镜设置】")
    print(f"  透镜直径: 假设 20 cm")
    print(f"  透镜焦距: 15 cm")
    print(f"  太阳光: 平行光 (来自无穷远)")
    print(f"\n【聚焦结果】")
    print(f"  聚焦位置: {v:.1f} cm ≈ 焦距")
    print(f"  焦点处能量密度: 极高")
    print(f"  应用: 太阳灶、太阳能发电")
    print(f"\n  ⚠️  警告: 切勿用眼睛直视焦点!")


def main():
    """主函数"""
    print("\n" + "╔" + "═" * 68 + "╗")
    print("║" + "透镜成像实际应用场景演示".center(66) + "║")
    print("╚" + "═" * 68 + "╝")

    demo_camera()
    demo_projector()
    demo_magnifier()
    demo_eyeglasses()
    demo_telescope()
    demo_solar_concentrator()

    print("\n" + "=" * 70)
    print("  提示".center(70))
    print("=" * 70)
    print("\n运行交互式模拟器查看这些场景的光路图:")
    print("  python lens_simulator.py")
    print("\n根据上述参数设置,观察成像过程")
    print("=" * 70 + "\n")


if __name__ == '__main__':
    main()
