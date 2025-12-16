"""
物理计算模块测试
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from lens_physics import LensPhysics


def test_convex_lens():
    """测试凸透镜计算"""
    print("测试凸透镜计算...")
    lens = LensPhysics(focal_length=10, lens_type='convex')

    # 测试1: u > 2f
    result = lens.calculate_image(30)
    assert result['image_type'] == 'real', "u > 2f 应该成实像"
    assert result['image_distance'] > 0, "实像的像距应该为正"
    assert abs(result['magnification']) < 1, "u > 2f 应该缩小"
    print("  ✓ 测试 u > 2f 通过")

    # 测试2: u = 2f
    result = lens.calculate_image(20)
    assert result['image_type'] == 'real', "u = 2f 应该成实像"
    assert abs(result['image_distance'] - 20) < 0.1, "u = 2f 时 v = 2f"
    assert abs(abs(result['magnification']) - 1) < 0.1, "u = 2f 应该等大"
    print("  ✓ 测试 u = 2f 通过")

    # 测试3: f < u < 2f
    result = lens.calculate_image(15)
    assert result['image_type'] == 'real', "f < u < 2f 应该成实像"
    assert abs(result['magnification']) > 1, "f < u < 2f 应该放大"
    print("  ✓ 测试 f < u < 2f 通过")

    # 测试4: u < f
    result = lens.calculate_image(5)
    assert result['image_type'] == 'virtual', "u < f 应该成虚像"
    assert result['image_distance'] < 0, "虚像的像距应该为负"
    assert result['image_orientation'] == 'upright', "虚像应该正立"
    print("  ✓ 测试 u < f 通过")

    # 测试5: u = f
    result = lens.calculate_image(10)
    assert result['image_type'] == 'none', "u = f 不成像"
    print("  ✓ 测试 u = f 通过")


def test_concave_lens():
    """测试凹透镜计算"""
    print("\n测试凹透镜计算...")
    lens = LensPhysics(focal_length=10, lens_type='concave')

    # 凹透镜总是成虚像
    test_distances = [5, 10, 20, 30]

    for u in test_distances:
        result = lens.calculate_image(u)
        assert result['image_type'] == 'virtual', f"凹透镜在 u={u} 应成虚像"
        assert result['image_distance'] < 0, f"虚像的像距应为负 (u={u})"
        assert result['image_orientation'] == 'upright', f"虚像应正立 (u={u})"
        assert abs(result['magnification']) < 1, f"凹透镜应缩小 (u={u})"

    print("  ✓ 所有凹透镜测试通过")


def test_lens_formula():
    """测试透镜公式精度"""
    print("\n测试透镜公式精度...")
    lens = LensPhysics(focal_length=10, lens_type='convex')

    test_cases = [
        (20, 20),    # u = 2f, v = 2f
        (30, 15),    # u = 3f, v = 1.5f
        (15, 30),    # u = 1.5f, v = 3f
    ]

    for u, expected_v in test_cases:
        result = lens.calculate_image(u)
        v = result['image_distance']
        error = abs(v - expected_v)
        assert error < 0.1, f"u={u}, 期望v={expected_v}, 实际v={v:.2f}"

    print("  ✓ 透镜公式精度测试通过")


def test_ray_paths():
    """测试光线路径生成"""
    print("\n测试光线路径生成...")
    lens = LensPhysics(focal_length=10, lens_type='convex')

    rays = lens.get_ray_paths(object_distance=20, object_height=3)
    assert rays is not None, "应该生成光线路径"
    assert 'ray1' in rays, "应包含光线1"
    assert 'ray2' in rays, "应包含光线2"
    assert 'ray3' in rays, "应包含光线3"

    print("  ✓ 光线路径生成测试通过")


if __name__ == '__main__':
    print("=" * 60)
    print("透镜物理计算模块测试".center(50))
    print("=" * 60)

    try:
        test_convex_lens()
        test_concave_lens()
        test_lens_formula()
        test_ray_paths()

        print("\n" + "=" * 60)
        print("✓ 所有测试通过!".center(50))
        print("=" * 60)
    except AssertionError as e:
        print(f"\n✗ 测试失败: {e}")
        sys.exit(1)
