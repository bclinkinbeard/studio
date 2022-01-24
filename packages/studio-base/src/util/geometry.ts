// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { ReglClickInfo, Vec3 } from "@foxglove/regl-worldview";

export type Point = { x: number; y: number; z: number };

export type Quaternion = { x: number; y: number; z: number; w: number };

export type Vector3 = { x: number; y: number; z: number };

export function distanceBetweenPoints(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
}

export function eulerToQuaternion(rpy: Vector3): Quaternion {
  const roll = rpy.x;
  const pitch = rpy.y;
  const yaw = rpy.z;

  const cy = Math.cos(yaw * 0.5);
  const sy = Math.sin(yaw * 0.5);
  const cr = Math.cos(roll * 0.5);
  const sr = Math.sin(roll * 0.5);
  const cp = Math.cos(pitch * 0.5);
  const sp = Math.sin(pitch * 0.5);

  const w = cy * cr * cp + sy * sr * sp;
  const x = cy * sr * cp - sy * cr * sp;
  const y = cy * cr * sp + sy * sr * cp;
  const z = sy * cr * cp - cy * sr * sp;

  return { x, y, z, w };
}

export function makeCovarianceArray(x: number, y: number, theta: number): number[] {
  const covariance = Array(36).fill(0);
  covariance[6 * 0 + 0] = Math.pow(x, 2);
  covariance[6 * 1 + 1] = Math.pow(y, 2);
  covariance[6 * 5 + 5] = Math.pow(theta, 2);
  return covariance;
}

export function quaternionFromPoints(a: Point, b: Point): Quaternion {
  const theta = Math.atan2(b.y - a.y, b.x - a.x);
  return eulerToQuaternion({ x: 0, y: 0, z: theta });
}

export function reglClickToPoint(click: ReglClickInfo): Point | undefined {
  const intersection = click.ray.planeIntersection([0, 0, 0], [0, 0, 1]);
  return intersection ? vec3ToPoint(intersection) : undefined;
}

export function vec3ToPoint(v: Vec3): Point {
  return { x: v[0], y: v[1], z: v[2] };
}
