# Google Play Store Release Pack

Complete metadata, localized store listings, and Data Safety documentation for publishing LifeStack on the Google Play Console.

---

## 1. App Identity & Listing Essentials

- **App Title**: LifeStack: Decision Intelligence
- **Package Name (Application ID)**: `ai.lifestack.app`
- **Default Language**: English (United States)
- **Secondary Language**: Hindi (India)
- **Category**: Productivity / Finance / Education
- **Content Rating**: Everyone (PEGI 3 / ESRB Everyone)

---

## 2. Store Listing Copy

### English (en-US)
**Short Description (max 80 chars)**:
> Personal data warehouse, pattern mining, and grounded AI for real-life decisions.

**Full Description (max 4000 chars)**:
```text
LifeStack is your Personal Decision Intelligence Platform. Connect your spending, career milestones, academics, and daily health metrics into a private personal data warehouse. Mine patterns with machine learning, compare against open demographic benchmarks, and consult a zero-hallucination GenAI Copilot for real life decisions.

KEY PILLARS & FEATURES:

1. HOLISTIC DATA VISUALIZATION & LIFE SCORE™
• Real-time composite Life Score (0–100) assessing Financial Runway, Career Velocity, Sleep Health, and Skills Mastery.
• Interactive spending breakdown with category drill-downs and cross-filtering.
• Correlated life timeline linking academic crunch periods, transit changes, and spending spikes.

2. GROUNDED GENAI DECISION COPILOT
• Zero hallucination: Every response cites specific records from your private warehouse and certified open datasets.
• Plain-language answers to real-life questions: "Can I afford this course EMI?", "Should I choose CS or ECE?", or "Why do my expenses spike in exam weeks?"
• "Why this answer?" transparency drawer detailing assumptions, confidence scores, and data gaps.
• Hands-free voice queries and audio narration with Web Speech API in English and Hindi.

3. DATA MINING LAB
• Anomaly Detection: Isolation Forest & Z-Score algorithms flagging unusual transactions and biometric sleep deficits.
• Persona Clustering: K-Means segmentation comparing behavior against 500 peer archetypes.
• Association Rules: Apriori / FP-Growth discovering lifestyle co-occurrences (e.g. late screen time leading to food delivery spend).
• Forecasting: Holt-Winters time-series projection with 80% and 95% confidence bands.
• Goal Classifier: Random Forest predictor identifying the key drivers of goal completion.

4. WHAT-IF MONTE CARLO SIMULATOR
• Test real-world scenarios: Course EMIs, salary hikes, branch transitions, or relocation.
• 1,000 stochastic trajectory runs modeling volatility and showing probability of achieving your financial goals.

5. SMART DOCUMENT SCANNER
• Ingest bank statements, receipts, and payslips via OCR with preview and confirmation before data enters the warehouse.

6. PRIVACY VAULT (DPDP ACT 2023 & GDPR)
• Granular per-category consent toggles.
• Complete data inventory export (JSON/CSV) and single-tap Right-to-be-Forgotten account erasure.
• Strict k-anonymity (k >= 10) on all peer comparisons.

DISCLAIMER: LifeStack provides statistical decision intelligence and educational modeling only. It does not constitute certified professional financial, investment, medical, or legal advice.
```

### Hindi (hi-IN)
**Short Description (max 80 chars)**:
> व्यक्तिगत डेटा वेयरहाउस, पैटर्न माइनिंग और वास्तविक निर्णयों के लिए प्रमाणित एआई।

**Full Description**:
```text
लाइफस्टैक आपका व्यक्तिगत निर्णय इंटेलिजेंस प्लेटफॉर्म है। अपने खर्च, करियर, शिक्षा और स्वास्थ्य डेटा को एक सुरक्षित व्यक्तिगत वेयरहाउस में जोड़ें। सांख्यिकीय माइनिंग से पैटर्न खोजें और शून्य-भ्रांति प्रमाणित एआई कोपायलट से अपने जीवन के महत्वपूर्ण निर्णय लें।

मुख्य विशेषताएं:
• लाइफ स्कोर™: समग्र स्वास्थ्य, करियर और वित्तीय गतिशीलता का 0-100 स्कोर।
• प्रमाणित एआई कोपायलट: हर उत्तर आपके वेयरहाउस से प्रमाणित संदर्भों के साथ।
• डेटा माइनिंग लैब: विसंगति पहचान (आइसोलेशन फॉरेस्ट), क्लस्टरिंग और पूर्वानुमान।
• व्हाट-इफ सिमुलेटर: 1,000 मोंटे कार्लो सिमुलेशन रन।
• गोपनीयता वॉल्ट: भारत के DPDP अधिनियम 2023 के अनुरूप पूर्ण डेटा नियंत्रण।

अस्वीकरण: लाइफस्टैक सांख्यिकीय निर्णय मार्गदर्शन प्रदान करता है और यह प्रमाणित वित्तीय या चिकित्सा सलाह नहीं है।
```

---

## 3. Google Play Data Safety Form Answers

| Question | Answer | Details / Justification |
| :--- | :--- | :--- |
| **Does your app collect or share user data?** | Yes | Data is collected strictly for core functionality and never sold to third parties. |
| **Is data encrypted in transit?** | Yes | All API traffic is encrypted via HTTPS / TLS 1.3. |
| **Do you provide a way for users to request data deletion?** | Yes | Instant single-click erasure cascade available directly in the Privacy Vault. |
| **Data Types Collected**: | | |
| - *Financial info (purchase history)* | Collected (Optional) | Staged in personal star-schema warehouse for expense analytics and budget alerts. |
| - *Health & Fitness info (sleep, steps)* | Collected (Optional) | Used for lifestyle correlation analysis; requires explicit category consent. |
| - *Personal info (name, email)* | Collected | Used solely for account authentication. |

---

## 4. Release Checklist & Graphic Assets
- [x] App Icon: 512x512 PNG (provided via `logo.svg` export)
- [x] Feature Graphic: 1024x500 PNG
- [x] Screenshots: Minimum 4 screenshots (1080x1920) showcasing Dashboard, Data Mining Lab, Copilot, and Simulator.
- [x] Privacy Policy URL: `https://lifestack.ai/legal`
- [x] Target Audience: Age 18+
