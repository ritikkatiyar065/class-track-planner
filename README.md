# 📚 Student Attendance Tracker App

A mobile-friendly attendance tracking app built with **Lovable** (React Native/Flutter/No-code), powered by **Supabase** as the backend. This app helps students monitor their attendance, track bunkable classes, calculate attendance percentages, and set attendance goals.

---

## 🚀 Features

- ✅ Mark classes as **attended** or **missed**
- 📊 Live **attendance percentage calculation**
- 🎯 Set **target percentage** (e.g., 75%) and get warnings if you're falling short
- 📆 Track **daily attendance logs**
- 📎 View **total classes** and **attended classes** per subject
- 📁 Backend powered by **Supabase** (PostgreSQL + REST API)
- 📉 Calculate how many more classes you can miss (bunkable)
- 💡 Clean and simple UI (built using Lovable)

---

## 🧩 Tech Stack

| Frontend        | Backend        | Database     |
|----------------|----------------|--------------|
| Lovable App     | Supabase REST API | Supabase (PostgreSQL) |

---

## 🗃️ Database Schema (Supabase)

### `subjects` table
| Column           | Type        | Description                      |
|------------------|-------------|----------------------------------|
| `id`             | UUID        | Primary key                      |
| `name`           | TEXT        | Subject name                     |
| `total_classes`  | INTEGER     | Total number of classes          |
| `attended_classes` | INTEGER   | Number of classes attended       |
| `target_percentage` | INTEGER | Desired attendance percentage    |

### `attendance_logs` table
| Column     | Type     | Description                           |
|------------|----------|---------------------------------------|
| `id`       | UUID     | Primary key                           |
| `subject_id` | UUID   | Foreign key to `subjects(id)`         |
| `status`   | TEXT     | 'attended' or 'missed'                |
| `date`     | DATE     | Date of the class                     |

---

## 🛠️ Setup Instructions

1. **Clone the project** (if using a code version):
   ```bash
   git clone https://github.com/your-username/attendance-tracker-app.git
   cd attendance-tracker-app
