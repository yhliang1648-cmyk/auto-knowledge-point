"""
基础使用示例
演示如何使用透镜物理计算模块
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from lens_physics import LensPhysics


def example_convex_lens():
    """凸透镜示例"""
    print("=" * 60)
    print("凸透镜成像示例".center(50))
    print("=" * 60)

    # 创建凸透镜对象,焦距为10cm
    lens = LensPhysics(focal_length=10, lens_type='convex')

    # 测试不同物距的成像情况
    test_distances = [30, 20, 15, 10, 5]

    for u in test_distances:
        print(f"\n【物距 u = {u} cm】")
        result = lens.calculate_image(u)

        if result['image_type'] != 'none':
            print(f"  像距: v = {result['image_distance']:.2f} cm")
            print(f"  放大率: |m| = {abs(result['magnification']):.2f}")
            print(f"  成像类型: {result['image_type']} ({'实像' if result['image_type'] == 'real' else '虚像'})")
            print(f"  成像方向: {result['image_orientation']} ({'倒立' if result['image_orientation'] == 'inverted' else '正立'})")
        else:
            print(f"  {result['description']}")


def example_concave_lens():
    """凹透镜示例"""
    print("\n" + "=" * 60)
    print("凹透镜成像示例".center(50))
    print("=" * 60)

    # 创建凹透镜对象,焦距为10cm
    lens = LensPhysics(focal_length=10, lens_type='concave')

    # 测试不同物距的成像情况
    test_distances = [30, 20, 15, 10, 5]

    for u in test_distances:
        print(f"\n【物距 u = {u} cm】")
        result = lens.calculate_image(u)

        print(f"  像距: v = {result['image_distance']:.2f} cm")
        print(f"  放大率: |m| = {abs(result['magnification']):.2f}")
        print(f"  成像类型: {result['image_type']} (虚像)")
        print(f"  成像方向: {result['image_orientation']} (正立)")


def example_lens_formula():
    """透镜公式验证"""
    print("\n" + "=" * 60)
    print("透镜成像公式验证".center(50))
    print("=" * 60)

    lens = LensPhysics(focal_length=10, lens_type='convex')
    u = 20  # 物距

    result = lens.calculate_image(u)
    v = result['image_distance']
    f = lens.focal_length

    print(f"\n已知:")
    print(f"  焦距 f = {f} cm")
    print(f"  物距 u = {u} cm")
    print(f"\n计算结果:")
    print(f"  像距 v = {v:.2f} cm")
    print(f"\n验证公式 1/f = 1/u + 1/v:")
    print(f"  1/f = 1/{f} = {1/f:.4f}")
    print(f"  1/u + 1/v = 1/{u} + 1/{v:.2f} = {1/u + 1/v:.4f}")
    print(f"  差值: {abs(1/f - (1/u + 1/v)):.6f} (应接近0)")


if __name__ == '__main__':
    example_convex_lens()
    example_concave_lens()
    example_lens_formula()

    print("\n" + "=" * 60)
    print("提示: 运行 'python lens_simulator.py' 查看交互式可视化界面")
    print("=" * 60)
