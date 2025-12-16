"""
透镜成像物理计算模块
实现凸透镜和凹透镜的成像公式计算
"""

import numpy as np


class LensPhysics:
    """透镜物理计算类"""

    def __init__(self, focal_length, lens_type='convex'):
        """
        初始化透镜参数

        Args:
            focal_length: 焦距 (cm), 凸透镜为正,凹透镜为负
            lens_type: 透镜类型 'convex'(凸透镜) 或 'concave'(凹透镜)
        """
        self.lens_type = lens_type
        if lens_type == 'convex':
            self.focal_length = abs(focal_length)
        else:  # concave
            self.focal_length = -abs(focal_length)

    def calculate_image(self, object_distance):
        """
        计算像距和放大率
        使用透镜成像公式: 1/f = 1/u + 1/v

        Args:
            object_distance: 物距 (cm), 总是为正值

        Returns:
            dict: {
                'image_distance': 像距 (cm),
                'magnification': 放大率,
                'image_type': 成像类型 ('real'实像, 'virtual'虚像),
                'image_orientation': 成像方向 ('inverted'倒立, 'upright'正立)
            }
        """
        u = object_distance
        f = self.focal_length

        # 透镜成像公式: 1/f = 1/u + 1/v
        # v = u*f / (u - f)
        if u == f:
            # 物体在焦点上,不成像
            return {
                'image_distance': float('inf'),
                'magnification': float('inf'),
                'image_type': 'none',
                'image_orientation': 'none',
                'description': '物体在焦点上,不成像'
            }

        v = (u * f) / (u - f)

        # 放大率 m = v/u (带符号)
        m = v / u

        # 判断成像类型
        if v > 0:
            image_type = 'real'  # 实像
            image_orientation = 'inverted'  # 倒立
        else:
            image_type = 'virtual'  # 虚像
            image_orientation = 'upright'  # 正立

        # 生成描述
        description = self._generate_description(u, v, m)

        return {
            'image_distance': v,
            'magnification': m,
            'image_type': image_type,
            'image_orientation': image_orientation,
            'description': description
        }

    def _generate_description(self, u, v, m):
        """生成成像情况的文字描述"""
        f = abs(self.focal_length)

        if self.lens_type == 'convex':
            if v > 0:  # 实像
                if u > 2 * f:
                    return f"物距 u > 2f: 倒立、缩小的实像 (u={u:.1f}cm, v={v:.1f}cm, |m|={abs(m):.2f})"
                elif u == 2 * f:
                    return f"物距 u = 2f: 倒立、等大的实像 (u={u:.1f}cm, v={v:.1f}cm, |m|={abs(m):.2f})"
                elif u > f:
                    return f"f < u < 2f: 倒立、放大的实像 (u={u:.1f}cm, v={v:.1f}cm, |m|={abs(m):.2f})"
            else:  # 虚像
                return f"物距 u < f: 正立、放大的虚像 (u={u:.1f}cm, v={v:.1f}cm, |m|={abs(m):.2f})"
        else:  # concave
            return f"凹透镜: 正立、缩小的虚像 (u={u:.1f}cm, v={v:.1f}cm, |m|={abs(m):.2f})"

    def get_ray_paths(self, object_distance, object_height):
        """
        计算三条特殊光线的路径

        Args:
            object_distance: 物距 (cm)
            object_height: 物体高度 (cm)

        Returns:
            dict: 包含三条光线的路径坐标
        """
        u = object_distance
        h_obj = object_height

        result = self.calculate_image(u)
        v = result['image_distance']

        if result['image_type'] == 'none':
            return None

        # 透镜位置在x=0
        lens_x = 0

        # 物体位置
        obj_x = -u

        # 像的位置和高度
        img_x = v
        h_img = h_obj * result['magnification']

        # 三条特殊光线:
        # 1. 平行于主光轴的光线,经过透镜后过焦点
        # 2. 经过光心的光线,方向不变
        # 3. 经过焦点(或其延长线)的光线,经过透镜后平行于主光轴

        rays = {
            'ray1': self._get_parallel_ray(obj_x, h_obj, img_x, h_img),
            'ray2': self._get_center_ray(obj_x, h_obj, img_x, h_img),
            'ray3': self._get_focal_ray(obj_x, h_obj, img_x, h_img)
        }

        return rays

    def _get_parallel_ray(self, obj_x, h_obj, img_x, h_img):
        """平行于主光轴的光线"""
        f = self.focal_length

        if self.lens_type == 'convex':
            # 从物体顶端出发,平行于主光轴到透镜,然后经过焦点
            if img_x > 0:  # 实像
                return {
                    'x': [obj_x, 0, img_x],
                    'y': [h_obj, h_obj, h_img]
                }
            else:  # 虚像,反向延长线过焦点
                # 折射光线向下
                extension_x = -2 * abs(f)
                extension_y = h_obj - (h_obj / f) * extension_x
                return {
                    'x': [obj_x, 0, extension_x],
                    'y': [h_obj, h_obj, extension_y],
                    'virtual_x': [0, img_x],
                    'virtual_y': [h_obj, h_img]
                }
        else:  # concave
            # 折射光线发散,反向延长线过焦点
            extension_x = 2 * abs(f)
            extension_y = h_obj + (h_obj / abs(f)) * extension_x
            return {
                'x': [obj_x, 0, extension_x],
                'y': [h_obj, h_obj, extension_y],
                'virtual_x': [0, img_x],
                'virtual_y': [h_obj, h_img]
            }

    def _get_center_ray(self, obj_x, h_obj, img_x, h_img):
        """经过光心的光线"""
        return {
            'x': [obj_x, 0, img_x],
            'y': [h_obj, 0, h_img]
        }

    def _get_focal_ray(self, obj_x, h_obj, img_x, h_img):
        """经过焦点的光线"""
        f = self.focal_length

        if self.lens_type == 'convex':
            if img_x > 0:  # 实像
                # 从物体顶端经过左焦点到透镜,然后平行于主光轴
                return {
                    'x': [obj_x, -f, 0, img_x],
                    'y': [h_obj, 0, h_img, h_img]
                }
            else:  # 虚像
                # 指向右焦点的光线,经透镜后平行于主光轴
                y_at_lens = h_obj + (h_obj / (f + obj_x)) * obj_x
                return {
                    'x': [obj_x, 0, img_x],
                    'y': [h_obj, y_at_lens, h_img],
                    'guide_x': [obj_x, f],
                    'guide_y': [h_obj, 0]
                }
        else:  # concave
            # 指向右焦点,经透镜后平行于主光轴向上
            y_at_lens = h_obj * abs(f) / (abs(f) + abs(obj_x))
            extension_x = 2 * abs(f)
            return {
                'x': [obj_x, 0, extension_x],
                'y': [h_obj, y_at_lens, y_at_lens],
                'guide_x': [obj_x, f],
                'guide_y': [h_obj, 0],
                'virtual_x': [0, img_x],
                'virtual_y': [y_at_lens, h_img]
            }
