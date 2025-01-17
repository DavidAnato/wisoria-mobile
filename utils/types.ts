export interface User {
  username?: string; // title: Username, maxLength: 150, x-nullable: true
  email: string; // title: Email, $email, maxLength: 254, minLength: 1
  password: string; // title: Password, maxLength: 128, minLength: 1
  first_name?: string; // title: First name, maxLength: 30
  last_name?: string; // title: Last name, maxLength: 150
  is_active: boolean; // title: Is active
  is_staff: boolean; // title: Is staff
  is_superuser: boolean; // title: Statut super-utilisateur, User has all permissions without explicitly assigning them
  last_login?: string; // title: Dernière connexion, $date-time, x-nullable: true
  last_login_ip?: string; // title: Last login ip, minLength: 1, x-nullable: true
  date_of_birth?: string; // title: Date of birth, $date, x-nullable: true
  bio?: string; // title: Bio, x-nullable: true
  role?: string; // title: Role, Enum
  learning_preferences?: string; // title: Learning preferences, x-nullable: true
  points?: number; // title: Points, integer, maximum: 9223372036854776000, minimum: -9223372036854776000
  social_links?: string; // title: Social links, x-nullable: true
  phone_number?: string; // title: Phone number, maxLength: 15, x-nullable: true
  preferred_language?: string; // title: Preferred language, Enum
  certification_count?: number; // title: Certification count, integer, maximum: 9223372036854776000, minimum: -9223372036854776000
  total_courses_completed?: number; // title: Total courses completed, integer, maximum: 9223372036854776000, minimum: -9223372036854776000
  google_id?: string; // title: Google ID, maxLength: 255, x-nullable: true
  picture_url?: string; // title: Picture URL, $uri, maxLength: 200, x-nullable: true
  verified_email: boolean; // title: Verified Email
  is_verified: boolean; // title: Is verified
  otp_code?: string; // title: OTP Code, maxLength: 5, x-nullable: true
  otp_generated_at?: string; // title: OTP Generated At, $date-time, x-nullable: true
  groups?: number[]; // Unique items, title: Groupes, Groups the user belongs to
  user_permissions?: number[]; // Unique items, title: Permissions de l’utilisateur, User-specific permissions
}

export interface Course {
  id: number; // title: ID, readOnly: true
  category: {
    id: number[]; // title: ID
    name: string; // title: Name
    description: string; // title: Description
  };
  title: string; // title: Title, maxLength: 200, minLength: 1
  description: string; // title: Description, minLength: 1
  image?: string; // title: Image, $uri, readOnly: true, x-nullable: true
  duration: number; // title: Duration, maximum: 9223372036854776000, minimum: 0
  level?: string; // title: Level, Enum: Array [ 3 ]
  pathways?: number[]; // uniqueItems: true
  chapters_ids: number[]; // uniqueItems: true
  chapters_completed: number[]; // uniqueItems: true
}

export interface Chapter {
  id: number; // title: ID, readOnly: true
  title: string; // title: Title, maxLength: 200, minLength: 1
  order: number; // title: Order, maximum: 9223372036854776000, minimum: 0
  is_last: boolean; // title: Is last
  course: number; // title: Course
  lessons: {
    id: number;
    completed: boolean;
  }[];
  quiz: number;
}

export interface Lesson {
  id: number; // title: ID, readOnly: true
  title: string; // title: Title, maxLength: 200, minLength: 1
  content: string; // title: Content, minLength: 1
  video_id?: string; // title: Video id, maxLength: 200, x-nullable: true
  order: number; // title: Order, maximum: 9223372036854776000, minimum: 0
  chapter: number; // title: Chapter
  completed: boolean; // title: Completed
}

export interface Pathway {
  id: number; // title: ID, readOnly: true
  category: {
    id: number[]; // title: ID
    name: string; // title: Name
    description: string; // title: Description
  };
  title: string; // title: Title, maxLength: 200, minLength: 1
  short_description: string; // title: Short description, maxLength: 200, minLength: 1
  description: string; // title: Description, minLength: 1
  duration: number; // title: Duration, maximum: 9223372036854776000, minimum: 0
  level?: string; // title: Level, Enum: Array [ 3 ]
  image: string; // title: Image, $uri, readOnly: true, x-nullable: true
  created_at?: string; // title: Created at, $date-time, readOnly: true
  updated_at?: string; // title: Updated at, $date-time, readOnly: true
}
