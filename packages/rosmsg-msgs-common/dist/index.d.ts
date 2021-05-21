// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { RosMsgDefinition } from "@foxglove/rosmsg";

declare module "@foxglove/rosmsg-msgs-common" {
  type RosMsgCommonDefinitions = {
    "actionlib_msgs/GoalID": RosMsgDefinition;
    "actionlib_msgs/GoalStatus": RosMsgDefinition;
    "actionlib_msgs/GoalStatusArray": RosMsgDefinition;
    "diagnostic_msgs/DiagnosticArray": RosMsgDefinition;
    "diagnostic_msgs/DiagnosticStatus": RosMsgDefinition;
    "diagnostic_msgs/KeyValue": RosMsgDefinition;
    "geometry_msgs/Accel": RosMsgDefinition;
    "geometry_msgs/AccelStamped": RosMsgDefinition;
    "geometry_msgs/AccelWithCovariance": RosMsgDefinition;
    "geometry_msgs/AccelWithCovarianceStamped": RosMsgDefinition;
    "geometry_msgs/Inertia": RosMsgDefinition;
    "geometry_msgs/InertiaStamped": RosMsgDefinition;
    "geometry_msgs/Point": RosMsgDefinition;
    "geometry_msgs/Point32": RosMsgDefinition;
    "geometry_msgs/PointStamped": RosMsgDefinition;
    "geometry_msgs/Polygon": RosMsgDefinition;
    "geometry_msgs/PolygonStamped": RosMsgDefinition;
    "geometry_msgs/Pose": RosMsgDefinition;
    "geometry_msgs/PoseArray": RosMsgDefinition;
    "geometry_msgs/PoseStamped": RosMsgDefinition;
    "geometry_msgs/PoseWithCovariance": RosMsgDefinition;
    "geometry_msgs/PoseWithCovarianceStamped": RosMsgDefinition;
    "geometry_msgs/Quaternion": RosMsgDefinition;
    "geometry_msgs/QuaternionStamped": RosMsgDefinition;
    "geometry_msgs/Transform": RosMsgDefinition;
    "geometry_msgs/TransformStamped": RosMsgDefinition;
    "geometry_msgs/Twist": RosMsgDefinition;
    "geometry_msgs/TwistStamped": RosMsgDefinition;
    "geometry_msgs/TwistWithCovariance": RosMsgDefinition;
    "geometry_msgs/TwistWithCovarianceStamped": RosMsgDefinition;
    "geometry_msgs/Vector3": RosMsgDefinition;
    "geometry_msgs/Vector3Stamped": RosMsgDefinition;
    "geometry_msgs/Wrench": RosMsgDefinition;
    "geometry_msgs/WrenchStamped": RosMsgDefinition;
    "nav_msgs/MapMetaData": RosMsgDefinition;
    "nav_msgs/OccupancyGrid": RosMsgDefinition;
    "nav_msgs/Odometry": RosMsgDefinition;
    "nav_msgs/Path": RosMsgDefinition;
    "rosgraph_msgs/Clock": RosMsgDefinition;
    "rosgraph_msgs/Log": RosMsgDefinition;
    "rosgraph_msgs/TopicStatistics": RosMsgDefinition;
    "sensor_msgs/BatteryState": RosMsgDefinition;
    "sensor_msgs/CameraInfo": RosMsgDefinition;
    "sensor_msgs/CompressedImage": RosMsgDefinition;
    "sensor_msgs/FluidPressure": RosMsgDefinition;
    "sensor_msgs/Illuminance": RosMsgDefinition;
    "sensor_msgs/Image": RosMsgDefinition;
    "sensor_msgs/Imu": RosMsgDefinition;
    "sensor_msgs/JointState": RosMsgDefinition;
    "sensor_msgs/Joy": RosMsgDefinition;
    "sensor_msgs/JoyFeedback": RosMsgDefinition;
    "sensor_msgs/JoyFeedbackArray": RosMsgDefinition;
    "sensor_msgs/LaserEcho": RosMsgDefinition;
    "sensor_msgs/LaserScan": RosMsgDefinition;
    "sensor_msgs/MagneticField": RosMsgDefinition;
    "sensor_msgs/MultiDOFJointState": RosMsgDefinition;
    "sensor_msgs/MultiEchoLaserScan": RosMsgDefinition;
    "sensor_msgs/NavSatFix": RosMsgDefinition;
    "sensor_msgs/NavSatStatus": RosMsgDefinition;
    "sensor_msgs/PointCloud2": RosMsgDefinition;
    "sensor_msgs/PointField": RosMsgDefinition;
    "sensor_msgs/Range": RosMsgDefinition;
    "sensor_msgs/RegionOfInterest": RosMsgDefinition;
    "sensor_msgs/RelativeHumidity": RosMsgDefinition;
    "sensor_msgs/Temperature": RosMsgDefinition;
    "sensor_msgs/TimeReference": RosMsgDefinition;
    "shape_msgs/Mesh": RosMsgDefinition;
    "shape_msgs/MeshTriangle": RosMsgDefinition;
    "shape_msgs/Plane": RosMsgDefinition;
    "shape_msgs/SolidPrimitive": RosMsgDefinition;
    "std_msgs/Bool": RosMsgDefinition;
    "std_msgs/Byte": RosMsgDefinition;
    "std_msgs/ByteMultiArray": RosMsgDefinition;
    "std_msgs/Char": RosMsgDefinition;
    "std_msgs/ColorRGBA": RosMsgDefinition;
    "std_msgs/Duration": RosMsgDefinition;
    "std_msgs/Empty": RosMsgDefinition;
    "std_msgs/Float32": RosMsgDefinition;
    "std_msgs/Float32MultiArray": RosMsgDefinition;
    "std_msgs/Float64": RosMsgDefinition;
    "std_msgs/Float64MultiArray": RosMsgDefinition;
    "std_msgs/Header": RosMsgDefinition;
    "std_msgs/Int16": RosMsgDefinition;
    "std_msgs/Int16MultiArray": RosMsgDefinition;
    "std_msgs/Int32": RosMsgDefinition;
    "std_msgs/Int32MultiArray": RosMsgDefinition;
    "std_msgs/Int64": RosMsgDefinition;
    "std_msgs/Int64MultiArray": RosMsgDefinition;
    "std_msgs/Int8": RosMsgDefinition;
    "std_msgs/Int8MultiArray": RosMsgDefinition;
    "std_msgs/MultiArrayDimension": RosMsgDefinition;
    "std_msgs/MultiArrayLayout": RosMsgDefinition;
    "std_msgs/String": RosMsgDefinition;
    "std_msgs/Time": RosMsgDefinition;
    "std_msgs/UInt16": RosMsgDefinition;
    "std_msgs/UInt16MultiArray": RosMsgDefinition;
    "std_msgs/UInt32": RosMsgDefinition;
    "std_msgs/UInt32MultiArray": RosMsgDefinition;
    "std_msgs/UInt64": RosMsgDefinition;
    "std_msgs/UInt64MultiArray": RosMsgDefinition;
    "std_msgs/UInt8": RosMsgDefinition;
    "stereo_msgs/DisparityImage": RosMsgDefinition;
    "tf2_msgs/TFMessage": RosMsgDefinition;
    "trajectory_msgs/JointTrajectory": RosMsgDefinition;
    "trajectory_msgs/JointTrajectoryPoint": RosMsgDefinition;
    "trajectory_msgs/MultiDOFJointTrajectory": RosMsgDefinition;
    "trajectory_msgs/MultiDOFJointTrajectoryPoint": RosMsgDefinition;
    "visualization_msgs/ImageMarker": RosMsgDefinition;
    "visualization_msgs/ImageMarkerArray": RosMsgDefinition;
    "visualization_msgs/InteractiveMarker": RosMsgDefinition;
    "visualization_msgs/InteractiveMarkerControl": RosMsgDefinition;
    "visualization_msgs/Marker": RosMsgDefinition;
    "visualization_msgs/MarkerArray": RosMsgDefinition;
    "visualization_msgs/MenuEntry": RosMsgDefinition;
  };

  const definitions: RosMsgCommonDefinitions;
  export { definitions };
}