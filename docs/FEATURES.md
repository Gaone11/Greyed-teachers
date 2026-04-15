# GreyEd Teachers Platform — Feature Documentation

> A comprehensive AI-powered teaching platform for South African educators, aligned to the CAPS curriculum.

---

## Table of Contents

1. [Dashboard](#1-dashboard)
2. [Class Management](#2-class-management)
3. [Lesson Planner](#3-lesson-planner)
4. [AI Lesson Plan Generator](#4-ai-lesson-plan-generator)
5. [Assessments](#5-assessments)
6. [AI Auto-Grading](#6-ai-auto-grading)
7. [Tutor & Family Updates](#7-tutor--family-updates)
8. [Knowledge Galaxy](#8-knowledge-galaxy)
9. [Siyafunda AI Assistant](#9-siyafunda-ai-assistant)
10. [GreyEd Teaching Assistant (Avatar)](#10-greyed-teaching-assistant-avatar)
11. [Knowledge Galaxy Progress (Courses)](#11-knowledge-galaxy-progress-courses)
12. [Settings](#12-settings)
13. [Accessibility & UI](#13-accessibility--ui)

---

## 1. Dashboard

The main landing page after login, giving teachers an at-a-glance overview of their teaching activity.

**Features:**
- Summary stat tiles: total classes, total students, lesson plans created, assessments created
- Recent class cards showing subject, grade, and student count
- Quick-action buttons to navigate to key tools
- Collapsible sidebar navigation (persists across sessions)
- Mobile-responsive layout with bottom navigation bar

---

## 2. Class Management

Full lifecycle management for teacher classes.

### Class List (`/teachers/classes`)
- View all created classes in a card grid
- Search classes by name or subject
- Filter by subject
- Student count badge per class
- Quick access to class details

### Creating a Class
- Class name
- Subject (dropdown: Mathematics, Physics, Chemistry, Biology, General Science, Environmental Science, Agriculture, Computer Studies, Statistics)
- Grade (Grade R – Grade 12)
- Class description and syllabus
- Saves and immediately appears in the class list

### Class Detail Page (`/teachers/classes/:id`)
Six tabs per class:

| Tab | What it shows |
|---|---|
| **Documents** | Upload and manage teaching resources and classroom files |
| **Lesson Plans** | All lesson plans for this class; link to generate new ones |
| **Assessments** | All assessments for this class; link to create new ones |
| **Analytics** | Average grade, engagement rate, homework completion, knowledge mastery, AI teaching insights |
| **Notes** | Free-text class notes, create and edit |
| **Settings** | Edit class info (name, subject, grade, description, syllabus); delete class |

---

## 3. Lesson Planner

A central store for all generated lesson plans.

**Features:**
- View all lesson plans across all classes
- Search by title, class, or topic
- Filter by status: **Draft**, **Ready to Teach**, **Taught**
- Status badges on each plan card
- Metadata display: date, duration, class name
- Download lesson plan as a **Word document (.docx)**
- Delete lesson plans
- Navigate directly to a plan's detail view

---

## 4. AI Lesson Plan Generator

Generates fully structured CAPS-aligned lesson plans using AI.

### Input Fields
- **Class** — select from created classes (auto-fills grade)
- **Subject** — linked to selected class
- **Topic** — dropdown populated from the CAPS curriculum for that subject and grade
- **Term** — select Term 1, 2, 3, or 4 (auto-detects current term by default)
- **Week** — auto-guesses current week; editable
- **Date** — date of lesson
- **Duration** — lesson length in minutes
- **Focus areas** — optional free-text for specific emphasis

### Generation Options (checkboxes)
- Include assessment activities
- Include differentiation strategies
- Include required resources list

### Output
- Full lesson plan rendered in a **multi-page document viewer** with page navigation
- Includes: objectives, introduction, main activity, assessment, resources, teacher notes
- CAPS curriculum aligned content
- Knowledge base context injected from uploaded documents
- Download as **Word document (.docx)**

---

## 5. Assessments

### Assessment Generator
Create CAPS-aligned assessments tailored to a class and topic.

**Input Fields:**
- Class and subject (auto-linked)
- Topic (from CAPS curriculum)
- Assessment type: Quiz, Test, Exam, or Homework
- Difficulty level: Easy, Medium, Hard, or Mixed
- Number of questions (5–30)
- Options: include answer key, include grading rubric

**Output:**
- Full assessment document with numbered questions
- Optional answer key section
- Optional grading rubric
- Downloadable as **Word document (.docx)**

### Assessment Management (`/teachers/assessments`)
- View all assessments across classes
- Search by title, class, or topic
- Filter by status: **Draft**, **Published**, **Completed**
- Submission rate indicator
- Question count display
- View, edit, download, or delete assessments

---

## 6. AI Auto-Grading

Upload student submissions and let AI grade and provide feedback.

### Supported Upload Formats
- Scanned documents
- Photos of handwritten or printed work
- PDF documents
- Word documents (.docx)
- Drag-and-drop or click-to-upload interface

### What the AI Does
- Reads student responses against the answer key
- Assigns marks per question
- Generates personalised written feedback per student
- Identifies strengths and areas for improvement

### Output — Student Insights Panel
- Average grade across submissions
- Completion rate
- Top challenges identified from across the class
- Per-student results with score, grade, and feedback
- Teaching recommendations based on class performance
- Individual student performance profiles

---

## 7. Tutor & Family Updates

Tools for communicating student progress to parents and guardians.

### Bulk Class Updates (`/teachers/tutors`)
Generate a formatted update for an entire class at once.

**Input:**
- Select class
- Select week range
- Options: include progress report, upcoming content, homework reminders, resource links
- Optional custom note from the teacher

**Output:**
- AI-generated HTML-formatted family update
- Preview before sending
- Send via email or direct contact

**Update Management:**
- View all updates (Draft / Sent)
- Search and filter by class
- Open rate tracking
- Edit drafts before sending
- Delete updates

### Individual Student Updates
From within a class, select individual students:
- View student profile (name, grade, parent contact details)
- Create personalised update for that student
- Send via **email** or **WhatsApp**
- Track update history per student
- Record of last update date, method, and content

---

## 8. Knowledge Galaxy

An interactive, multi-layer knowledge universe for teacher professional learning and classroom content reference.

### Navigation Structure
```
Subject → Domain → Flagship Topic → Micro-Topic
```

**9 Subjects:**
Mathematics · Physics · Chemistry · Biology · General Science · Environmental Science · Agriculture · Computer Studies · Statistics

Each subject has multiple **Domains**, each domain has **Flagship Topics**, and each flagship topic has **Micro-Topics** (subtopics).

---

### Overview Tab (per Topic)

#### Explanation Levels
Four difficulty levels for the same topic — switch between them with one click:

| Level | Audience |
|---|---|
| 🌱 Explorer | Ages 7–10 |
| 🔬 Investigator | Ages 11–14 |
| 🧠 Scholar | High School |
| 🚀 Researcher | University |

#### Subtopic Notes
- Select a micro-topic (subtopic) from a chip grid or dropdown
- The explanation area updates to show **fully-fledged study notes** for that specific subtopic at the chosen level
- Notes include: headings, bullet points, formula blocks (amber-highlighted), bold key terms, practice questions, and key facts from tagged flashcards
- For topics with hand-written notes (e.g. Capacitors in Physics), those display in full; all other topics auto-generate rich notes from their tagged flashcard and quiz data

#### Visual Diagrams Gallery
Every topic has a **Visual Diagrams** section showing inline SVG diagrams relevant to that topic. Examples:

| Subject | Diagrams included |
|---|---|
| Physics | Parallel plate capacitor, RC circuit, charging curve, force diagram, wave diagram, dielectric polarisation, energy graph |
| Mathematics | Coordinate plane, number line, triangle labels, circle parts, histogram, box plot, normal distribution curve |
| Chemistry | Bohr atom, periodic elements, pH scale, H₂O molecule |
| Biology | Animal cell, DNA double helix, food chain |
| Environmental Science | Carbon cycle, greenhouse effect |
| Agriculture | Soil layers, plant growth stages |
| Computer Studies | Flowchart, network topology, binary table |
| General Science | Scientific method steps, states of matter |
| Statistics | Histogram, box plot, normal distribution curve |

All diagrams are pure inline SVG — no external images or libraries.

---

### Flashcards Tab
- Full deck of flashcards for the topic
- Filter by micro-topic
- Flip animation to reveal answer
- Track through cards with navigation

### Experiments Tab
- Hands-on activity cards for the topic
- Filter by micro-topic
- Three difficulty levels: Easy / Medium / Hard
- Each experiment includes: title, description, materials list, step-by-step instructions, safety note, expected results

### Curiosity Tab
- **Curiosity Tree**: expandable branches of related topics to explore further; clicking a branch navigates directly to that topic
- "How deep can you go?" section — all four difficulty explanations side by side for comparison

### Quiz Tab
- Multiple-choice quiz for the topic
- Filter questions by subtopic
- Immediate feedback after each answer: correct answer highlighted green, incorrect highlighted red, explanation shown
- Score tracked and displayed at end
- "Try Again" to restart
- Quiz scores saved to progress tracker

### Real World Tab
- Numbered list of real-world applications of the topic
- Concrete examples of where the concept appears in everyday life and industry

---

### Discovery Feed
- Scrollable feed of random "Did you know?" facts pulled from across the entire knowledge tree
- Sparks curiosity and cross-subject discovery

### Progress Tracking
- Every topic visited is logged (subject, domain, timestamp)
- Every quiz completed is logged (score, total, timestamp)
- Data stored locally and displayed on the Courses / Progress page

---

## 9. Siyafunda AI Assistant

A full conversational AI assistant built for teachers (`/teachers/el-ai`).

**Features:**
- Full-page chat interface
- Conversation history panel (collapsible sidebar)
- Create new conversations
- Browse and resume past conversations
- Delete individual conversations
- Real-time message streaming
- Context-aware teaching assistance: lesson ideas, explanations, differentiation strategies, parent communication, subject Q&A
- Multi-turn conversation support

---

## 10. GreyEd Teaching Assistant (Avatar)

An AI avatar-powered teaching assistant available across the platform.

**Features:**
- Animated teacher avatar (Judy) powered by HeyGen AI
- Clickable circular avatar button in the bottom-right corner
- Expandable to full-screen interaction mode
- Voice interaction capability
- Suggestions for: classroom activities, student engagement ideas, teaching strategies
- Personalised based on teaching context

---

## 11. Knowledge Galaxy Progress (Courses)

A personal analytics dashboard showing the teacher's Knowledge Galaxy exploration activity (`/teachers/courses`).

**Stat Tiles:**
- Topics Explored (of total available)
- Quizzes Taken
- Average Quiz Score (with performance label: Excellent / Good / Keep going)
- Subjects Visited (of 9)

**Subject Progress:**
- Progress bar per subject showing % of topics visited
- Topics visited / total count
- Quiz count per subject
- Colour-coded: green ≥80%, amber ≥40%, grey <40%

**Recent Activity Feed:**
- Last 8 topic visits, newest first
- Topic icon, name, subject, and relative time (e.g. "3 hours ago")
- Quiz score badge if that topic was quizzed
- Click any entry to jump back to that topic

**Quiz Performance:**
- All completed quizzes listed, newest first
- Score bar and score fraction (e.g. 7/10)
- Relative completion time
- Green checkmark for scores ≥80%

**Continue Exploring button** in the NavBar links directly back to the Knowledge Galaxy.

---

## 12. Settings

Teacher account and preferences management (`/teachers/settings`).

**Features:**
- Edit profile information (name, school, contact details)
- Account preferences
- Notification preferences

---

## 13. Accessibility & UI

### Dyslexia-Friendly Mode
- Toggle available in the NavBar on every page
- Changes font and spacing to improve readability for users with dyslexia

### Responsive Design
- Full desktop sidebar layout
- Tablet-optimised views
- Mobile layout with collapsible sidebar and bottom navigation bar
- All pages usable on phones

### General UI
- Collapsible sidebar (state persists across sessions via localStorage)
- Search and filter on all list pages
- Drag-and-drop file uploads
- Loading states and skeletons
- Success and error notifications
- Confirmation modals for destructive actions (delete)
- Word document download on all AI-generated content

---

## Curriculum Alignment

All content, lesson plans, assessments, and knowledge topics are aligned to the **South African CAPS (Curriculum and Assessment Policy Statement)** curriculum, covering:

- **Grades:** R through 12
- **Subjects:** Mathematics, Physical Sciences, Life Sciences, Natural Sciences, Agricultural Sciences, Computer Applications Technology, Information Technology, and more
- **Terms:** Term 1 – 4 with week-level granularity

---

*GreyEd Teachers Platform — Built for South African educators.*
