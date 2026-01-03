# MediVault 💊

MediVault is a personal health dashboard designed to help users track medication adherence and understand how their prescriptions affect their vital signs.

Built with **React**, this application goes beyond simple tracking by implementing a **Temporal Correlation Engine** that analyzes the relationship between medication intake and takes vital readings (Blood Pressure, Heart Rate, etc.).

## 🚀 Key Features

- **Medicine Cabinet:** Full CRUD capability for medications with custom dosages and frequencies.
- **Adherence Tracking:** Visual history of doses taken vs. skipped over the last 7 days.
- **Vitals Monitoring:** Track Blood Pressure, Heart Rate, Weight, and Temperature.
- **Correlation Intelligence:** Automatically tags vital readings with "Context" (e.g., _"Reading taken 2 hours after Lisinopril"_) to help users seeing cause-and-effect.
- **Responsive UI:** Fully responsive layout optimized for desktop and mobile.

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **State Management:** React Context API + useReducer
- **Styling:** CSS Modules
- **Data Persistence:** LocalStorage (Simulated Database)
- **Utilities:** `date-fns` (Time manipulation), `lucide-react` (Icons), `react-hot-toast` (Notifications)

## 🔮 Future Roadmap

- **Backend Migration:** Transition from LocalStorage to Node.js/Express.
- **Authentication:** Multi-user support with secure JWT authentication.
- **Export Data:** Generate PDF reports for doctor visits.
