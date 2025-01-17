import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  PathwayDetail: { pathwayId: number };
  CourseDetail: { courseId: number };
};

export type PathwayDetailNavigationProp = StackNavigationProp<RootStackParamList, 'PathwayDetail'>;
export type CourseDetailNavigationProp = RouteProp<RootStackParamList, 'CourseDetail'>;

export default RootStackParamList;
