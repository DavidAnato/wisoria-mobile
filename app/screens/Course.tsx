import Course from "../components/course";

const CourseScreen = ({ route }: { route: any }) => {
  const { courseId, currentChapterId, currentChapterTitle, lessonId } = route.params;
  return (
    <Course   key={lessonId} courseId={courseId} currentChapterId={currentChapterId} currentChapterTitle={currentChapterTitle} lessonId={lessonId} />
  );
};

export default CourseScreen;