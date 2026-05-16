"""
HireSense-AI Pro — Unified AI Resume Analyzer
==============================================
Combines the best of all three projects:
  - HireSense-AI: role-specific keyword banks, structured analysis
  - ATS Resume Analyzer: multi-provider support (Claude/GPT/Gemini)
  - ATS-Analyzer: inline NLP scoring engine

Primary provider: Anthropic Claude (claude-sonnet-4-20250514)
Fallbacks: Google Gemini, OpenAI GPT-4o
"""

import json
import re
from typing import Optional
from config import settings

# ── Role-Specific Keyword Banks ───────────────────────────────────────────────
ROLE_KEYWORDS = {
    "Software Developer": [
        "algorithms", "data structures", "REST API", "microservices", "CI/CD",
        "Git", "Docker", "Kubernetes", "unit testing", "agile", "scrum",
        "system design", "OOP", "debugging", "code review",
    ],
    "Frontend Developer": [
        "React", "Vue", "Angular", "TypeScript", "HTML5", "CSS3", "Webpack",
        "responsive design", "accessibility", "performance optimization",
        "state management", "Redux", "GraphQL", "Jest", "Storybook",
    ],
    "Backend Developer": [
        "Node.js", "Python", "Java", "Spring Boot", "Django", "FastAPI",
        "PostgreSQL", "MongoDB", "Redis", "REST API", "gRPC", "message queue",
        "authentication", "authorization", "SQL", "NoSQL",
    ],
    "Data Analyst": [
        "SQL", "Python", "Excel", "Tableau", "Power BI", "data visualization",
        "statistical analysis", "pandas", "numpy", "ETL", "data cleaning",
        "A/B testing", "KPI", "dashboards", "business intelligence",
    ],
    "Data Scientist": [
        "machine learning", "deep learning", "Python", "TensorFlow", "PyTorch",
        "scikit-learn", "NLP", "computer vision", "model deployment",
        "feature engineering", "statistical modeling", "Jupyter", "MLOps",
    ],
    "UI/UX Designer": [
        "Figma", "user research", "wireframing", "prototyping", "usability testing",
        "design systems", "Sketch", "Adobe XD", "accessibility", "user flows",
        "information architecture", "interaction design", "visual design",
    ],
    "Product Manager": [
        "roadmap", "stakeholder management", "user stories", "Jira", "agile",
        "product strategy", "market research", "OKRs", "prioritization",
        "go-to-market", "KPIs", "cross-functional", "sprint planning",
    ],
    "DevOps Engineer": [
        "CI/CD", "Docker", "Kubernetes", "Terraform", "AWS", "Azure", "GCP",
        "infrastructure as code", "monitoring", "Prometheus", "Grafana",
        "Linux", "shell scripting", "SRE", "incident management",
    ],
    "Marketing Specialist": [
        "SEO", "SEM", "Google Analytics", "content marketing", "social media",
        "email campaigns", "A/B testing", "CRM", "HubSpot", "brand strategy",
        "lead generation", "conversion optimization", "ROI", "digital marketing",
    ],
    "Business Analyst": [
        "requirements gathering", "process mapping", "Visio", "SQL", "stakeholder",
        "BPMN", "use cases", "gap analysis", "Agile", "Waterfall",
        "SWOT analysis", "data analysis", "Excel", "Jira", "documentation",
    ],
    "General": [
        "leadership", "communication", "teamwork", "problem solving",
        "project management", "analytical", "collaboration", "adaptability",
    ],
}

INDUSTRY_TIPS = {
    "Software Developer": [
        "Showcase GitHub contributions and open-source projects.",
        "List programming languages with proficiency levels.",
        "Include system design or architecture experience.",
        "Mention performance improvements with metrics (e.g., 'reduced load time by 40%').",
    ],
    "Data Scientist": [
        "Link to Kaggle profile or published notebooks.",
        "Quantify model improvements (accuracy, F1, AUC).",
        "Highlight end-to-end ML pipeline experience.",
        "Mention papers, blogs, or talks if applicable.",
    ],
    "UI/UX Designer": [
        "Always include a portfolio link.",
        "Describe design process and user research methods.",
        "Quantify impact (e.g., 'increased conversion by 25%').",
        "Mention accessibility and WCAG compliance experience.",
    ],
    "General": [
        "Use industry-standard action verbs.",
        "Quantify achievements wherever possible.",
        "Keep formatting clean and ATS-compatible.",
        "Tailor each application to the specific job description.",
    ],
}


# ── JSON Parsing Helper ───────────────────────────────────────────────────────

def _parse_json(raw: str) -> dict:
    """Safely parse JSON from AI response, handling markdown fences."""
    cleaned = re.sub(r"```(?:json)?", "", raw).strip().rstrip("`").strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except Exception:
                pass
    return {}


# ── Provider Callers ──────────────────────────────────────────────────────────

def _call_anthropic(system_prompt: str, user_prompt: str) -> str:
    import anthropic
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    msg = client.messages.create(
        model=settings.ANTHROPIC_MODEL,
        max_tokens=4096,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    )
    return msg.content[0].text


def _call_gemini(prompt: str) -> str:
    import google.generativeai as genai
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel(settings.GEMINI_MODEL)
    resp = model.generate_content(prompt)
    return resp.text


def _call_openai(system_prompt: str, user_prompt: str) -> str:
    import openai
    client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    resp = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_prompt},
        ],
        max_tokens=4096,
        response_format={"type": "json_object"},
    )
    return resp.choices[0].message.content


def _ai_call(system_prompt: str, user_prompt: str, provider: str = None) -> str:
    """Dispatch to the configured AI provider."""
    p = provider or settings.AI_PROVIDER
    if p == "anthropic":
        return _call_anthropic(system_prompt, user_prompt)
    elif p == "gemini":
        return _call_gemini(f"{system_prompt}\n\n{user_prompt}")
    elif p == "openai":
        return _call_openai(system_prompt, user_prompt)
    else:
        raise ValueError(f"Unknown AI provider: {p}")


# ── Inline NLP Scoring (from ats-analyzer — no API cost) ─────────────────────

TECH_SKILLS = {
    "python", "java", "javascript", "typescript", "react", "node", "sql",
    "aws", "azure", "gcp", "docker", "kubernetes", "git", "linux", "api",
    "rest", "graphql", "mongodb", "postgresql", "redis", "tensorflow",
    "pytorch", "scikit-learn", "pandas", "numpy", "spark", "kafka", "ci/cd",
    "agile", "scrum", "machine learning", "deep learning", "nlp", "data science",
    "cloud", "microservices", "devops", "html", "css", "vue", "angular",
    "spring", "django", "flask", "fastapi", "selenium", "jenkins", "terraform",
}

SOFT_SKILLS = {
    "communication", "leadership", "teamwork", "problem-solving", "analytical",
    "collaboration", "management", "mentoring", "presentation", "critical thinking",
    "adaptability", "creativity", "organization", "time management",
}

ACTION_VERBS = {
    "achieved", "accelerated", "built", "created", "designed", "developed",
    "delivered", "drove", "engineered", "established", "executed", "expanded",
    "generated", "implemented", "improved", "increased", "launched", "led",
    "managed", "optimized", "produced", "reduced", "scaled", "shipped",
    "solved", "streamlined", "transformed", "architected", "automated",
    "collaborated", "coordinated", "deployed", "enhanced", "facilitated",
    "integrated", "mentored", "migrated", "pioneered", "spearheaded",
}

WEAK_VERBS = {
    "worked", "helped", "assisted", "participated", "involved",
    "tried", "did", "made", "had", "got", "used", "handled",
}

SECTION_HEADERS = {
    "experience", "education", "skills", "projects", "summary",
    "certifications", "achievements", "objective",
}

FILLER = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "will", "would", "could", "should", "may", "might",
}

EDUCATION_DEGREES = {
    "bachelor", "master", "phd", "doctorate", "associate", "b.s", "m.s",
    "b.e", "m.e", "b.tech", "m.tech", "mba", "b.sc", "m.sc",
}


def _tokenize(text: str) -> list:
    return re.findall(r"\b[a-z][a-z0-9+#.\-/]*[a-z0-9]\b|\b[a-z]\b", text.lower())


def _bigrams(tokens: list) -> list:
    return [f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens) - 1)]


def calculate_local_scores(resume_text: str, job_description: str = "", job_role: str = "General") -> dict:
    """
    Fast local scoring (no API cost) using inline NLP.
    Returns scores and signals used to enrich the AI prompt.
    """
    r_low  = resume_text.lower()
    r_tok  = _tokenize(resume_text)
    r_big  = set(_bigrams(r_tok))
    wc     = len(resume_text.split())

    # Skills scoring
    role_kws = ROLE_KEYWORDS.get(job_role, ROLE_KEYWORDS["General"])
    res_tech = [s for s in TECH_SKILLS if s in r_low or s in r_big]
    res_soft = [s for s in SOFT_SKILLS if s in r_low or s in r_big]

    if job_description:
        jd_low = job_description.lower()
        jd_tok = _tokenize(job_description)
        jd_big = set(_bigrams(jd_tok))
        jd_all = [s for s in (TECH_SKILLS | SOFT_SKILLS) if s in jd_low or s in jd_big]
        matched = [s for s in jd_all if s in r_low or s in r_big]
        missing = [s for s in jd_all if s not in r_low and s not in r_big]
        keyword_score = round(len(matched) / max(len(jd_all), 1) * 100)
    else:
        matched = res_tech + res_soft
        missing = [k for k in role_kws if k.lower() not in r_low]
        keyword_score = min(100, round((len(matched) / 20) * 100))

    # Action verbs
    action_found = [t for t in r_tok if t in ACTION_VERBS]
    weak_found   = [t for t in r_tok if t in WEAK_VERBS]
    verb_total   = len(action_found) + len(weak_found)
    verb_score   = min(100, round(len(action_found) / max(verb_total, 1) * 100) + (10 if len(set(action_found)) >= 8 else 0))

    # Format scoring
    fmt_score = 100
    fmt_issues = []
    found_secs = [h for h in SECTION_HEADERS if h in r_low]
    missing_secs = [s for s in ["experience", "education", "skills"] if s not in found_secs]
    fmt_score -= len(missing_secs) * 10

    if wc < 200:
        fmt_score -= 20
        fmt_issues.append("Resume too short (<200 words)")
    elif wc > 1200:
        fmt_score -= 10
        fmt_issues.append("Resume may be too long (>1200 words)")
    if not re.search(r"[\w.+-]+@[\w-]+\.[a-z]{2,}", resume_text):
        fmt_score -= 10
        fmt_issues.append("No email address detected")
    if not re.search(r"(\+?\d[\d\s\-(). ]{7,}\d)", resume_text):
        fmt_score -= 5
        fmt_issues.append("No phone number detected")
    metrics = re.findall(r"\b\d+\s*(%|percent|x|times|k|m|million|users|clients)", r_low)
    if not metrics:
        fmt_score -= 10
        fmt_issues.append("Add quantifiable metrics (%, numbers, scale)")
    bullets = len(re.findall(r"^[\s]*[•\-\*▪]", resume_text, re.MULTILINE))
    if bullets < 5:
        fmt_score -= 10
        fmt_issues.append("Add more bullet points for readability")

    # Education scoring
    degrees   = [d for d in EDUCATION_DEGREES if d in r_low]
    edu_score = 70 if degrees else 40
    cert_count = len(re.findall(r"certif", r_low))
    edu_score = min(100, edu_score + cert_count * 5)

    # Experience scoring
    exp_score = 60
    yr_match = re.findall(r"(\d+)\+?\s*years?\s+(?:of\s+)?experience", r_low)
    if yr_match:
        yrs = max(int(y) for y in yr_match)
        exp_score += 25 if yrs >= 5 else (15 if yrs >= 2 else 5)
    exp_score = min(100, exp_score + min(15, len(action_found) * 2))

    # Overall ATS score (weighted blend)
    ats_score = round(
        keyword_score * 0.30 +
        fmt_score     * 0.25 +
        verb_score    * 0.20 +
        edu_score     * 0.10 +
        exp_score     * 0.15
    )

    return {
        "local_ats_score":   min(100, max(0, ats_score)),
        "keyword_score":     keyword_score,
        "format_score":      min(100, max(0, fmt_score)),
        "verb_score":        verb_score,
        "education_score":   edu_score,
        "experience_score":  exp_score,
        "found_keywords":    matched[:30],
        "missing_keywords":  missing[:20],
        "format_issues":     fmt_issues,
        "found_sections":    found_secs,
        "missing_sections":  missing_secs,
        "weak_verbs_found":  list(set(weak_found))[:10],
        "action_verbs_used": list(set(action_found))[:15],
        "word_count":        wc,
        "has_metrics":       bool(metrics),
        "bullet_count":      bullets,
    }


# ── Main Analysis Prompt ──────────────────────────────────────────────────────

ANALYSIS_SYSTEM = """You are an expert ATS resume coach and career advisor with 15+ years of technical recruiting experience.
Analyze resumes deeply and return ONLY valid JSON — no prose, no markdown fences.
Be specific, actionable, and constructive. Score honestly (most resumes score 50-70)."""


def _build_analysis_prompt(resume_text: str, job_role: str, job_description: str, local: dict) -> str:
    role_kws = ROLE_KEYWORDS.get(job_role, ROLE_KEYWORDS["General"])
    industry_hints = INDUSTRY_TIPS.get(job_role, INDUSTRY_TIPS["General"])
    jd_section = f"\n--- TARGET JOB DESCRIPTION ---\n{job_description[:2000]}\n---" if job_description.strip() else ""

    return f"""Analyze this resume for the role: {job_role}
{jd_section}

--- LOCAL ANALYSIS PRE-COMPUTED ---
Word Count: {local['word_count']}
Found Sections: {local['found_sections']}
Missing Sections: {local['missing_sections']}
Format Issues: {local['format_issues']}
Has Quantifiable Metrics: {local['has_metrics']}
Weak Verbs Found: {local['weak_verbs_found']}
Action Verbs Used: {local['action_verbs_used']}
---

--- RESUME TEXT ---
{resume_text[:5000]}
---

Important Keywords for {job_role}: {', '.join(role_kws)}
Industry Tips: {', '.join(industry_hints)}

Return ONLY a JSON object with this EXACT structure:
{{
  "ats_score": <integer 0-100>,
  "keyword_score": <integer 0-100>,
  "format_score": <integer 0-100>,
  "readability_score": <integer 0-100>,
  "experience_score": <integer 0-100>,
  "score_breakdown": {{
    "format_and_structure": <0-20>,
    "keyword_relevance": <0-25>,
    "experience_quality": <0-25>,
    "skills_alignment": <0-20>,
    "grammar_and_clarity": <0-10>
  }},
  "overall_assessment": "<2-3 sentence professional summary>",
  "found_keywords": ["<keyword>", ...],
  "missing_keywords": ["<keyword>", ...],
  "skills_to_add": ["<skill>", ...],
  "weak_verbs": [{{"original": "<weak>", "better": "<strong>"}}],
  "suggestions": ["<specific actionable suggestion>", ...],
  "strengths": ["<strength>", ...],
  "critical_issues": ["<critical issue>", ...],
  "grammar_issues": [{{"excerpt": "<text>", "issue": "<problem>", "fix": "<corrected>"}}],
  "section_analysis": {{
    "contact": {{"present": true, "score": 0-100, "feedback": "<feedback>"}},
    "summary": {{"present": true, "score": 0-100, "feedback": "<feedback>"}},
    "experience": {{"present": true, "score": 0-100, "feedback": "<feedback>"}},
    "education": {{"present": true, "score": 0-100, "feedback": "<feedback>"}},
    "skills": {{"present": true, "score": 0-100, "feedback": "<feedback>"}},
    "projects": {{"present": true, "score": 0-100, "feedback": "<feedback>"}}
  }},
  "improved_summary": "<rewritten professional summary for {job_role}>",
  "industry_tips": ["<industry-specific tip>", ...],
  "interview_questions": ["<likely interview question based on resume>", ...],
  "career_roadmap": {{
    "current_level": "<Junior/Mid/Senior>",
    "next_steps": ["<step>", ...],
    "skills_to_learn": ["<skill>", ...],
    "timeline": "<6-12 months>"
  }}
}}"""


# ── Fallback Analysis ─────────────────────────────────────────────────────────

def _fallback_analysis(resume_text: str, job_role: str, local: dict) -> dict:
    """Rule-based fallback when AI APIs are unavailable."""
    role_kws = ROLE_KEYWORDS.get(job_role, ROLE_KEYWORDS["General"])
    industry_tips = INDUSTRY_TIPS.get(job_role, INDUSTRY_TIPS["General"])

    score = local["local_ats_score"]
    assessment = (
        "Strong resume" if score >= 75 else
        "Decent resume with room for improvement" if score >= 55 else
        "Resume needs significant improvement"
    )

    return {
        "ats_score":          score,
        "keyword_score":      local["keyword_score"],
        "format_score":       local["format_score"],
        "readability_score":  70,
        "experience_score":   local["experience_score"],
        "score_breakdown":    {
            "format_and_structure": min(20, local["format_score"] // 5),
            "keyword_relevance":    min(25, local["keyword_score"] // 4),
            "experience_quality":   min(25, local["experience_score"] // 4),
            "skills_alignment":     min(20, local["verb_score"] // 5),
            "grammar_and_clarity":  8,
        },
        "overall_assessment": f"{assessment} for a {job_role} role.",
        "found_keywords":     local["found_keywords"],
        "missing_keywords":   local["missing_keywords"],
        "skills_to_add":      role_kws[:5],
        "weak_verbs":         [{"original": v, "better": "use a strong action verb"} for v in local["weak_verbs_found"]],
        "suggestions":        local["format_issues"] + [
            "Quantify achievements with numbers and percentages.",
            "Add more industry-specific keywords.",
            "Use strong action verbs to start each bullet point.",
        ],
        "strengths":          ["Contains key technical skills", "Has relevant sections"],
        "critical_issues":    local["format_issues"][:3] if local["format_issues"] else ["Resume needs more specifics"],
        "grammar_issues":     [],
        "section_analysis":   {
            sec: {"present": sec in local["found_sections"], "score": 70 if sec in local["found_sections"] else 30, "feedback": "Present" if sec in local["found_sections"] else "Missing — add this section"}
            for sec in ["contact", "summary", "experience", "education", "skills", "projects"]
        },
        "improved_summary":   f"Experienced {job_role} with demonstrated expertise. Add your key accomplishments here.",
        "industry_tips":      industry_tips,
        "interview_questions": [
            f"Tell me about your experience as a {job_role}.",
            "Describe your biggest professional achievement.",
            "How do you stay current with industry trends?",
        ],
        "career_roadmap": {
            "current_level": "Mid-level",
            "next_steps": ["Build portfolio", "Get certified", "Apply to target companies"],
            "skills_to_learn": role_kws[:4],
            "timeline": "6-12 months",
        },
    }


# ── Public API ────────────────────────────────────────────────────────────────

async def analyze_resume_with_ai(
    resume_text: str,
    job_role: str = "General",
    job_description: str = "",
    language: str = "English",
) -> dict:
    """
    Full AI analysis of a resume.
    Runs local NLP first (free), then calls the AI provider.
    Blends scores for reliability.
    """
    # Step 1: Fast local scoring (always runs)
    local = calculate_local_scores(resume_text, job_description, job_role)

    # Step 2: Language detection / multi-language note
    lang_note = ""
    if language and language.lower() != "english":
        lang_note = f"\nNote: This resume appears to be in {language}. Analyze accordingly and provide feedback in English."

    # Step 3: AI deep analysis
    try:
        prompt = _build_analysis_prompt(resume_text, job_role, job_description, local) + lang_note
        raw = _ai_call(ANALYSIS_SYSTEM, prompt)
        ai_result = _parse_json(raw)
        if not ai_result or "ats_score" not in ai_result:
            raise ValueError("Empty AI response")
    except Exception as e:
        print(f"⚠️  AI analysis failed ({e}). Using fallback.")
        ai_result = _fallback_analysis(resume_text, job_role, local)

    # Step 4: Blend scores (60% AI + 40% local) for reliability
    ai_ats   = ai_result.get("ats_score", local["local_ats_score"])
    final_ats = round(0.6 * ai_ats + 0.4 * local["local_ats_score"])
    ai_result["ats_score"] = min(100, max(0, final_ats))

    # Merge local keyword data if AI result is sparse
    if not ai_result.get("found_keywords"):
        ai_result["found_keywords"] = local["found_keywords"]
    if not ai_result.get("missing_keywords"):
        ai_result["missing_keywords"] = local["missing_keywords"]

    return ai_result


async def rewrite_resume_with_ai(
    resume_text: str,
    job_role: str,
    target_role: str = None,
    analysis: dict = None,
) -> str:
    """Generate a completely rewritten, ATS-optimized version of the resume."""
    target = target_role or job_role
    role_kws = ROLE_KEYWORDS.get(target, ROLE_KEYWORDS["General"])

    prompt = f"""You are a professional resume writer. Rewrite this resume for a {target} role.

ORIGINAL RESUME:
{resume_text[:4000]}

REQUIREMENTS:
- Keep all real information (don't fabricate experience)
- Use strong action verbs (achieved, engineered, led, etc.)
- Add quantifiable metrics where reasonable
- Optimize for ATS systems
- Include these keywords naturally: {', '.join(role_kws[:10])}
- Professional summary, Experience, Skills, Education, Projects sections
- Clean formatting with clear section headers

Return the complete rewritten resume as plain text (no JSON, no markdown)."""

    try:
        return _ai_call("You are an expert resume writer. Return only the rewritten resume text.", prompt)
    except Exception as e:
        return f"[Resume rewrite unavailable: {e}]\n\nOriginal resume preserved."


async def generate_interview_questions(
    resume_text: str,
    job_role: str,
    count: int = 15,
) -> list:
    """Generate tailored interview questions based on the resume."""
    prompt = f"""Based on this resume for a {job_role} position, generate {count} likely interview questions.

RESUME:
{resume_text[:3000]}

Include a mix of:
- Behavioral questions (STAR format)
- Technical questions based on their skills
- Role-specific questions
- Questions about gaps or weak points

Return ONLY a JSON array of strings: ["question1", "question2", ...]"""

    try:
        raw = _ai_call(
            "You are an expert interviewer. Return only JSON.",
            prompt
        )
        result = _parse_json(raw)
        if isinstance(result, list):
            return result
        if isinstance(result, dict):
            for v in result.values():
                if isinstance(v, list):
                    return v
    except Exception:
        pass

    return [
        f"Tell me about your experience as a {job_role}.",
        "What is your greatest professional achievement?",
        "How do you handle tight deadlines?",
        "Describe a challenging project and how you overcame obstacles.",
        "Where do you see yourself in 5 years?",
    ]


async def analyze_linkedin_profile(linkedin_text: str, target_role: str) -> dict:
    """Analyze a LinkedIn profile and compare it to resume best practices."""
    prompt = f"""Analyze this LinkedIn profile for a {target_role} position.

LINKEDIN PROFILE:
{linkedin_text[:4000]}

Return ONLY a JSON object:
{{
  "profile_score": <0-100>,
  "headline_feedback": "<feedback on headline>",
  "summary_feedback": "<feedback on About section>",
  "experience_feedback": "<feedback on experience>",
  "skills_feedback": "<feedback on skills section>",
  "missing_elements": ["<missing element>", ...],
  "optimization_tips": ["<specific tip>", ...],
  "keywords_to_add": ["<keyword>", ...],
  "improved_headline": "<suggested headline>",
  "improved_summary": "<suggested About section>"
}}"""

    try:
        raw = _ai_call(
            "You are a LinkedIn optimization expert. Return only JSON.",
            prompt
        )
        return _parse_json(raw)
    except Exception as e:
        return {
            "profile_score": 50,
            "headline_feedback": "Unable to analyze",
            "optimization_tips": ["Complete all profile sections", "Add relevant keywords", "Get endorsements"],
            "error": str(e),
        }


async def generate_career_roadmap(
    resume_text: str,
    job_role: str,
    target_role: str = None,
) -> dict:
    """Generate a personalized career roadmap."""
    target = target_role or job_role
    prompt = f"""Based on this resume, create a detailed career roadmap from {job_role} toward {target}.

RESUME:
{resume_text[:3000]}

Return ONLY a JSON object:
{{
  "current_level": "<Junior/Mid/Senior/Lead>",
  "target_level": "<role they should aim for>",
  "gap_analysis": ["<skill/experience gap>", ...],
  "roadmap": [
    {{"phase": "0-3 months", "actions": ["<action>", ...], "milestones": ["<milestone>"]}},
    {{"phase": "3-6 months", "actions": ["<action>", ...], "milestones": ["<milestone>"]}},
    {{"phase": "6-12 months", "actions": ["<action>", ...], "milestones": ["<milestone>"]}},
    {{"phase": "1-2 years", "actions": ["<action>", ...], "milestones": ["<milestone>"]}}
  ],
  "certifications_recommended": ["<cert>", ...],
  "skills_priority": ["<skill>", ...],
  "salary_insight": "<typical salary range for target role>",
  "job_titles_to_target": ["<title>", ...]
}}"""

    try:
        raw = _ai_call(
            "You are a career counselor. Return only JSON.",
            prompt
        )
        return _parse_json(raw)
    except Exception as e:
        role_kws = ROLE_KEYWORDS.get(target, ROLE_KEYWORDS["General"])
        return {
            "current_level": "Mid-level",
            "target_level": target,
            "gap_analysis": role_kws[:4],
            "roadmap": [
                {"phase": "0-3 months", "actions": ["Update resume", "Build portfolio"], "milestones": ["Apply to 10 jobs"]},
                {"phase": "3-6 months", "actions": ["Get certified", "Network"], "milestones": ["Land interviews"]},
            ],
            "certifications_recommended": [],
            "skills_priority": role_kws[:5],
        }


async def rank_resumes(resumes: list, job_description: str) -> list:
    """Rank multiple resumes against a job description."""
    results = []
    for item in resumes:
        local = calculate_local_scores(item["resume_text"], job_description)
        results.append({
            "filename":     item["filename"],
            "ats_score":    local["local_ats_score"],
            "keyword_score": local["keyword_score"],
            "found_keywords": local["found_keywords"][:5],
            "missing_keywords": local["missing_keywords"][:5],
        })
    return sorted(results, key=lambda x: x["ats_score"], reverse=True)


async def detect_language(text: str) -> str:
    """Detect the language of the resume text."""
    try:
        import langdetect
        lang = langdetect.detect(text)
        lang_map = {
            "en": "English", "es": "Spanish", "fr": "French", "de": "German",
            "zh-cn": "Chinese", "ar": "Arabic", "hi": "Hindi", "pt": "Portuguese",
            "ja": "Japanese", "ko": "Korean",
        }
        return lang_map.get(lang, lang.upper())
    except Exception:
        return "English"


async def generate_template(job_role: str, level: str = "mid") -> str:
    """Generate a professional resume template for a given role."""
    role_kws = ROLE_KEYWORDS.get(job_role, ROLE_KEYWORDS["General"])
    prompt = f"""Create a professional resume template for a {level}-level {job_role}.

Include placeholders like [YOUR NAME], [COMPANY], [SKILL], etc.
Use strong action verbs and include sample metrics.
Include sections: Contact, Professional Summary, Experience (2-3 roles), Skills, Education, Projects.
Keywords to incorporate: {', '.join(role_kws[:8])}

Return the complete template as plain text with proper formatting."""

    try:
        return _ai_call(
            "You are a professional resume writer. Return only the resume template.",
            prompt
        )
    except Exception:
        return f"""[YOUR NAME]
[Email] | [Phone] | [LinkedIn] | [GitHub/Portfolio]

PROFESSIONAL SUMMARY
Experienced {job_role} with X years of expertise in {', '.join(role_kws[:3])}.

EXPERIENCE
[Company Name] — {job_role} | [Start] – [End]
• [Achievement with metric, e.g., 'Increased performance by 30%']

SKILLS
{', '.join(role_kws)}

EDUCATION
[Degree] in [Field] — [University], [Year]
"""
