Aviya Magnus - GitHub Pages ready website template (demo)
---------------------------------------------------------
This ZIP contains a static site with:
- index.html + inner pages (about, courses, testimonial, faq, contact)
- login pages (student/teacher/parent) with client-side demo redirects
- dashboards (student/teacher/parent) with demo calendar and files pages
- chat page (UI demo)
- css/style.css and basic js/main.js
- js/firebase-init.js (placeholder) - replace with your Firebase config to enable realtime features
- demo placeholders for chat, file uploads and scheduling (client-side UI only)

How to use:
1. Unzip and push the folder to a GitHub repo (root).
2. Enable GitHub Pages in repository settings (branch: main, folder: /).
3. To add realtime features: create Firebase project and paste config into js/firebase-init.js,
   then update js/auth.js, js/chat.js to use Firebase Auth/Firestore/Storage.
