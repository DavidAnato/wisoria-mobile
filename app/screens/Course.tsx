import Course from "../components/course";

const CourseScreen = ({ route }: { route: any }) => {
  const { courseId, currentChapterId } = route.params;
  return (
    <Course courseId={courseId} currentChapterId={currentChapterId} />
  );
};

export default CourseScreen;