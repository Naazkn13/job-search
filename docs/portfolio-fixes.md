# Portfolio Fixes Checklist — Based on Live Site Audit

## ✅ Already Fixed (verified on live site)

- [x] Email link works — `https://mail.google.com/mail/?view=cm&fs=1&to=knuzhat136@gmail.com`
- [x] LinkedIn link present — `https://www.linkedin.com/in/nuzhat-khan-dev/`
- [x] Resume download works — `https://nuzhat-portfolio-alpha.vercel.app/Nuzhat_Khan_Resume.pdf`
- [x] Copyright year is 2026
- [x] Case studies present for all 6 projects (Novus Comply, Compulse, CAS Parser, Biometric Attendance, HospitalSop, NSA Sports)
- [x] Skills section well-organized with PyMuPDF, tabula-py, etc.
- [x] "Go" not present in skills (good)
- [x] Hero has "View Projects" and "View Resume" buttons

---

## 🔴 Critical Fixes (do today)

### 1. Update Resume PDF Content
**Issue:** The downloadable resume still says "Fullstack Developer" and "June 2025 – Present"
**Fix:** Replace `Nuzhat_Khan_Resume.pdf` with the updated version that says:
- Headline: `Software Developer | Python | FastAPI | PostgreSQL | REST APIs | Docker`
- Dates: `June 2025 – July 2026` (not "Present")
- Summary: Updated positioning (Python/Backend + RegTech/BFSI)

### 2. Update Hero Title
**Issue:** Page title and hero say "Fullstack Developer"
**Fix:** Change to `Software Developer | Python | FastAPI | Backend | RegTech/BFSI | React`
- Update `<title>` tag
- Update hero headline
- Update OG/meta tags

### 3. Update About Section
**Issue:** Says "currently working at Infomatics Services" — outdated
**Fix:** Change to past tense:
- "I worked at Infomatics Services where I built enterprise compliance software..."
- Or: "I'm a software developer with enterprise BFSI/RegTech experience..."

### 4. Add Missing Projects
**Issue:** FashionGallery and Job Search System not shown
**Fix:** Add these as project cards:

**FashionGallery**
- AI-powered fashion search with clip embeddings, vector search, RAG retrieval
- FastAPI backend, React/Next.js frontend, Docker deployment
- Link: https://github.com/Naazkn13/FashionGallery
- Status: In Progress

**Job Search System**
- MNC job application tracker with resume tailoring, interview prep, project showcase
- Next.js frontend, Python/FastAPI backend, Supabase database
- Link: https://github.com/Naazkn13/job-search
- Status: Live

---

## 🟡 Short-term Fixes (this week)

### 5. Add Video Intro Caption
**Issue:** "Click to watch" has no context
**Fix:** Add a caption like:
- "Watch my 60-second intro"
- "▶ Click to see what I've built"

### 6. Update Meta Description
**Issue:** Meta title says "Fullstack Developer"
**Fix:** Update to:
- Title: `Nuzhat Khan — Software Developer | Python | FastAPI | Backend`
- Description: `Software developer with enterprise BFSI/RegTech experience. Python, FastAPI, React, Docker. Currently building AI/GenAI applications.`

### 7. Add AI/GenAI Skills
**Issue:** Skills section missing AI-specific items
**Fix:** Add under a new "AI/GenAI" category or update existing:
- RAG, Embeddings, Vector Search, LLM Integration, Prompt Engineering
- Pinecone, FAISS, LangChain, OpenAI API

### 8. Add Case Study for FashionGallery
**Issue:** No case study for FashionGallery
**Fix:** Create `/case-study/fashion-gallery` with:
- Challenge: Fashion search requires understanding visual similarity
- Architecture: CLIP embeddings, Qdrant vector DB, RAG retrieval
- Impact: Demonstrates practical AI application work

---

## 🟢 Nice-to-have (later)

### 9. Add Testimonials
- Add 1-2 client testimonials (Infomatics manager, hospital admin, etc.)

### 10. Add Blog/Writing
- Write one technical article about a project challenge

### 11. Performance
- Ensure page load < 2 seconds
- Optimize images

---

## Verification Checklist (after fixes)

- [ ] Resume PDF has correct dates (June 2025 – July 2026)
- [ ] Resume PDF has updated headline
- [ ] Hero title updated
- [ ] About section updated (past tense for Infomatics)
- [ ] FashionGallery project added
- [ ] Job Search System project added
- [ ] Video intro has caption
- [ ] Meta title/description updated
- [ ] AI/GenAI skills added
- [ ] All links still work
- [ ] Mobile responsive
