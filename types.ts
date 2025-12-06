export interface UserProfile {
  subjects: string[];
  hobbies: string[];
  skills: string[];
  additionalInfo: string;
}

export interface CareerRoadmapStep {
  stage: string;
  action: string;
}

export interface CareerRecommendation {
  title: string;
  description: string;
  matchReason: string;
  requiredSkills: string[];
  educationPath: string;
  averageSalary: string; // New: Estimated salary in Cambodia
  topUniversities: string[]; // New: Recommended local universities
  roadmap: CareerRoadmapStep[]; // New: Step-by-step guide
}

export interface RecommendationResponse {
  recommendations: CareerRecommendation[];
  advice: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const SUBJECT_OPTIONS = [
  "គណិតវិទ្យា (Math)",
  "រូបវិទ្យា (Physics)",
  "គីមីវិទ្យា (Chemistry)",
  "ជីវវិទ្យា (Biology)",
  "អក្សរសាស្ត្រខ្មែរ (Khmer Lit)",
  "ភាសាអង់គ្លេស (English)",
  "ប្រវត្តិវិទ្យា (History)",
  "ព័ត៌មានវិទ្យា (IT)",
  "សិល្បៈ (Arts)",
  "សេដ្ឋកិច្ច (Economics)"
];

export const HOBBY_OPTIONS = [
  "អានសៀវភៅ (Reading)",
  "ដោះស្រាយបញ្ហា (Solving Problems)",
  "គូររូប/ឌីហ្សាញ (Drawing/Design)",
  "លេងកីឡា (Sports)",
  "ជួយអ្នកដទៃ (Helping People)",
  "ស្រាវជ្រាវ (Researching)",
  "និយាយជាសាធារណៈ (Public Speaking)",
  "សរសេរកូដ (Coding)",
  "ធ្វើម្ហូប (Cooking)",
  "ថតរូប/វីដេអូ (Content Creation)"
];

export const SKILL_OPTIONS = [
  "ភាពជាអ្នកដឹកនាំ (Leadership)",
  "ការទំនាក់ទំនង (Communication)",
  "ការគិតស៊ីជម្រៅ (Critical Thinking)",
  "ភាពច្នៃប្រឌិត (Creativity)",
  "ធ្វើការជាក្រុម (Teamwork)",
  "ការគ្រប់គ្រងពេលវេលា (Time Management)",
  "ការបត់បែន (Adaptability)",
  "ការវិភាគទិន្នន័យ (Data Analysis)"
];